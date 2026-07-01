insert into public.templates (id, name, journey_type, is_default, version)
values
  ('10000000-0000-4000-8000-000000000001', 'Buyer master template', 'buyer', true, 1),
  ('10000000-0000-4000-8000-000000000002', 'Seller master template', 'seller', true, 1)
on conflict (id) do update set
  name = excluded.name,
  journey_type = excluded.journey_type,
  is_default = excluded.is_default,
  version = excluded.version;

insert into public.stages (
  id,
  template_id,
  journey_track,
  title,
  short_description,
  rich_content_json,
  rich_content_html,
  sort_order
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'buyer',
    'Getting Ready',
    'Start with readiness before serious shopping.',
    '{"type":"doc","content":[]}'::jsonb,
    '<h3>This stage is about getting clear before we start chasing houses.</h3><p>We are looking at your timeline, financing, comfortable payment, and what kind of home would actually fit your life.</p>',
    1
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    'buyer',
    'House Hunting',
    'Tour homes and refine what matters.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>As you tour, Chelsea is watching layout, resale potential, expensive systems, and tradeoffs that are hard to see online.</p>',
    2
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000002',
    'seller',
    'Prep the Property',
    'Choose the work that helps the sale without overdoing it.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>This is where we make the home easier for buyers to understand. Chelsea will help separate useful prep from projects that are unlikely to pay off.</p>',
    1
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000002',
    'seller',
    'Launch Listing',
    'Photos, pricing, showings, and first-week feedback.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>The first week matters. Chelsea will watch showing activity, buyer feedback, and whether the pricing story is landing.</p>',
    2
  )
on conflict (id) do update set
  template_id = excluded.template_id,
  journey_track = excluded.journey_track,
  title = excluded.title,
  short_description = excluded.short_description,
  rich_content_json = excluded.rich_content_json,
  rich_content_html = excluded.rich_content_html,
  sort_order = excluded.sort_order;

insert into public.tasks (
  id,
  stage_id,
  title,
  helper_text,
  rich_content_json,
  rich_content_html,
  call_chelsea_note,
  sort_order,
  is_required
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'Talk with a lender',
    'Confirm pre-approval and comfortable monthly payment.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>Before we start seriously shopping, we need to understand what you can buy and what payment feels comfortable.</p>',
    'If the payment, cash needed, or timeline feels different than expected, call Chelsea before you adjust your search.',
    1,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    'Share your must-haves',
    'Your list can change as we tour.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>Most buyers discover their real priorities as they tour homes. It is okay if the list changes.</p>',
    null,
    2,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000002',
    'Tour selected homes',
    'Focus on feel while Chelsea watches risk.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>You can focus on how the home feels. Chelsea will look at big-ticket items, location, layout, and future resale considerations.</p>',
    null,
    1,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000003',
    'Complete prep walkthrough',
    'Chelsea will identify the few changes that matter most.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>Walk room by room with Chelsea and make a short, practical prep list. The goal is clarity, not perfection.</p>',
    null,
    1,
    true
  ),
  (
    '30000000-0000-4000-8000-000000000005',
    '20000000-0000-4000-8000-000000000004',
    'Prepare for photos',
    'Small styling choices make listing photos easier to read.',
    '{"type":"doc","content":[]}'::jsonb,
    '<p>Clear counters, open blinds, and simple surfaces help buyers understand the space online.</p>',
    null,
    1,
    true
  )
on conflict (id) do update set
  stage_id = excluded.stage_id,
  title = excluded.title,
  helper_text = excluded.helper_text,
  rich_content_json = excluded.rich_content_json,
  rich_content_html = excluded.rich_content_html,
  call_chelsea_note = excluded.call_chelsea_note,
  sort_order = excluded.sort_order,
  is_required = excluded.is_required;

insert into public.clients (
  id,
  name,
  email,
  journey_type,
  status,
  private_link_token
)
values (
  '40000000-0000-4000-8000-000000000001',
  'Taylor and Sam',
  'taylor-sam@example.com',
  'buyer_seller',
  'active',
  'demo-buyer-seller'
)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  journey_type = excluded.journey_type,
  status = excluded.status,
  private_link_token = excluded.private_link_token;

insert into public.client_checklists (id, client_id, status)
values (
  '50000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001',
  'active'
)
on conflict (id) do update set
  client_id = excluded.client_id,
  status = excluded.status;

insert into public.client_checklist_templates (
  id,
  client_checklist_id,
  source_template_id,
  source_template_version,
  journey_track
)
values
  (
    '51000000-0000-4000-8000-000000000001',
    '50000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    1,
    'buyer'
  ),
  (
    '51000000-0000-4000-8000-000000000002',
    '50000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    1,
    'seller'
  )
on conflict (id) do update set
  client_checklist_id = excluded.client_checklist_id,
  source_template_id = excluded.source_template_id,
  source_template_version = excluded.source_template_version,
  journey_track = excluded.journey_track;

insert into public.client_stage_overrides (
  id,
  client_checklist_id,
  source_stage_id,
  journey_track,
  title,
  short_description,
  rich_content_json,
  rich_content_html,
  sort_order,
  is_current
)
select
  gen_random_uuid(),
  '50000000-0000-4000-8000-000000000001',
  stages.id,
  stages.journey_track,
  stages.title,
  stages.short_description,
  stages.rich_content_json,
  stages.rich_content_html,
  stages.sort_order,
  stages.sort_order = 1
from public.stages
where stages.id in (
  '20000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000003',
  '20000000-0000-4000-8000-000000000004'
)
and not exists (
  select 1
  from public.client_stage_overrides existing
  where existing.client_checklist_id = '50000000-0000-4000-8000-000000000001'
    and existing.source_stage_id = stages.id
);

insert into public.client_task_overrides (
  id,
  client_stage_override_id,
  source_task_id,
  title,
  helper_text,
  rich_content_json,
  rich_content_html,
  call_chelsea_note,
  sort_order,
  is_required
)
select
  gen_random_uuid(),
  client_stage_overrides.id,
  tasks.id,
  tasks.title,
  tasks.helper_text,
  tasks.rich_content_json,
  tasks.rich_content_html,
  tasks.call_chelsea_note,
  tasks.sort_order,
  tasks.is_required
from public.tasks
join public.client_stage_overrides
  on client_stage_overrides.source_stage_id = tasks.stage_id
where client_stage_overrides.client_checklist_id = '50000000-0000-4000-8000-000000000001'
and not exists (
  select 1
  from public.client_task_overrides existing
  where existing.client_stage_override_id = client_stage_overrides.id
    and existing.source_task_id = tasks.id
);
