-- Central role predicate. Authorization data belongs in app_metadata because
-- authenticated users cannot edit it themselves.
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- The login limiter is server-only. The previous public EXECUTE grant allowed
-- anyone with the publishable key to lock an administrator out.
revoke all on function public.consume_admin_login_rate_limit(text, text) from public;
revoke all on function public.consume_admin_login_rate_limit(text, text) from anon, authenticated;
grant execute on function public.consume_admin_login_rate_limit(text, text) to service_role;

create index if not exists admin_login_rate_limits_reset_at_idx
  on public.admin_login_rate_limits (reset_at);

drop policy if exists "menu_item_options_write_authenticated" on public.menu_item_options;

-- Enforce admin-only writes even if an older permissive policy still exists.
-- Restrictive policies are ANDed with every permissive policy.
do $$
declare
  v_table text;
  v_policy text;
begin
  foreach v_table in array array[
    'categories',
    'menu_items',
    'menu_images',
    'menu_item_options',
    'videos',
    'settings',
    'orders',
    'order_items'
  ]
  loop
    if to_regclass('public.' || v_table) is null then
      continue;
    end if;

    execute format('alter table public.%I enable row level security', v_table);

    v_policy := v_table || '_admin_all';
    execute format('drop policy if exists %I on public.%I', v_policy, v_table);
    execute format(
      'create policy %I on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))',
      v_policy,
      v_table
    );

    v_policy := v_table || '_admin_insert_guard';
    execute format('drop policy if exists %I on public.%I', v_policy, v_table);
    execute format(
      'create policy %I on public.%I as restrictive for insert to public with check ((select public.is_admin()))',
      v_policy,
      v_table
    );

    v_policy := v_table || '_admin_update_guard';
    execute format('drop policy if exists %I on public.%I', v_policy, v_table);
    execute format(
      'create policy %I on public.%I as restrictive for update to public using ((select public.is_admin())) with check ((select public.is_admin()))',
      v_policy,
      v_table
    );

    v_policy := v_table || '_admin_delete_guard';
    execute format('drop policy if exists %I on public.%I', v_policy, v_table);
    execute format(
      'create policy %I on public.%I as restrictive for delete to public using ((select public.is_admin()))',
      v_policy,
      v_table
    );
  end loop;
end
$$;

-- Customer PII is private even if a legacy SELECT policy was permissive.
do $$
declare
  v_table text;
  v_policy text;
begin
  foreach v_table in array array['orders', 'order_items']
  loop
    if to_regclass('public.' || v_table) is null then
      continue;
    end if;

    v_policy := v_table || '_private_select_guard';
    execute format('drop policy if exists %I on public.%I', v_policy, v_table);
    execute format(
      'create policy %I on public.%I as restrictive for select to public using ((select public.is_admin()))',
      v_policy,
      v_table
    );
  end loop;
end
$$;

revoke all on table public.orders from anon;
revoke all on table public.order_items from anon;
grant select, insert, update, delete on table public.orders to authenticated;
grant select, insert, update, delete on table public.order_items to authenticated;

-- Protect the three buckets managed by the admin dashboard. These guards do
-- not change policies for unrelated buckets in the same Supabase project.
drop policy if exists "managed_media_admin_all" on storage.objects;
create policy "managed_media_admin_all"
  on storage.objects for all
  to authenticated
  using (
    bucket_id in ('menu-images', 'videos', 'video-thumbnails')
    and (select public.is_admin())
  )
  with check (
    bucket_id in ('menu-images', 'videos', 'video-thumbnails')
    and (select public.is_admin())
  );

drop policy if exists "managed_media_insert_guard" on storage.objects;
create policy "managed_media_insert_guard"
  on storage.objects as restrictive for insert
  to public
  with check (
    bucket_id not in ('menu-images', 'videos', 'video-thumbnails')
    or (select public.is_admin())
  );

drop policy if exists "managed_media_update_guard" on storage.objects;
create policy "managed_media_update_guard"
  on storage.objects as restrictive for update
  to public
  using (
    bucket_id not in ('menu-images', 'videos', 'video-thumbnails')
    or (select public.is_admin())
  )
  with check (
    bucket_id not in ('menu-images', 'videos', 'video-thumbnails')
    or (select public.is_admin())
  );

drop policy if exists "managed_media_delete_guard" on storage.objects;
create policy "managed_media_delete_guard"
  on storage.objects as restrictive for delete
  to public
  using (
    bucket_id not in ('menu-images', 'videos', 'video-thumbnails')
    or (select public.is_admin())
  );

-- Server-only order throttling: 5 orders per phone and 20 per trusted IP in
-- each 15-minute window.
create or replace function public.consume_public_order_rate_limit(
  p_phone text,
  p_ip text default null
)
returns table(allowed boolean, retry_after integer)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_now timestamptz := now();
  v_reset_at timestamptz := now() + interval '15 minutes';
begin
  if p_phone is null or length(trim(p_phone)) < 7 then
    raise exception 'phone is required';
  end if;

  delete from public.admin_login_rate_limits
    where reset_at < v_now - interval '1 day';

  return query
  with buckets(bucket, max_attempts) as (
    select 'order-phone:' || md5(regexp_replace(p_phone, '\D', '', 'g')), 5
    union all
    select 'order-ip:' || md5(trim(p_ip)), 20
      where nullif(trim(p_ip), '') is not null
  ), consumed as (
    insert into public.admin_login_rate_limits (bucket, attempt_count, reset_at)
    select bucket, 1, v_reset_at from buckets
    on conflict (bucket) do update
      set attempt_count = case
            when admin_login_rate_limits.reset_at <= v_now then 1
            else admin_login_rate_limits.attempt_count + 1
          end,
          reset_at = case
            when admin_login_rate_limits.reset_at <= v_now then v_reset_at
            else admin_login_rate_limits.reset_at
          end
    returning bucket, attempt_count, reset_at
  )
  select
    bool_and(consumed.attempt_count <= buckets.max_attempts),
    coalesce(
      max(ceil(extract(epoch from (consumed.reset_at - v_now)))::integer)
        filter (where consumed.attempt_count > buckets.max_attempts),
      0
    )
  from consumed
  join buckets using (bucket);
end;
$$;

revoke all on function public.consume_public_order_rate_limit(text, text) from public;
revoke all on function public.consume_public_order_rate_limit(text, text) from anon, authenticated;
grant execute on function public.consume_public_order_rate_limit(text, text) to service_role;

-- Creates an order transactionally and derives all names/prices from current
-- available menu records. No browser-supplied name, price, or total is trusted.
create or replace function public.create_public_order(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_fulfillment_type text,
  p_preferred_date text,
  p_preferred_time text,
  p_special_instructions text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid;
  v_total numeric(12, 2) := 0;
  v_lines jsonb := '[]'::jsonb;
  v_item jsonb;
  v_line jsonb;
  v_menu_item_id uuid;
  v_option_id uuid;
  v_item_name text;
  v_option_name text;
  v_notes text;
  v_quantity integer;
  v_unit_price numeric(10, 2);
begin
  if p_customer_name is null or length(trim(p_customer_name)) not between 1 and 100 then
    raise exception 'invalid customer name';
  end if;
  if p_phone is null or length(trim(p_phone)) not between 7 and 30 then
    raise exception 'invalid phone';
  end if;
  if p_fulfillment_type not in ('pickup', 'delivery') then
    raise exception 'invalid fulfillment type';
  end if;
  if p_fulfillment_type = 'delivery'
     and (p_address is null or length(trim(p_address)) not between 1 and 250) then
    raise exception 'delivery address required';
  end if;
  if coalesce(length(p_special_instructions), 0) > 500 then
    raise exception 'instructions too long';
  end if;
  if p_items is null
     or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) not between 1 and 30 then
    raise exception 'invalid order items';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item) <> 'object'
       or coalesce(v_item ->> 'menu_item_id', '') = ''
       or coalesce(v_item ->> 'quantity', '') !~ '^[0-9]+$' then
      raise exception 'invalid order item';
    end if;

    v_menu_item_id := (v_item ->> 'menu_item_id')::uuid;
    v_option_id := nullif(v_item ->> 'option_id', '')::uuid;
    v_quantity := (v_item ->> 'quantity')::integer;
    v_notes := nullif(trim(v_item ->> 'notes'), '');

    if v_quantity not between 1 and 50 or coalesce(length(v_notes), 0) > 500 then
      raise exception 'invalid quantity or notes';
    end if;

    select name, price
      into v_item_name, v_unit_price
      from public.menu_items
      where id = v_menu_item_id and is_available = true;
    if not found then
      raise exception 'menu item unavailable';
    end if;

    v_option_name := null;
    if v_option_id is not null then
      select name, price
        into v_option_name, v_unit_price
        from public.menu_item_options
        where id = v_option_id and menu_item_id = v_menu_item_id;
      if not found then
        raise exception 'menu option unavailable';
      end if;
    elsif exists (
      select 1 from public.menu_item_options where menu_item_id = v_menu_item_id
    ) then
      raise exception 'menu option required';
    end if;

    if v_unit_price is null or v_unit_price < 0 then
      raise exception 'invalid menu price';
    end if;

    v_total := v_total + (v_unit_price * v_quantity);
    if v_total > 100000 then
      raise exception 'order total too large';
    end if;

    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'menuItemId', v_menu_item_id,
      'optionId', v_option_id,
      'optionName', v_option_name,
      'name', v_item_name,
      'price', v_unit_price,
      'quantity', v_quantity,
      'specialInstructions', v_notes
    ));
  end loop;

  insert into public.orders (
    customer_name,
    phone,
    address,
    fulfillment_type,
    preferred_date,
    preferred_time,
    special_instructions,
    total_price
  )
  values (
    trim(p_customer_name),
    trim(p_phone),
    case when p_fulfillment_type = 'delivery' then trim(p_address) else null end,
    p_fulfillment_type,
    nullif(p_preferred_date, '')::date,
    nullif(p_preferred_time, '')::time,
    nullif(trim(p_special_instructions), ''),
    v_total
  )
  returning id into v_order_id;

  for v_line in select value from jsonb_array_elements(v_lines)
  loop
    insert into public.order_items (
      order_id,
      menu_item_id,
      name,
      quantity,
      unit_price,
      notes
    )
    values (
      v_order_id,
      (v_line ->> 'menuItemId')::uuid,
      case
        when nullif(v_line ->> 'optionName', '') is null then v_line ->> 'name'
        else (v_line ->> 'name') || ' (' || (v_line ->> 'optionName') || ')'
      end,
      (v_line ->> 'quantity')::integer,
      (v_line ->> 'price')::numeric,
      nullif(v_line ->> 'specialInstructions', '')
    );
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'total', v_total,
    'items', v_lines
  );
end;
$$;

revoke all on function public.create_public_order(
  text, text, text, text, text, text, text, jsonb
) from public;
revoke all on function public.create_public_order(
  text, text, text, text, text, text, text, jsonb
) from anon, authenticated;
grant execute on function public.create_public_order(
  text, text, text, text, text, text, text, jsonb
) to service_role;
