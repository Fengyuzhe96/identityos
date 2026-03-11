-- ============================================
-- IdentityOS Phase 3: Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles table (1:1 with auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  vision text default '',
  anti_vision text default '',
  year_goal text default '',
  month_project text default '',
  constraints text default '',
  ego_level integer default 1 check (ego_level between 1 and 5),
  xp integer default 0,
  app_state text default 'onboarding' check (app_state in ('onboarding', 'dashboard', 'forcefield')),
  lens text default 'micro' check (lens in ('macro', 'micro')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Daily levers table
create table public.daily_levers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  feeling text check (feeling in ('alive', 'dead')),
  date date default current_date,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 3. State diary table (Alive/Dead history)
create table public.state_diary (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lever_text text not null,
  feeling text not null check (feeling in ('alive', 'dead')),
  xp_gained integer default 0,
  recorded_at timestamptz default now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

alter table public.profiles enable row level security;
alter table public.daily_levers enable row level security;
alter table public.state_diary enable row level security;

-- Profiles: users can only read/write their own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Daily levers: users can only CRUD their own levers
create policy "Users can view own levers"
  on public.daily_levers for select
  using (auth.uid() = user_id);

create policy "Users can insert own levers"
  on public.daily_levers for insert
  with check (auth.uid() = user_id);

create policy "Users can update own levers"
  on public.daily_levers for update
  using (auth.uid() = user_id);

create policy "Users can delete own levers"
  on public.daily_levers for delete
  using (auth.uid() = user_id);

-- State diary: users can only read/write their own entries
create policy "Users can view own diary"
  on public.state_diary for select
  using (auth.uid() = user_id);

create policy "Users can insert own diary"
  on public.state_diary for insert
  with check (auth.uid() = user_id);

-- ============================================
-- Trigger: auto-create profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Trigger: update updated_at on profiles
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- Indexes
-- ============================================

create index idx_daily_levers_user_date on public.daily_levers(user_id, date);
create index idx_state_diary_user_date on public.state_diary(user_id, recorded_at);
