import { NextResponse } from "next/server";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getAuthenticatedSupabase(req);

  const { data: plaidItems, error } = await supabase
    .from("plaid_items")
    .select("id, institution_name, last_synced_at, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch bank connections" }, { status: 500 });
  }

  if (!plaidItems || plaidItems.length === 0) {
    return NextResponse.json({ items: [] });
  }

  // Get account counts per item
  const itemIds = plaidItems.map((i) => i.id);
  const { data: accounts } = await supabase
    .from("plaid_accounts")
    .select("plaid_item_id")
    .in("plaid_item_id", itemIds);

  const countMap = new Map<string, number>();
  for (const acct of accounts ?? []) {
    countMap.set(acct.plaid_item_id, (countMap.get(acct.plaid_item_id) ?? 0) + 1);
  }

  const items = plaidItems.map((item) => ({
    id: item.id,
    institution_name: item.institution_name,
    last_synced_at: item.last_synced_at,
    account_count: countMap.get(item.id) ?? 0,
  }));

  return NextResponse.json({ items });
}
