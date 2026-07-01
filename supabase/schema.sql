create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.user_role as enum ('admin', 'client');
create type public.template_journey_type as enum ('buyer', 'seller');
create type public.client_journey_type as enum ('buyer', 'seller', 'buyer_seller');
create type public.checklist_status as enum ('draft', 'active', 'archived');
create type public.recommendation_scope as enum ('template_stage', 'template_task', 'client_stage', 'client_task');
create type public.recommendation_type as enum ('recommended', 'optional', 'backup');
create type public.media_asset_type as enum ('image', 'video', 'document');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email citext not null unique,
  role public.user_role not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext,
  journey_type public.client_journey_type not null,
  status public.checklist_status not null default 'draft',
  private_link_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  journey_type public.template_journey_type not null,
  is_default boolean not null default false,
  version integer not null default 1,
  archived_at timestamptz,
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.stages (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  journey_track public.template_journey_type,
  title text not null,
  short_description text not null default '',
  rich_content_json jsonb not null default '{}'::jsonb,
  rich_content_html text not null default '',
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references public.stages(id) on delete cascade,
  title text not null,
  helper_text text not null default '',
  rich_content_json jsonb not null default '{}'::jsonb,
  rich_content_html text not null default '',
  call_chelsea_note text,
  sort_order integer not null default 0,
  is_required boolean not null default true,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_checklists (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  current_stage_override_id uuid,
  status public.checklist_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_checklist_templates (
  id uuid primary key default gen_random_uuid(),
  client_checklist_id uuid not null references public.client_checklists(id) on delete cascade,
  source_template_id uuid not null references public.templates(id) on delete restrict,
  source_template_version integer not null,
  journey_track public.template_journey_type not null,
  created_at timestamptz not null default now(),
  unique (client_checklist_id, source_template_id)
);

create table public.client_stage_overrides (
  id uuid primary key default gen_random_uuid(),
  client_checklist_id uuid not null references public.client_checklists(id) on delete cascade,
  source_stage_id uuid references public.stages(id) on delete set null,
  journey_track public.template_journey_type,
  title text not null,
  short_description text not null default '',
  rich_content_json jsonb not null default '{}'::jsonb,
  rich_content_html text not null default '',
  sort_order integer not null default 0,
  is_current boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.client_checklists
  add constraint client_checklists_current_stage_fk
  foreign key (current_stage_override_id)
  references public.client_stage_overrides(id)
  on delete set null;

create table public.client_task_overrides (
  id uuid primary key default gen_random_uuid(),
  client_stage_override_id uuid not null references public.client_stage_overrides(id) on delete cascade,
  source_task_id uuid references public.tasks(id) on delete set null,
  title text not null,
  helper_text text not null default '',
  rich_content_json jsonb not null default '{}'::jsonb,
  rich_content_html text not null default '',
  call_chelsea_note text,
  sort_order integer not null default 0,
  is_required boolean not null default true,
  due_date date,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  contact_name text,
  phone text,
  email citext,
  website text,
  short_description text not null default '',
  internal_notes text not null default '',
  client_facing_note text not null default '',
  service_area text not null default '',
  tags text[] not null default '{}',
  logo_image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  site_title text,
  site_description text,
  site_domain text,
  site_favicon_url text,
  site_image_url text,
  metadata_fetched_at timestamptz,
  created_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vendor_recommendations (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  scope public.recommendation_scope not null,
  stage_id uuid references public.stages(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  client_stage_override_id uuid references public.client_stage_overrides(id) on delete cascade,
  client_task_override_id uuid references public.client_task_overrides(id) on delete cascade,
  client_facing_note text not null default '',
  internal_note text not null default '',
  recommendation_type public.recommendation_type not null default 'recommended',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_recommendations_exactly_one_target check (
    num_nonnulls(stage_id, task_id, client_stage_override_id, client_task_override_id) = 1
  ),
  constraint vendor_recommendations_scope_matches_target check (
    (scope = 'template_stage' and stage_id is not null) or
    (scope = 'template_task' and task_id is not null) or
    (scope = 'client_stage' and client_stage_override_id is not null) or
    (scope = 'client_task' and client_task_override_id is not null)
  )
);

create table public.client_vendor_recommendation_overrides (
  id uuid primary key default gen_random_uuid(),
  client_checklist_id uuid not null references public.client_checklists(id) on delete cascade,
  source_vendor_recommendation_id uuid references public.vendor_recommendations(id) on delete set null,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  scope public.recommendation_scope not null,
  client_stage_override_id uuid references public.client_stage_overrides(id) on delete cascade,
  client_task_override_id uuid references public.client_task_overrides(id) on delete cascade,
  client_facing_note text not null default '',
  internal_note text not null default '',
  recommendation_type public.recommendation_type not null default 'recommended',
  sort_order integer not null default 0,
  is_removed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_vendor_overrides_exactly_one_target check (
    num_nonnulls(client_stage_override_id, client_task_override_id) = 1
  ),
  constraint client_vendor_overrides_scope_matches_target check (
    (scope = 'client_stage' and client_stage_override_id is not null) or
    (scope = 'client_task' and client_task_override_id is not null)
  )
);

create table public.checklist_progress (
  id uuid primary key default gen_random_uuid(),
  client_checklist_id uuid not null references public.client_checklists(id) on delete cascade,
  client_task_override_id uuid not null references public.client_task_overrides(id) on delete cascade,
  is_complete boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (client_checklist_id, client_task_override_id)
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  uploaded_by_user_id uuid references public.users(id) on delete set null,
  file_url text not null,
  file_type public.media_asset_type not null,
  mime_type text,
  alt_text text not null default '',
  caption text not null default '',
  storage_bucket text not null default 'content-media',
  storage_path text,
  created_at timestamptz not null default now()
);

create index stages_template_sort_idx on public.stages(template_id, sort_order);
create index tasks_stage_sort_idx on public.tasks(stage_id, sort_order);
create index client_checklist_templates_checklist_idx on public.client_checklist_templates(client_checklist_id);
create index client_stage_overrides_checklist_sort_idx on public.client_stage_overrides(client_checklist_id, sort_order);
create index client_task_overrides_stage_sort_idx on public.client_task_overrides(client_stage_override_id, sort_order);
create index vendor_recommendations_stage_idx on public.vendor_recommendations(stage_id, sort_order);
create index vendor_recommendations_task_idx on public.vendor_recommendations(task_id, sort_order);
create index vendors_active_category_idx on public.vendors(is_active, category, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users
  for each row execute function public.set_updated_at();
create trigger clients_set_updated_at before update on public.clients
  for each row execute function public.set_updated_at();
create trigger templates_set_updated_at before update on public.templates
  for each row execute function public.set_updated_at();
create trigger stages_set_updated_at before update on public.stages
  for each row execute function public.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger client_checklists_set_updated_at before update on public.client_checklists
  for each row execute function public.set_updated_at();
create trigger client_stage_overrides_set_updated_at before update on public.client_stage_overrides
  for each row execute function public.set_updated_at();
create trigger client_task_overrides_set_updated_at before update on public.client_task_overrides
  for each row execute function public.set_updated_at();
create trigger vendors_set_updated_at before update on public.vendors
  for each row execute function public.set_updated_at();
create trigger vendor_recommendations_set_updated_at before update on public.vendor_recommendations
  for each row execute function public.set_updated_at();
create trigger client_vendor_recommendation_overrides_set_updated_at before update on public.client_vendor_recommendation_overrides
  for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.templates enable row level security;
alter table public.stages enable row level security;
alter table public.tasks enable row level security;
alter table public.client_checklists enable row level security;
alter table public.client_checklist_templates enable row level security;
alter table public.client_stage_overrides enable row level security;
alter table public.client_task_overrides enable row level security;
alter table public.vendors enable row level security;
alter table public.vendor_recommendations enable row level security;
alter table public.client_vendor_recommendation_overrides enable row level security;
alter table public.checklist_progress enable row level security;
alter table public.media_assets enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "Admins can manage users" on public.users
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage clients" on public.clients
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage templates" on public.templates
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage stages" on public.stages
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage tasks" on public.tasks
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage checklists" on public.client_checklists
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage checklist source templates" on public.client_checklist_templates
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage stage overrides" on public.client_stage_overrides
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage task overrides" on public.client_task_overrides
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage vendors" on public.vendors
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage vendor recommendations" on public.vendor_recommendations
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage client vendor overrides" on public.client_vendor_recommendation_overrides
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage progress" on public.checklist_progress
  for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins can manage media" on public.media_assets
  for all using (public.is_admin()) with check (public.is_admin());

-- Private client token reads should be served through a Next.js route or server action
-- that validates clients.private_link_token with the Supabase service role key.
-- Keep direct anonymous table reads disabled.
