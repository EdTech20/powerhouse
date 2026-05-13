create extension if not exists pgcrypto;

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text not null,
  category text not null,
  shoot_date_start date not null,
  shoot_date_end date,
  shoot_date text not null,
  union_type text,
  usage_terms text,
  archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint jobs_shoot_date_order check (
    shoot_date_end is null or shoot_date_end >= shoot_date_start
  )
);

create index if not exists jobs_created_at_idx on public.jobs (created_at desc);
create index if not exists jobs_archived_idx on public.jobs (archived);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists jobs_set_updated_at on public.jobs;

create trigger jobs_set_updated_at
before update on public.jobs
for each row
execute function public.set_updated_at();

alter table public.jobs enable row level security;

comment on table public.jobs is 'Booking jobs created from the BookingPro app.';

comment on column public.jobs.union_type is 'Maps to the UI field currently named isActra.';

-- Secure-by-default starter policies:
-- These require a signed-in user. If you are still prototyping without auth,
-- do not loosen these yet unless you are comfortable with public access.

drop policy if exists "Authenticated users can read jobs" on public.jobs;
create policy "Authenticated users can read jobs"
on public.jobs
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can create jobs" on public.jobs;
create policy "Authenticated users can create jobs"
on public.jobs
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update jobs" on public.jobs;
create policy "Authenticated users can update jobs"
on public.jobs
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete jobs" on public.jobs;
create policy "Authenticated users can delete jobs"
on public.jobs
for delete
to authenticated
using (true);
