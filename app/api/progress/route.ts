import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

type ProgressPayload = {
  token: string;
  taskId: string;
  isComplete: boolean;
};

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ mode: "demo" });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase unavailable" }, { status: 500 });
  }

  const payload = (await request.json()) as ProgressPayload;

  if (!payload.token || !payload.taskId) {
    return NextResponse.json({ error: "Missing token or taskId" }, { status: 400 });
  }

  const { data: clientRow, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("private_link_token", payload.token)
    .single();

  if (clientError || !clientRow) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const { data: checklistRow, error: checklistError } = await supabase
    .from("client_checklists")
    .select("id")
    .eq("client_id", clientRow.id)
    .eq("status", "active")
    .single();

  if (checklistError || !checklistRow) {
    return NextResponse.json({ error: "Checklist not found" }, { status: 404 });
  }

  const { error: upsertError } = await supabase.from("checklist_progress").upsert(
    {
      client_checklist_id: checklistRow.id,
      client_task_override_id: payload.taskId,
      is_complete: payload.isComplete
    },
    { onConflict: "client_checklist_id,client_task_override_id" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
