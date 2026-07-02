import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import type { TemplateJourneyType } from "@/lib/types";

type TemplatePayload = {
  id: string;
  name: string;
  journeyType: TemplateJourneyType;
  version: number;
  stages: Array<{
    id: string;
    journeyTrack?: TemplateJourneyType;
    title: string;
    shortDescription: string;
    richContent: {
      json: Record<string, unknown>;
      html: string;
    };
    sortOrder: number;
    archived?: boolean;
    tasks: Array<{
      id: string;
      title: string;
      helperText: string;
      richContent: {
        json: Record<string, unknown>;
        html: string;
      };
      callChelseaNote?: string;
      taskRole?: string;
      sortOrder: number;
      isRequired: boolean;
      archived?: boolean;
    }>;
  }>;
};

function archivedAt(isArchived?: boolean) {
  return isArchived ? new Date().toISOString() : null;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      mode: "demo",
      message: "Supabase is not configured. Template changes remain local in this demo."
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

  const payload = (await request.json()) as TemplatePayload;

  if (!payload.id || !payload.name || !payload.journeyType) {
    return NextResponse.json({ error: "Invalid template payload" }, { status: 400 });
  }

  const { error: templateError } = await supabase.from("templates").upsert({
    id: payload.id,
    name: payload.name,
    journey_type: payload.journeyType,
    version: payload.version,
    is_default: true,
    archived_at: null
  });

  if (templateError) {
    return NextResponse.json({ error: templateError.message }, { status: 500 });
  }

  for (const stage of payload.stages) {
    const { error: stageError } = await supabase.from("stages").upsert({
      id: stage.id,
      template_id: payload.id,
      journey_track: stage.journeyTrack ?? payload.journeyType,
      title: stage.title,
      short_description: stage.shortDescription,
      rich_content_json: stage.richContent.json,
      rich_content_html: stage.richContent.html,
      sort_order: stage.sortOrder,
      archived_at: archivedAt(stage.archived)
    });

    if (stageError) {
      return NextResponse.json({ error: stageError.message }, { status: 500 });
    }

    for (const task of stage.tasks) {
      const { error: taskError } = await supabase.from("tasks").upsert({
        id: task.id,
        stage_id: stage.id,
        title: task.title,
        helper_text: task.helperText,
        rich_content_json: task.richContent.json,
        rich_content_html: task.richContent.html,
        call_chelsea_note: task.callChelseaNote || null,
        task_role: task.taskRole === "sign_agreement" ? "sign_agreement" : null,
        sort_order: task.sortOrder,
        is_required: task.isRequired,
        archived_at: archivedAt(task.archived)
      });

      if (taskError) {
        return NextResponse.json({ error: taskError.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({
    mode: "persisted",
    message: "Template saved to Supabase."
  });
}
