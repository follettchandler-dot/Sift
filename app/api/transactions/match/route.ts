import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";
import { matchTransactionsToReceipts } from "@/lib/match-transactions";

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await getAuthenticatedSupabase(req);

  const result = await matchTransactionsToReceipts(supabase, user.id);
  return NextResponse.json(result);
}
