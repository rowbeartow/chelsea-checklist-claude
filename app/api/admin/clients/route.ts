import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import type { ClientJourneyType, TemplateJourneyType } from "@/lib/types";

type CreateClientPayload = {
  name: string;
  email?: string;
  journeyType: ClientJourneyType;
  buyerTemplateId?: string;
  sellerTemplateId?: string;
};

function makeToken(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 28);

  return `${slug || "client"}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      mode: "demo",
      message: "Supabase is not configured. Client checklist remains local in this demo."
    });
  }

  const access = await getAdminAccess();

  if (access.mode === "requires_login") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (access.mode === "forbidden") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client unavailable" }, { status: 500 });
  }

  const payload = (await request.json()) as CreateClientPayload;

  if (!payload.name || !payload.journeyType) {
    return NextResponse.json({ error: "Invalid client payload" }, { status: 400 });
  }

  const selectedTemplateIds = [
    ...(payload.journeyType === "buyer" || payload.journeyType === "buyer_seller" ? [payload.buyerTemplateId] : []),
    ...(payload.journeyType === "seller" || payload.journeyType === "buyer_seller" ? [payload.sellerTemplateId] : [])
  ].filter((templateId): templateId is string => Boolean(templateId));

  if (!selectedTemplateIds.length) {
    return NextResponse.json({ error: "Select at least one source template" }, { status: 400 });
  }

  const token = makeToken(payload.name);
  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .insert({
      name: payload.name,
      email: payload.email || null,
      journey_type: payload.journeyType,
      status: "active",
      private_link_token: token
    })
    .select("id, private_link_token")
    .single();

  if (clientError || !clientRow) {
    return NextResponse.json({ error: clientError?.message ?? "Client creation failed" }, { status: 500 });
  }

  const { data: checklistRow, error: checklistError } = await supabase
    .from("client_checklists")
    .insert({
      client_id: clientRow.id,
      status: "active"
    })
    .select("id")
    .single();

  if (checklistError || !checklistRow) {
    return NextResponse.json({ error: checklistError?.message ?? "Checklist creation failed" }, { status: 500 });
  }

  const { data: templates, error: templatesError } = await supabase
    .from("templates")
    .select("id, journey_type, version")
    .in("id", selectedTemplateIds);

  if (templatesError || !templates) {
    return NextResponse.json({ error: templatesError?.message ?? "Template lookup failed" }, { status: 500 });
  }

  for (const template of templates as Array<{ id: string; journey_type: TemplateJourneyType; version: number }>) {
    const { error } = await supabase.from("client_checklist_templates").insert({
      client_checklist_id: checklistRow.id,
      source_template_id: template.id,
      source_template_version: template.version,
      journey_track: template.journey_type
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: stages, error: stagesError } = await supabase
      .from("stages")
      .select("id, journey_track, title, short_description, rich_content_json, rich_content_html, sort_order")
      .eq("template_id", template.id)
      .is("archived_at", null)
      .order("sort_order", { ascending: true });

    if (stagesError || !stages) {
      return NextResponse.json({ error: stagesError?.message ?? "Stage lookup failed" }, { status: 500 });
    }

    for (const stage of stages as Array<{
      id: string;
      journey_track: TemplateJourneyType | null;
      title: string;
      short_description: string;
      rich_content_json: Record<string, unknown>;
      rich_content_html: string;
      sort_order: number;
    }>) {
      const { data: clientStage, error: clientStageError } = await supabase
        .from("client_stage_overrides")
        .insert({
          client_checklist_id: checklistRow.id,
          source_stage_id: stage.id,
          journey_track: stage.journey_track ?? template.journey_type,
          title: stage.title,
          short_description: stage.short_description,
          rich_content_json: stage.rich_content_json,
          rich_content_html: stage.rich_content_html,
          sort_order: stage.sort_order,
          is_current: stage.sort_order === 1 && template.id === selectedTemplateIds[0]
        })
        .select("id")
        .single();

      if (clientStageError || !clientStage) {
        return NextResponse.json({ error: clientStageError?.message ?? "Client stage creation failed" }, { status: 500 });
      }

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("id, title, helper_text, rich_content_json, rich_content_html, call_chelsea_note, sort_order, is_required")
        .eq("stage_id", stage.id)
        .is("archived_at", null)
        .order("sort_order", { ascending: true });

      if (tasksError || !tasks) {
        return NextResponse.json({ error: tasksError?.message ?? "Task lookup failed" }, { status: 500 });
      }

      const taskRows = tasks.map((task) => ({
        client_stage_override_id: clientStage.id,
        source_task_id: task.id,
        title: task.title,
        helper_text: task.helper_text,
        rich_content_json: task.rich_content_json,
        rich_content_html: task.rich_content_html,
        call_chelsea_note: task.call_chelsea_note,
        sort_order: task.sort_order,
        is_required: task.is_required
      }));

      if (taskRows.length) {
        const { error: clientTasksError } = await supabase.from("client_task_overrides").insert(taskRows);

        if (clientTasksError) {
          return NextResponse.json({ error: clientTasksError.message }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({
    mode: "persisted",
    token: clientRow.private_link_token,
    message: "Client checklist created in Supabase."
  });
}
