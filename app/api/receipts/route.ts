import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await getAuthenticatedSupabase(req);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: receipts, error, count } = await supabase
    .from("receipts")
    .select(
      `
      *,
      receipt_items(
        *,
        category:categories(id, name, slug, parent_id)
      )
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch receipts" }, { status: 500 });
  }

  return NextResponse.json({
    receipts: receipts || [],
    total: count || 0,
    page,
    limit: PAGE_SIZE,
  });
}
