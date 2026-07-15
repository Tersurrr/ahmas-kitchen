-- Product options/variants: each menu item can have any number of named,
-- individually priced options (e.g. Small/Medium/Large, Half Tray/Full Tray).
create table if not exists public.menu_item_options (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  sort_order integer not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Only one default option per menu item.
create unique index if not exists menu_item_options_one_default_per_item
  on public.menu_item_options (menu_item_id)
  where is_default;

alter table public.menu_item_options enable row level security;

-- Public (storefront) can read options for any item; only admins (service role /
-- authenticated via the existing admin session) can write. This mirrors the
-- existing policy shape used by menu_items/menu_images in this project.
drop policy if exists "menu_item_options_select_public" on public.menu_item_options;
create policy "menu_item_options_select_public"
  on public.menu_item_options for select
  using (true);

drop policy if exists "menu_item_options_write_authenticated" on public.menu_item_options;
create policy "menu_item_options_write_authenticated"
  on public.menu_item_options for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Indexes for frequently-filtered/joined columns (performance).
-- ---------------------------------------------------------------------------
create index if not exists menu_item_options_menu_item_id_idx
  on public.menu_item_options (menu_item_id, sort_order);

create index if not exists menu_items_category_id_idx
  on public.menu_items (category_id);

create index if not exists menu_items_sort_order_idx
  on public.menu_items (sort_order);

create index if not exists menu_items_is_available_idx
  on public.menu_items (is_available)
  where is_available;

create index if not exists menu_images_menu_item_id_idx
  on public.menu_images (menu_item_id, sort_order);

create index if not exists order_items_order_id_idx
  on public.order_items (order_id);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists categories_sort_order_idx
  on public.categories (sort_order);
