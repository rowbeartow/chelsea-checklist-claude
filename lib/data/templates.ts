import { masterTemplates } from "@/lib/seed-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ChecklistStage, ChecklistTask, MasterTemplate, TemplateJourneyType } from "@/lib/types";

type TemplateRow = {
  id: string;
  name: string;
  journey_type: TemplateJourneyType;
  version: number;
};

type StageRow = {
  id: string;
  template_id: string;
  journey_track: TemplateJourneyType | null;
  title: string;
  short_description: string;
  rich_content_json: Record<string, unknown>;
  rich_content_html: string;
  sort_order: number;
};

type TaskRow = {
  id: string;
  stage_id: string;
  title: string;
  helper_text: string;
  rich_content_json: Record<string, unknown>;
  rich_content_html: string;
  call_chelsea_note: string | null;
  sort_order: number;
  is_required: boolean;
};

function mapTask(row: TaskRow): ChecklistTask {
  return {
    id: row.id,
    title: row.title,
    helperText: row.helper_text,
    richContent: {
      json: row.rich_content_json,
      html: row.rich_content_html
    },
    callChelseaNote: row.call_chelsea_note ?? undefined,
    sortOrder: row.sort_order,
    isRequired: row.is_required,
    isComplete: false,
    vendorRecommendations: []
  };
}

function mapStage(row: StageRow, tasks: TaskRow[]): ChecklistStage {
  return {
    id: row.id,
    journeyTrack: row.journey_track ?? undefined,
    title: row.title,
    shortDescription: row.short_description,
    richContent: {
      json: row.rich_content_json,
      html: row.rich_content_html
    },
    sortOrder: row.sort_order,
    isCurrent: false,
    vendorRecommendations: [],
    tasks: tasks.sort((a, b) => a.sort_order - b.sort_order).map(mapTask)
  };
}

export async function getMasterTemplatesForAdmin(): Promise<MasterTemplate[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return masterTemplates;
  }

  const { data: templateRows, error: templateError } = await supabase
    .from("templates")
    .select("id, name, journey_type, version")
    .is("archived_at", null)
    .order("journey_type", { ascending: true })
    .order("name", { ascending: true });

  if (templateError || !templateRows?.length) {
    return masterTemplates;
  }

  const templateIds = templateRows.map((template) => template.id);
  const { data: stageRows, error: stageError } = await supabase
    .from("stages")
    .select("id, template_id, journey_track, title, short_description, rich_content_json, rich_content_html, sort_order")
    .in("template_id", templateIds)
    .is("archived_at", null)
    .order("sort_order", { ascending: true });

  if (stageError || !stageRows) {
    return masterTemplates;
  }

  const stageIds = stageRows.map((stage) => stage.id);
  const { data: taskRows, error: taskError } = stageIds.length
    ? await supabase
        .from("tasks")
        .select(
          "id, stage_id, title, helper_text, rich_content_json, rich_content_html, call_chelsea_note, sort_order, is_required"
        )
        .in("stage_id", stageIds)
        .is("archived_at", null)
        .order("sort_order", { ascending: true })
    : { data: [], error: null };

  if (taskError || !taskRows) {
    return masterTemplates;
  }

  return (templateRows as TemplateRow[]).map((template) => {
    const stages = (stageRows as StageRow[])
      .filter((stage) => stage.template_id === template.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((stage) =>
        mapStage(
          stage,
          (taskRows as TaskRow[]).filter((task) => task.stage_id === stage.id)
        )
      );

    return {
      id: template.id,
      name: template.name,
      journeyType: template.journey_type,
      version: template.version,
      stages
    };
  });
}
