import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Match Plaid transactions to receipts based on:
 * - Same user
 * - Same date (within 2 days tolerance)
 * - Amount matches within $1 (Plaid amounts are sometimes slightly different)
 * - Merchant name similarity (fuzzy match)
 *
 * Only matches unmatched transactions (receipt_id IS NULL).
 * Returns count of newly matched.
 */
export async function matchTransactionsToReceipts(
  supabase: SupabaseClient,
  userId: string
): Promise<{ matched: number }> {
  // Fetch all unmatched transactions for this user
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, merchant_name, amount, date")
    .eq("user_id", userId)
    .is("receipt_id", null);

  if (!transactions || transactions.length === 0) {
    return { matched: 0 };
  }

  // Fetch all receipts for this user
  const { data: receipts } = await supabase
    .from("receipts")
    .select("id, merchant_name, total, transaction_date")
    .eq("user_id", userId);

  if (!receipts || receipts.length === 0) {
    return { matched: 0 };
  }

  let matched = 0;

  for (const tx of transactions) {
    if (!tx.merchant_name || tx.amount == null || !tx.date) continue;

    // Find best receipt match
    const txDate = new Date(tx.date);
    const txAmount = Math.abs(Number(tx.amount));
    const txMerchant = tx.merchant_name.toLowerCase();

    const match = receipts.find((r) => {
      if (!r.merchant_name || r.total == null || !r.transaction_date) return false;
      const rDate = new Date(r.transaction_date);
      const daysDiff = Math.abs((txDate.getTime() - rDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 2) return false;

      const amountDiff = Math.abs(Number(r.total) - txAmount);
      if (amountDiff > 1) return false;

      const rMerchant = r.merchant_name.toLowerCase();
      // Fuzzy match: either string contains the other, or shared word
      return (
        rMerchant.includes(txMerchant) ||
        txMerchant.includes(rMerchant) ||
        rMerchant.split(/\s+/).some((word: string) => word.length > 3 && txMerchant.includes(word))
      );
    });

    if (match) {
      await supabase
        .from("transactions")
        .update({ receipt_id: match.id })
        .eq("id", tx.id);
      matched++;
    }
  }

  return { matched };
}
