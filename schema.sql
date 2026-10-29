-- Run this in Supabase SQL Editor. Keep service-role credentials server-side only.
create extension if not exists pgcrypto;

create table if not exists public.linkedin_hook_grades (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  company text,
  linkedin_url text,
  hook text not null,
  score integer not null check (score between 0 and 100),
  word_count integer not null default 0,
  rule_results jsonb not null default '[]'::jsonb,
  failed_feedback jsonb not null default '[]'::jsonb,
  rewrites jsonb not null default '[]'::jsonb,
  ai_provider text not null check (ai_provider in ('gemini', 'local-fallback')),
  source_tool text not null default 'linkedin_hook_grader'
);

alter table public.linkedin_hook_grades enable row level security;
-- No public SELECT/UPDATE/DELETE policies are granted. Writes are performed server-side
-- by the API route using the Supabase service-role key stored only in server env vars.
revoke all on public.linkedin_hook_grades from anon, authenticated;
grant all on public.linkedin_hook_grades to service_role;
