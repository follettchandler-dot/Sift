import { NextResponse } from "next/server";
import { CountryCode } from "plaid";
import { plaid } from "@/lib/plaid";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { public_token } = body as { public_token: string };

  if (!public_token) {
    return NextResponse.json({ error: "public_token is required" }, { status: 400 });
  }

  try {
    // Exchange public token for access token
    const exchangeRes = await plaid.itemPublicTokenExchange({ public_token });
    const { access_token, item_id } = exchangeRes.data;

    // Get item details to find institution
    const itemRes = await plaid.itemGet({ access_token });
    const institutionId = itemRes.data.item.institution_id ?? null;

    let institutionName: string | null = null;
    if (institutionId) {
      try {
        const instRes = await plaid.institutionsGetById({
          institution_id: institutionId,
          country_codes: [CountryCode.Us],
        });
        institutionName = instRes.data.institution.name;
      } catch {
        // Non-fatal — institution name is cosmetic
      }
    }

    // Get accounts
    const accountsRes = await plaid.accountsGet({ access_token });
    const accounts = accountsRes.data.accounts;

    const supabase = await getAuthenticatedSupabase(req);

    // Upsert plaid_item
    const { data: plaidItem, error: itemError } = await supabase
      .from("plaid_items")
      .upsert(
        {
          user_id: user.id,
          plaid_item_id: item_id,
          plaid_access_token: access_token,
          institution_id: institutionId,
          institution_name: institutionName,
          status: "active",
        },
        { onConflict: "plaid_item_id" }
      )
      .select()
      .single();

    if (itemError || !plaidItem) {
      console.error("[plaid/exchange-token] Failed to save item:", itemError);
      return NextResponse.json({ error: "Failed to save bank connection" }, { status: 500 });
    }

    // Upsert accounts
    const accountRows = accounts.map((acct) => ({
      plaid_item_id: plaidItem.id,
      user_id: user.id,
      plaid_account_id: acct.account_id,
      name: acct.name,
      official_name: acct.official_name ?? null,
      type: acct.type,
      subtype: acct.subtype ?? null,
      mask: acct.mask ?? null,
      current_balance: acct.balances.current ?? null,
      available_balance: acct.balances.available ?? null,
      iso_currency_code: acct.balances.iso_currency_code ?? "USD",
    }));

    const { error: accountsError } = await supabase
      .from("plaid_accounts")
      .upsert(accountRows, { onConflict: "plaid_account_id" });

    if (accountsError) {
      console.error("[plaid/exchange-token] Failed to save accounts:", accountsError);
    }

    return NextResponse.json({
      item_id: plaidItem.id,
      institution_name: institutionName,
      account_count: accounts.length,
    });
  } catch (err) {
    console.error("[plaid/exchange-token] Error:", err);
    return NextResponse.json(
      { error: "Failed to exchange token" },
      { status: 502 }
    );
  }
}
