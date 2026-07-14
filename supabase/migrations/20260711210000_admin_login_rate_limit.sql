create table if not exists public.admin_login_rate_limits (
  bucket text primary key,
  attempt_count integer not null check (attempt_count > 0),
  reset_at timestamptz not null
);

alter table public.admin_login_rate_limits enable row level security;
revoke all on table public.admin_login_rate_limits from anon, authenticated;

create or replace function public.consume_admin_login_rate_limit(
  p_email text,
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
  if p_email is null or length(trim(p_email)) = 0 then
    raise exception 'email is required';
  end if;

  -- md5 keeps raw email addresses and IP addresses out of the table.
  return query
  with buckets(bucket) as (
    select 'email:' || md5(lower(trim(p_email)))
    union all
    select 'ip:' || md5(trim(p_ip)) where nullif(trim(p_ip), '') is not null
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
    returning attempt_count, reset_at
  )
  select
    bool_and(attempt_count <= 5),
    coalesce(
      max(ceil(extract(epoch from (reset_at - v_now)))::integer)
        filter (where attempt_count > 5),
      0
    )
  from consumed;
end;
$$;

revoke all on function public.consume_admin_login_rate_limit(text, text) from public;
grant execute on function public.consume_admin_login_rate_limit(text, text) to anon, authenticated;
