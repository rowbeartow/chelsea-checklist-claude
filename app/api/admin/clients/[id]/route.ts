import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

type PatchPayload = {
  agreementLink?: string | null;
  agreementSigned?: boolean;
  status?: "active" | "archived";
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ mode: "demo" });
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
    return NextResponse.json({ error: "Supabase unavailable" }, { status: 500 });
  }

  const payload = (await request.json()) as PatchPayload;

  const updates: Record<string, unknown> = {};

  if ("agreementLink" in payload) {
    updates.agreement_link = payload.agreementLink ?? null;
  }

  if ("agreementSigned" in payload) {
    updates.agreement_signed = payload.agreementSigned;
  }

  if ("status" in payload) {
    updates.status = payload.status;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { error } = await supabase.from("clients").update(updates).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
