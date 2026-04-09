import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: accounts } = await supabase
    .from("connected_accounts")
    .select("id, provider, metadata")
    .eq("user_id", user.id);

  const result: Record<string, { id: string; provider: string; metadata: Record<string, unknown> | null }> = {};
  for (const account of accounts || []) {
    result[account.provider] = account;
  }

  return NextResponse.json(result);
}
