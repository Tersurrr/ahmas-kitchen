-- Adds support for multiple priced options per menu item (e.g. Small / Medium / Large,
-- Half Tray / Full Tray). A menu item with no rows here continues to behave exactly as
-- before: a single fixed price taken from menu_items.price.

create table if not exists public.menu_item_options (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  price numeric(10, 2) not null check (price >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists menu_item_options_menu_item_id_idx
  on public.menu_item_options (menu_item_id, sort_order);

alter table public.menu_item_options enable row level security;

-- Anyone (including anonymous storefront visitors) can read options so prices show
-- correctly on the public menu.
drop policy if exists "Public can view menu item options" on public.menu_item_options;
create policy "Public can view menu item options"
  on public.menu_item_options
  for select
  to anon, authenticated
  using (true);

-- Only signed-in admins can add, edit, delete, or reorder options.
drop policy if exists "Authenticated users can manage menu item options" on public.menu_item_options;
create policy "Authenticated users can manage menu item options"
  on public.menu_item_options
  for all
  to authenticated
  using (true)
  with check (true);
