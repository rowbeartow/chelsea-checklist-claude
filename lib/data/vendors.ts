import { vendors } from "@/lib/seed-data";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Vendor } from "@/lib/types";

type VendorRow = {
  id: string;
  name: string;
  category: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  client_facing_note: string;
  service_area: string;
  is_active: boolean;
  site_domain: string | null;
  site_favicon_url: string | null;
  site_image_url: string | null;
};

function mapVendor(row: VendorRow): Vendor {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    contactName: row.contact_name ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    clientFacingNote: row.client_facing_note,
    serviceArea: row.service_area,
    isActive: row.is_active,
    siteDomain: row.site_domain ?? undefined,
    siteFaviconUrl: row.site_favicon_url ?? undefined,
    siteImageUrl: row.site_image_url ?? undefined
  };
}

export async function getVendorsForAdmin(): Promise<Vendor[]> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return vendors;
  }

  const { data, error } = await supabase
    .from("vendors")
    .select(
      "id, name, category, contact_name, phone, email, website, client_facing_note, service_area, is_active, site_domain, site_favicon_url, site_image_url"
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !data?.length) {
    return vendors;
  }

  return (data as VendorRow[]).map(mapVendor);
}
