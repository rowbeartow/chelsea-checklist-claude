# Chelsea Smart Checklist

A lean real estate checklist app for Chelsea's clients.

Phase 1 is intentionally simple:

- Next.js App Router, TypeScript, and Tailwind CSS
- Seeded buyer and seller checklist data
- Seeded buyer + seller checklist example for clients doing both transactions
- Private-link style client route at `/c/demo-buyer`
- Expandable stage notes and task details
- Clear task detail affordance with a `Details` label and chevron
- Polished vendor cards from seed recommendations
- Admin shell at `/admin` for the upcoming CMS workflow
- Supabase schema in `supabase/schema.sql`
- Supabase seed data in `supabase/seed.sql`
- Supabase data loaders with seed fallback when env vars are not set

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000/c/demo-buyer`.

Other demo links:

- `http://localhost:3000/c/demo-seller`
- `http://localhost:3000/c/demo-buyer-seller`

## Product Phases

1. Phase 1: app structure, static seed data, simple client checklist view.
2. Phase 2: Supabase persistence, admin login, template editor, stage/task CRUD and reordering.
3. Phase 3: TipTap rich text editor, image upload, safe video embeds.
4. Phase 4: vendor library, assignments, metadata fetch endpoint, vendor card preview.
5. Phase 5: client checklist creation from templates, client-specific overrides, private links, progress persistence.

## Database

The Supabase schema includes:

- `users`
- `clients`
- `templates`
- `stages`
- `tasks`
- `client_checklists`
- `client_stage_overrides`
- `client_task_overrides`
- `vendors`
- `vendor_recommendations`
- `client_vendor_recommendation_overrides`
- `checklist_progress`
- `media_assets`

Client token access should be handled through server-side Next.js code using the service role key. Direct anonymous table reads are intentionally not enabled in the schema.

## Supabase Setup

Create a `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Then run `supabase/schema.sql` in the Supabase SQL editor, followed by `supabase/seed.sql`.

Important: keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not expose it in browser code.

Until these environment variables exist, the app automatically uses local seed data so the demo keeps working.

## Admin Login

Local development without Supabase credentials keeps `/admin` in demo mode.

Once Supabase env vars are configured, `/admin` requires a Supabase Auth session and an admin row in `public.users`.

After creating Chelsea's user in Supabase Auth, run this in the Supabase SQL editor with her real auth user id and email:

```sql
insert into public.users (id, name, email, role)
values (
  'AUTH_USER_ID_FROM_SUPABASE',
  'Chelsea',
  'chelsea@example.com',
  'admin'
)
on conflict (id) do update set
  name = excluded.name,
  email = excluded.email,
  role = excluded.role;
```

Then Chelsea can sign in at `/login`.
