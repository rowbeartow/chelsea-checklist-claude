import { createSupabaseAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { createSupabaseServerClient, isSupabaseAuthConfigured } from "@/lib/supabase/server";

export type AdminAccess =
  | {
      mode: "demo";
    }
  | {
      mode: "authenticated";
      email: string;
    }
  | {
      mode: "requires_login";
    }
  | {
      mode: "forbidden";
      email: string;
    };

export async function getAdminAccess(): Promise<AdminAccess> {
  if (!isSupabaseAuthConfigured() || !isSupabaseAdminConfigured()) {
    return { mode: "demo" };
  }

  const serverClient = await createSupabaseServerClient();

  if (!serverClient) {
    return { mode: "demo" };
  }

  const {
    data: { user }
  } = await serverClient.auth.getUser();

  if (!user?.id || !user.email) {
    return { mode: "requires_login" };
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return { mode: "demo" };
  }

  const { data: profile } = await adminClient.from("users").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") {
    return {
      mode: "forbidden",
      email: user.email
    };
  }

  return {
    mode: "authenticated",
    email: user.email
  };
}
