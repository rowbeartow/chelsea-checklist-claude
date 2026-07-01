import { NextRequest, NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

type VendorPayload = {
  id: string;
  name: string;
  category: string;
  contactName?: string;
  phone?: string;
  email?: string;
  website?: string;
  clientFacingNote: string;
  serviceArea: string;
  isActive: boolean;
  siteDomain?: string;
  siteFaviconUrl?: string;
  siteImageUrl?: string;
  internalNotes?: string;
};

export async function POST(request: NextRequest) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({
      mode: "demo",
      message: "Supabase is not configured. Vendor changes remain local in this demo."
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

  const payload = (await request.json()) as VendorPayload;

  if (!payload.id || !payload.name || !payload.category) {
    return NextResponse.json({ error: "Invalid vendor payload" }, { status: 400 });
  }

  const { error } = await supabase.from("vendors").upsert({
    id: payload.id,
    name: payload.name,
    category: payload.category,
    contact_name: payload.contactName || null,
    phone: payload.phone || null,
    email: payload.email || null,
    website: payload.website || null,
    client_facing_note: payload.clientFacingNote || "",
    internal_notes: payload.internalNotes || "",
    service_area: payload.serviceArea || "",
    is_active: payload.isActive,
    site_domain: payload.siteDomain || null,
    site_favicon_url: payload.siteFaviconUrl || null,
    site_image_url: payload.siteImageUrl || null,
    metadata_fetched_at: payload.siteDomain ? new Date().toISOString() : null
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    mode: "persisted",
    message: "Vendor saved to Supabase."
  });
}
