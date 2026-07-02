/**
 * One-time Supabase seed script.
 * Run with: npx tsx scripts/seed-supabase.ts
 *
 * Requires these env vars to be set (in .env.local or shell):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { masterTemplates, vendors } from "../lib/seed-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

async function seedVendors() {
  console.log("Seeding vendors…");
  const rows = vendors.map((v, index) => ({
    id: v.id,
    name: v.name,
    category: v.category,
    contact_name: v.contactName ?? null,
    phone: v.phone ?? null,
    email: v.email ?? null,
    website: v.website ?? null,
    client_facing_note: v.clientFacingNote ?? "",
    internal_notes: "",
    service_area: v.serviceArea ?? "",
    is_active: v.isActive,
    site_domain: v.siteDomain ?? null,
    site_favicon_url: v.siteFaviconUrl ?? null,
    site_image_url: v.siteImageUrl ?? null,
    sort_order: index
  }));

  const { error } = await supabase.from("vendors").upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`vendors: ${error.message}`);
  console.log(`  ✓ ${rows.length} vendors`);
}

async function seedTemplates() {
  console.log("Seeding templates…");

  for (const template of masterTemplates) {
    const { error: tErr } = await supabase.from("templates").upsert(
      {
        id: template.id,
        name: template.name,
        journey_type: template.journeyType,
        version: template.version,
        is_default: true,
        archived_at: null
      },
      { onConflict: "id" }
    );
    if (tErr) throw new Error(`template ${template.id}: ${tErr.message}`);

    for (const stage of template.stages) {
      const { error: sErr } = await supabase.from("stages").upsert(
        {
          id: stage.id,
          template_id: template.id,
          journey_track: stage.journeyTrack ?? template.journeyType,
          title: stage.title,
          short_description: stage.shortDescription,
          rich_content_json: stage.richContent.json,
          rich_content_html: stage.richContent.html,
          sort_order: stage.sortOrder,
          archived_at: null
        },
        { onConflict: "id" }
      );
      if (sErr) throw new Error(`stage ${stage.id}: ${sErr.message}`);

      for (const task of stage.tasks) {
        const { error: taskErr } = await supabase.from("tasks").upsert(
          {
            id: task.id,
            stage_id: stage.id,
            title: task.title,
            helper_text: task.helperText,
            rich_content_json: task.richContent.json,
            rich_content_html: task.richContent.html,
            call_chelsea_note: task.callChelseaNote ?? null,
            task_role: task.taskRole === "sign_agreement" ? "sign_agreement" : null,
            sort_order: task.sortOrder,
            is_required: task.isRequired,
            archived_at: null
          },
          { onConflict: "id" }
        );
        if (taskErr) throw new Error(`task ${task.id}: ${taskErr.message}`);
      }
    }

    const stageCount = template.stages.length;
    const taskCount = template.stages.reduce((n, s) => n + s.tasks.length, 0);
    console.log(`  ✓ ${template.name}: ${stageCount} stages, ${taskCount} tasks`);
  }
}

async function main() {
  try {
    await seedVendors();
    await seedTemplates();
    console.log("\nSeed complete. Supabase is ready.");
  } catch (err) {
    console.error("\nSeed failed:", err);
    process.exit(1);
  }
}

main();
