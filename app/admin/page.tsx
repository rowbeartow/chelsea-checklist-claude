import { redirect } from "next/navigation";
import { AdminTemplateEditor } from "@/components/AdminTemplateEditor";
import { getAdminAccess } from "@/lib/auth/admin";
import { getMasterTemplatesForAdmin } from "@/lib/data/templates";
import { getVendorsForAdmin } from "@/lib/data/vendors";
import { clientChecklists } from "@/lib/seed-data";

export default async function AdminPage() {
  const access = await getAdminAccess();

  if (access.mode === "requires_login") {
    redirect("/login?next=/admin");
  }

  if (access.mode === "forbidden") {
    redirect("/login?error=not_admin&next=/admin");
  }

  const templates = await getMasterTemplatesForAdmin();
  const vendors = await getVendorsForAdmin();

  return (
    <AdminTemplateEditor
      adminEmail={access.mode === "authenticated" ? access.email : undefined}
      authMode={access.mode}
      clients={clientChecklists}
      initialTemplates={templates}
      vendors={vendors}
    />
  );
}
