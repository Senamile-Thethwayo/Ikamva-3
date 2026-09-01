-- Run this entire file in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste → Run

-- ── PROFILES ─────────────────────────────────────────────────
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  name            text,
  age             text,
  gender          text,
  school          text,
  grade           text,
  career_interest text,
  bio             text,
  phone           text,
  location        text,
  profile_pic     text,
  created_at      timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Users can only read/write their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ── TASKS ────────────────────────────────────────────────────
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  priority    text default 'medium',
  status      text default 'pending',
  due_date    text,
  created_at  timestamp with time zone default now()
);

alter table tasks enable row level security;

create policy "Users can view own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- ── Auto-create profile on signup ────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
