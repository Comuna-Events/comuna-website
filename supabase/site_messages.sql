-- Website form submissions (contact, host applications, support).
-- Run once in the Supabase SQL editor for the Comuna project.
-- Visitors can only INSERT; nobody can read rows through the public API.
-- View submissions in Supabase: Table Editor -> site_messages.

create table if not exists public.site_messages (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('contact', 'host', 'support')),
  name       text not null check (char_length(name) between 1 and 200),
  email      text not null check (char_length(email) between 3 and 320),
  message    text check (char_length(message) <= 5000),
  details    jsonb not null default '{}'::jsonb,
  page       text,
  created_at timestamptz not null default now()
);

alter table public.site_messages enable row level security;

drop policy if exists "website visitors can submit" on public.site_messages;
create policy "website visitors can submit"
  on public.site_messages for insert
  to anon, authenticated
  with check (true);

-- no select/update/delete policies: submissions are private to the project owners
