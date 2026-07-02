if (typeof globalThis.WebSocket === "undefined") {
  // @ts-expect-error minimal stub
  globalThis.WebSocket = class { constructor() {} close() {} };
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const userId = process.argv[2];

if (!userId) {
  console.error("Usage: npx tsx scripts/promote-admin.ts <user-id>");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  const { error } = await supabase
    .from("users")
    .upsert({ id: userId, role: "admin" }, { onConflict: "id" });

  if (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }

  const { data } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", userId)
    .single();

  console.log(`✓ User ${data?.id} is now role: ${data?.role}`);
}

main();
