import { redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";

export default async function HomePage() {
  const access = await getAdminAccess();

  if (access.mode === "authenticated" || access.mode === "demo") {
    redirect("/admin");
  }

  redirect("/c/demo-buyer");
}
