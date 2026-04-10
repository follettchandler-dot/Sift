import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await getAuthenticatedSupabase(req);

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select(`
      id, merchant_name, merchant_logo_url, amount, iso_currency_code,
      date, pending, payment_channel, category_primary, category_detailed,
      receipt_id,
      receipt:receipts(id, merchant_name, total, receipt_items(id, description, total_price, category:categories(name, slug)))
    `)
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(transactions || []);
}
