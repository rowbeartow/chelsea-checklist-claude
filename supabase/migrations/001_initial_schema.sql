-- ============================================================
-- Chelsea Real Estate Checklist App — Initial Schema
-- Run this in the Supabase SQL editor once, top to bottom.
-- ============================================================


-- ── Users ────────────────────────────────────────────────────
-- Mirrors auth.users; stores role for admin access control.

create table if not exists public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

-- Auto-insert a row when someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.users enable row level security;
create policy "Users can read their own row"
  on public.users for select
  using (auth.uid() = id);


-- ── Vendors ──────────────────────────────────────────────────

create table if not exists public.vendors (
  id                   text primary key,
  name                 text not null,
  category             text not null,
  contact_name         text,
  phone                text,
  email                text,
  website              text,
  client_facing_note   text not null default '',
  internal_notes       text not null default '',
  service_area         text not null default '',
  is_active            boolean not null default true,
  site_domain          text,
  site_favicon_url     text,
  site_image_url       text,
  metadata_fetched_at  timestamptz,
  sort_order           integer not null default 0,
  created_at           timestamptz not null default now()
);

alter table public.vendors enable row level security;
create policy "Anyone can read active vendors"
  on public.vendors for select
  using (is_active = true);


-- ── Master Templates ─────────────────────────────────────────

create table if not exists public.templates (
  id           text primary key,
  name         text not null,
  journey_type text not null check (journey_type in ('buyer', 'seller')),
  version      integer not null default 1,
  is_default   boolean not null default false,
  archived_at  timestamptz,
  created_at   timestamptz not null default now()
);

create table if not exists public.stages (
  id                text primary key,
  template_id       text not null references public.templates (id) on delete cascade,
  journey_track     text check (journey_track in ('buyer', 'seller')),
  title             text not null,
  short_description text not null default '',
  rich_content_json jsonb not null default '{}',
  rich_content_html text not null default '',
  sort_order        integer not null default 0,
  archived_at       timestamptz,
  created_at        timestamptz not null default now()
);

create index if not exists stages_template_id_idx on public.stages (template_id);

create table if not exists public.tasks (
  id                text primary key,
  stage_id          text not null references public.stages (id) on delete cascade,
  title             text not null,
  helper_text       text not null default '',
  rich_content_json jsonb not null default '{}',
  rich_content_html text not null default '',
  call_chelsea_note text,
  task_role         text check (task_role in ('sign_agreement')),
  sort_order        integer not null default 0,
  is_required       boolean not null default true,
  archived_at       timestamptz,
  created_at        timestamptz not null default now()
);

create index if not exists tasks_stage_id_idx on public.tasks (stage_id);

alter table public.templates enable row level security;
alter table public.stages enable row level security;
alter table public.tasks enable row level security;

create policy "Anyone can read active templates"
  on public.templates for select using (archived_at is null);
create policy "Anyone can read active stages"
  on public.stages for select using (archived_at is null);
create policy "Anyone can read active tasks"
  on public.tasks for select using (archived_at is null);


-- ── Clients ──────────────────────────────────────────────────

create table if not exists public.clients (
  id                  text primary key default gen_random_uuid()::text,
  name                text not null,
  email               text,
  journey_type        text not null check (journey_type in ('buyer', 'seller', 'buyer_seller')),
  status              text not null default 'active' check (status in ('draft', 'active', 'archived')),
  private_link_token  text not null unique,
  agreement_link      text,
  agreement_signed    boolean not null default false,
  created_at          timestamptz not null default now()
);

create index if not exists clients_token_idx on public.clients (private_link_token);

-- Clients are read via service role only (server-side); no public policy needed.
alter table public.clients enable row level security;


-- ── Client Checklists ─────────────────────────────────────────

create table if not exists public.client_checklists (
  id         text primary key default gen_random_uuid()::text,
  client_id  text not null references public.clients (id) on delete cascade,
  status     text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists client_checklists_client_id_idx on public.client_checklists (client_id);

alter table public.client_checklists enable row level security;

create table if not exists public.client_checklist_templates (
  id                       text primary key default gen_random_uuid()::text,
  client_checklist_id      text not null references public.client_checklists (id) on delete cascade,
  source_template_id       text references public.templates (id) on delete set null,
  source_template_version  integer,
  journey_track            text check (journey_track in ('buyer', 'seller')),
  created_at               timestamptz not null default now()
);

alter table public.client_checklist_templates enable row level security;


-- ── Client Stage & Task Overrides ─────────────────────────────
-- Snapshot of template content at client creation time.
-- Editable per-client without touching the master template.

create table if not exists public.client_stage_overrides (
  id                    text primary key default gen_random_uuid()::text,
  client_checklist_id   text not null references public.client_checklists (id) on delete cascade,
  source_stage_id       text references public.stages (id) on delete set null,
  journey_track         text check (journey_track in ('buyer', 'seller')),
  title                 text not null,
  short_description     text not null default '',
  rich_content_json     jsonb not null default '{}',
  rich_content_html     text not null default '',
  sort_order            integer not null default 0,
  is_current            boolean not null default false,
  archived_at           timestamptz,
  created_at            timestamptz not null default now()
);

create index if not exists client_stage_overrides_checklist_idx
  on public.client_stage_overrides (client_checklist_id);

alter table public.client_stage_overrides enable row level security;

create table if not exists public.client_task_overrides (
  id                        text primary key default gen_random_uuid()::text,
  client_stage_override_id  text not null references public.client_stage_overrides (id) on delete cascade,
  source_task_id            text references public.tasks (id) on delete set null,
  title                     text not null,
  helper_text               text not null default '',
  rich_content_json         jsonb not null default '{}',
  rich_content_html         text not null default '',
  call_chelsea_note         text,
  task_role                 text check (task_role in ('sign_agreement')),
  sort_order                integer not null default 0,
  is_required               boolean not null default true,
  archived_at               timestamptz,
  created_at                timestamptz not null default now()
);

create index if not exists client_task_overrides_stage_idx
  on public.client_task_overrides (client_stage_override_id);

alter table public.client_task_overrides enable row level security;


-- ── Checklist Progress ────────────────────────────────────────
-- One row per task per checklist; upserted by the client.

create table if not exists public.checklist_progress (
  id                        text primary key default gen_random_uuid()::text,
  client_checklist_id       text not null references public.client_checklists (id) on delete cascade,
  client_task_override_id   text not null references public.client_task_overrides (id) on delete cascade,
  is_complete               boolean not null default false,
  updated_at                timestamptz not null default now(),
  unique (client_checklist_id, client_task_override_id)
);

create index if not exists checklist_progress_checklist_idx
  on public.checklist_progress (client_checklist_id);

alter table public.checklist_progress enable row level security;

-- Progress is written by the /api/progress route using the service role key,
-- which bypasses RLS. No public policy needed.


-- ============================================================
-- After running this migration:
--
-- 1. Go to Authentication → Users in Supabase dashboard
-- 2. Click "Invite user" and enter Chelsea's email
-- 3. Once she accepts the invite (or you use "Create user"),
--    find her user ID in the Users table
-- 4. Run this to make her an admin (replace the UUID):
--
--    update public.users
--    set role = 'admin'
--    where id = 'paste-chelsea-user-id-here';
--
-- 5. Set these env vars in Railway and redeploy:
--    NEXT_PUBLIC_SUPABASE_URL=
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=
--    SUPABASE_SERVICE_ROLE_KEY=
--    NEXT_PUBLIC_CHELSEA_NAME=Chelsea
--    NEXT_PUBLIC_CHELSEA_EMAIL=chelsea@...
--    NEXT_PUBLIC_CHELSEA_BUSINESS=...
-- ============================================================
