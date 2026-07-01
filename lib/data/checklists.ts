import { getChecklistByToken } from "@/lib/checklist";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ChecklistStage, ChecklistTask, ClientChecklist, ClientJourneyType, TemplateJourneyType } from "@/lib/types";

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  journey_type: ClientJourneyType;
  status: "draft" | "active" | "archived";
  private_link_token: string;
};

type ChecklistRow = {
  id: string;
  client_id: string;
  status: "draft" | "active" | "archived";
};

type ClientStageRow = {
  id: string;
  client_checklist_id: string;
  journey_track: TemplateJourneyType | null;
  title: string;
  short_description: string;
  rich_content_json: Record<string, unknown>;
  rich_content_html: string;
  sort_order: number;
  is_current: boolean;
};

type ClientTaskRow = {
  id: string;
  client_stage_override_id: string;
  title: string;
  helper_text: string;
  rich_content_json: Record<string, unknown>;
  rich_content_html: string;
  call_chelsea_note: string | null;
  sort_order: number;
  is_required: boolean;
};

type ProgressRow = {
  client_task_override_id: string;
  is_complete: boolean;
};

function fallbackChecklist(token: string) {
  return getChecklistByToken(token);
}

function mapClientTask(row: ClientTaskRow, progressRows: ProgressRow[]): ChecklistTask {
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
    isComplete: Boolean(progressRows.find((progress) => progress.client_task_override_id === row.id)?.is_complete),
    vendorRecommendations: []
  };
}

function mapClientStage(row: ClientStageRow, tasks: ClientTaskRow[], progressRows: ProgressRow[]): ChecklistStage {
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
    isCurrent: row.is_current,
    vendorRecommendations: [],
    tasks: tasks.sort((a, b) => a.sort_order - b.sort_order).map((task) => mapClientTask(task, progressRows))
  };
}

export async function getClientChecklistByToken(token: string): Promise<ClientChecklist | undefined> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return fallbackChecklist(token);
  }

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id, name, email, journey_type, status, private_link_token")
    .eq("private_link_token", token)
    .single();

  if (clientError || !clientRow) {
    return fallbackChecklist(token);
  }

  const { data: checklistRow, error: checklistError } = await supabase
    .from("client_checklists")
    .select("id, client_id, status")
    .eq("client_id", clientRow.id)
    .eq("status", "active")
    .single();

  if (checklistError || !checklistRow) {
    return fallbackChecklist(token);
  }

  const { data: stageRows, error: stageError } = await supabase
    .from("client_stage_overrides")
    .select(
      "id, client_checklist_id, journey_track, title, short_description, rich_content_json, rich_content_html, sort_order, is_current"
    )
    .eq("client_checklist_id", checklistRow.id)
    .is("archived_at", null)
    .order("sort_order", { ascending: true });

  if (stageError || !stageRows?.length) {
    return fallbackChecklist(token);
  }

  const stageIds = stageRows.map((stage) => stage.id);
  const { data: taskRows, error: taskError } = await supabase
    .from("client_task_overrides")
    .select(
      "id, client_stage_override_id, title, helper_text, rich_content_json, rich_content_html, call_chelsea_note, sort_order, is_required"
    )
    .in("client_stage_override_id", stageIds)
    .is("archived_at", null)
    .order("sort_order", { ascending: true });

  if (taskError || !taskRows) {
    return fallbackChecklist(token);
  }

  const taskIds = taskRows.map((task) => task.id);
  const { data: progressRows, error: progressError } = taskIds.length
    ? await supabase
        .from("checklist_progress")
        .select("client_task_override_id, is_complete")
        .eq("client_checklist_id", checklistRow.id)
        .in("client_task_override_id", taskIds)
    : { data: [], error: null };

  if (progressError || !progressRows) {
    return fallbackChecklist(token);
  }

  const stages = (stageRows as ClientStageRow[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((stage) =>
      mapClientStage(
        stage,
        (taskRows as ClientTaskRow[]).filter((task) => task.client_stage_override_id === stage.id),
        progressRows as ProgressRow[]
      )
    );

  return {
    id: (checklistRow as ChecklistRow).id,
    privateLinkToken: (clientRow as ClientRow).private_link_token,
    clientName: (clientRow as ClientRow).name,
    clientEmail: (clientRow as ClientRow).email ?? undefined,
    journeyType: (clientRow as ClientRow).journey_type,
    status: (checklistRow as ChecklistRow).status === "archived" ? "archived" : "active",
    stages
  };
}
