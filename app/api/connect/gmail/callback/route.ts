import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens } from "@/lib/gmail";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error || !code) {
    console.error("[gmail/callback] OAuth error:", error);
    return NextResponse.redirect(`${appUrl}/connect?error=gmail_denied`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${appUrl}/login`);
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code);
  } catch (err) {
    console.error("[gmail/callback] Token exchange failed:", err);
    return NextResponse.redirect(`${appUrl}/connect?error=gmail_token`);
  }

  if (!tokens.access_token || !tokens.refresh_token) {
    console.error("[gmail/callback] Missing tokens in response");
    return NextResponse.redirect(`${appUrl}/connect?error=gmail_token`);
  }

  // Upsert connected account — use provider_account_id = user's Google sub if available
  const { error: dbError } = await supabase
    .from("connected_accounts")
    .upsert(
      {
        user_id: user.id,
        provider: "gmail",
        provider_account_id: user.id, // use Sift user id as stable key
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: tokens.expiry_date
          ? new Date(tokens.expiry_date).toISOString()
          : null,
        metadata: {},
      },
      { onConflict: "user_id,provider,provider_account_id" }
    );

  if (dbError) {
    console.error("[gmail/callback] DB upsert failed:", dbError);
    return NextResponse.redirect(`${appUrl}/connect?error=gmail_db`);
  }

  return NextResponse.redirect(`${appUrl}/connect?success=gmail`);
}
