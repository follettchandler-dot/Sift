import { NextResponse } from "next/server";
import { plaid } from "@/lib/plaid";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await getAuthenticatedSupabase(req);

  // Get all active plaid items for this user
  const { data: plaidItems, error: itemsError } = await supabase
    .from("plaid_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (itemsError) {
    return NextResponse.json({ error: "Failed to fetch bank connections" }, { status: 500 });
  }

  if (!plaidItems || plaidItems.length === 0) {
    return NextResponse.json({ added: 0, modified: 0, removed: 0 });
  }

  // Get plaid_accounts to map plaid_account_id -> our DB uuid
  const { data: dbAccounts } = await supabase
    .from("plaid_accounts")
    .select("id, plaid_account_id")
    .eq("user_id", user.id);

  const accountIdMap = new Map(
    (dbAccounts || []).map((a) => [a.plaid_account_id, a.id])
  );

  let totalAdded = 0;
  let totalModified = 0;
  let totalRemoved = 0;

  for (const item of plaidItems) {
    try {
      let cursor: string | undefined = item.cursor ?? undefined;
      let hasMore = true;
      const added: Parameters<typeof supabase.from>[0] extends never ? never : object[] = [];
      const modified: object[] = [];
      const removedIds: string[] = [];

      // Page through all updates since last cursor
      while (hasMore) {
        const syncRes = await plaid.transactionsSync({
          access_token: item.plaid_access_token,
          cursor,
        });

        const data = syncRes.data;

        for (const txn of data.added) {
          const dbAccountId = accountIdMap.get(txn.account_id) ?? null;
          added.push({
            user_id: user.id,
            plaid_account_id: dbAccountId,
            plaid_transaction_id: txn.transaction_id,
            merchant_name: txn.merchant_name ?? txn.name ?? null,
            merchant_logo_url: txn.logo_url ?? null,
            amount: txn.amount,
            iso_currency_code: txn.iso_currency_code ?? "USD",
            date: txn.date,
            authorized_date: txn.authorized_date ?? null,
            pending: txn.pending,
            payment_channel: txn.payment_channel,
            category_primary: txn.personal_finance_category?.primary ?? null,
            category_detailed: txn.personal_finance_category?.detailed ?? null,
            location_city: txn.location?.city ?? null,
            location_region: txn.location?.region ?? null,
            metadata: {},
          });
        }

        for (const txn of data.modified) {
          const dbAccountId = accountIdMap.get(txn.account_id) ?? null;
          modified.push({
            user_id: user.id,
            plaid_account_id: dbAccountId,
            plaid_transaction_id: txn.transaction_id,
            merchant_name: txn.merchant_name ?? txn.name ?? null,
            merchant_logo_url: txn.logo_url ?? null,
            amount: txn.amount,
            iso_currency_code: txn.iso_currency_code ?? "USD",
            date: txn.date,
            authorized_date: txn.authorized_date ?? null,
            pending: txn.pending,
            payment_channel: txn.payment_channel,
            category_primary: txn.personal_finance_category?.primary ?? null,
            category_detailed: txn.personal_finance_category?.detailed ?? null,
            location_city: txn.location?.city ?? null,
            location_region: txn.location?.region ?? null,
            metadata: {},
          });
        }

        for (const txn of data.removed) {
          if (txn.transaction_id) removedIds.push(txn.transaction_id);
        }

        cursor = data.next_cursor;
        hasMore = data.has_more;
      }

      // Upsert added transactions
      if (added.length > 0) {
        const { error: addErr } = await supabase
          .from("transactions")
          .upsert(added, { onConflict: "plaid_transaction_id" });
        if (addErr) console.error("[plaid/sync] Upsert added error:", addErr);
        else totalAdded += added.length;
      }

      // Upsert modified transactions
      if (modified.length > 0) {
        const { error: modErr } = await supabase
          .from("transactions")
          .upsert(modified, { onConflict: "plaid_transaction_id" });
        if (modErr) console.error("[plaid/sync] Upsert modified error:", modErr);
        else totalModified += modified.length;
      }

      // Delete removed transactions
      if (removedIds.length > 0) {
        const { error: delErr } = await supabase
          .from("transactions")
          .delete()
          .in("plaid_transaction_id", removedIds)
          .eq("user_id", user.id);
        if (delErr) console.error("[plaid/sync] Delete removed error:", delErr);
        else totalRemoved += removedIds.length;
      }

      // Update cursor and last_synced_at on the item
      await supabase
        .from("plaid_items")
        .update({ cursor, last_synced_at: new Date().toISOString() })
        .eq("id", item.id);
    } catch (err) {
      console.error(`[plaid/sync] Error syncing item ${item.id}:`, err);
      // Mark item as errored but continue with other items
      await supabase
        .from("plaid_items")
        .update({ status: "error" })
        .eq("id", item.id);
    }
  }

  return NextResponse.json({
    added: totalAdded,
    modified: totalModified,
    removed: totalRemoved,
  });
}
