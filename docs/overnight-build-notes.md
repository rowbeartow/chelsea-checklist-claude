# Overnight Build Notes

## What to Review

Open:

- `/admin`
- `/login`
- `/c/demo-buyer`
- `/c/demo-buyer-seller`

## Admin Sections

### Templates

The template editor is now interactive:

- Switch buyer/seller master templates
- Add stages
- Edit stage title and short intro
- Edit stage details in a TipTap rich text editor
- Move stages up/down
- Archive, restore, and delete stages
- Add tasks
- Edit task title, helper text, required status, Chelsea note, and rich details
- Move tasks up/down
- Archive, restore, and delete tasks
- Save template through a persistence-ready endpoint

In local demo mode, save reports that Supabase is not configured. Once Supabase env vars and admin login are configured, the same endpoint upserts templates, stages, and tasks.

### Vendors

The vendor library now has a real admin workflow:

- Add/edit vendor records
- Track name, category, website, contact person, phone, email, service area, active status, client-facing note, and internal notes
- Pull site identity from a vendor URL through a server-side metadata endpoint
- Preview the polished client vendor card
- Save vendor through a persistence-ready endpoint

### Clients

The client section now scaffolds checklist creation:

- Create buyer, seller, or buyer + seller clients
- Choose source templates
- Generate a private client link
- Preview client checklist links
- Copy private links
- Persistence-ready endpoint can create real Supabase client checklist snapshots from selected templates

### Settings

Settings is a placeholder for:

- Supabase auth/storage configuration
- Branding controls
- Media rules

## Demo vs Real Persistence

This build is safe by default:

- Without Supabase env vars, everything keeps using seed/demo data.
- With Supabase env vars and an admin user, `/admin` requires login.
- Template, vendor, and client create/save endpoints are ready to persist to Supabase.

## Next Recommended Build

1. Run schema and seed SQL in a real Supabase project.
2. Create Chelsea's Supabase Auth user.
3. Add her row to `public.users` with role `admin`.
4. Test real admin login.
5. Verify template save, vendor save, and client creation against the database.
6. Add real image upload/video embed support through Supabase Storage.
