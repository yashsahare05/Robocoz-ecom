-- Robocoz database schema for Supabase Postgres (auth deferred)
-- Safe to re-run.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.order_status as enum (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.service_status as enum (
    'NEW',
    'IN_REVIEW',
    'QUOTED',
    'ACCEPTED',
    'IN_PRODUCTION',
    'COMPLETED'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_item_type as enum ('product', '3d-print', 'pcb');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  hero_image text,
  created_at timestamptz not null default now()
);

create table if not exists public.subcategories (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists public.brands (
  id text primary key,
  name text not null,
  description text,
  logo text,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  summary text not null,
  description text not null,
  category_id text not null references public.categories(id),
  subcategory_id text references public.subcategories(id),
  brand_id text not null references public.brands(id),
  specs jsonb not null default '{}'::jsonb,
  datasheet_url text,
  price numeric(12, 2) not null default 0,
  volume_pricing jsonb not null default '[]'::jsonb,
  images text[] not null default '{}',
  in_stock integer not null default 0,
  min_order_qty integer not null default 1,
  rating numeric(3, 2),
  tags text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_in_stock_check check (in_stock >= 0),
  constraint products_min_order_qty_check check (min_order_qty >= 1),
  constraint products_price_check check (price >= 0)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid,
  subtotal numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  shipping numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  status public.order_status not null default 'PENDING',
  shipping_address jsonb,
  billing_address jsonb,
  payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_subtotal_check check (subtotal >= 0),
  constraint orders_tax_check check (tax >= 0),
  constraint orders_shipping_check check (shipping >= 0),
  constraint orders_total_check check (total >= 0)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_type public.order_item_type not null,
  name text not null,
  quantity integer not null default 1,
  unit_price numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  meta jsonb,
  constraint order_items_quantity_check check (quantity >= 1),
  constraint order_items_unit_price_check check (unit_price >= 0),
  constraint order_items_total_check check (total >= 0)
);

create table if not exists public.printing_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status public.service_status not null default 'NEW',
  quote_mode boolean not null default false,
  estimated_price numeric(12, 2) not null default 0,
  payload jsonb not null,
  files text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint printing_orders_estimated_price_check check (estimated_price >= 0)
);

create table if not exists public.pcb_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  status public.service_status not null default 'NEW',
  quote_mode boolean not null default false,
  estimated_price numeric(12, 2) not null default 0,
  payload jsonb not null,
  files text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pcb_orders_estimated_price_check check (estimated_price >= 0)
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'products_set_updated_at'
  ) then
    execute 'create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at()';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'orders_set_updated_at'
  ) then
    execute 'create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at()';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'printing_orders_set_updated_at'
  ) then
    execute 'create trigger printing_orders_set_updated_at before update on public.printing_orders for each row execute function public.set_updated_at()';
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'pcb_orders_set_updated_at'
  ) then
    execute 'create trigger pcb_orders_set_updated_at before update on public.pcb_orders for each row execute function public.set_updated_at()';
  end if;
end $$;

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_subcategory_id_idx on public.products(subcategory_id);
create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists printing_orders_user_id_idx on public.printing_orders(user_id);
create index if not exists pcb_orders_user_id_idx on public.pcb_orders(user_id);
