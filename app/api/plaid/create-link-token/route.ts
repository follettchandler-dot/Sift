import { NextResponse } from "next/server";
import { Products, CountryCode } from "plaid";
import { plaid } from "@/lib/plaid";
import { getAuthenticatedUser } from "@/lib/supabase/auth";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await plaid.linkTokenCreate({
      user: { client_user_id: user.id },
      client_name: "Itemized",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error("[plaid/create-link-token] Error:", err);
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 502 }
    );
  }
}
