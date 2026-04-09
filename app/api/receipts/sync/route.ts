import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getGmailClient,
  refreshAccessToken,
  searchReceiptEmails,
  getEmailContent,
  extractTextFromHtml,
} from "@/lib/gmail";
import { parseReceiptText } from "@/lib/ai/parse-receipt";
import { categorizeItems } from "@/lib/ai/categorize";

const MAX_EMAILS_PER_SYNC = 20;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user's Gmail connected account
  const { data: account, error: accountError } = await supabase
    .from("connected_accounts")
    .select("*")
    .eq("user_id", user.id)
    .eq("provider", "gmail")
    .single();

  if (accountError || !account) {
    return NextResponse.json(
      { error: "Gmail account not connected" },
      { status: 400 }
    );
  }

  // Refresh token if expired (or if expiry is within 5 minutes)
  let accessToken: string = account.access_token;
  const expiresAt = account.token_expires_at
    ? new Date(account.token_expires_at).getTime()
    : 0;
  const fiveMinutes = 5 * 60 * 1000;

  if (!accessToken || Date.now() >= expiresAt - fiveMinutes) {
    if (!account.refresh_token) {
      return NextResponse.json(
        { error: "No refresh token available. Please reconnect Gmail." },
        { status: 400 }
      );
    }
    try {
      const refreshed = await refreshAccessToken(account.refresh_token);
      accessToken = refreshed.access_token!;

      // Persist refreshed tokens
      await supabase
        .from("connected_accounts")
        .update({
          access_token: accessToken,
          token_expires_at: refreshed.expiry_date
            ? new Date(refreshed.expiry_date).toISOString()
            : null,
        })
        .eq("id", account.id);
    } catch (err) {
      console.error("[receipts/sync] Token refresh failed:", err);
      return NextResponse.json(
        { error: "Token refresh failed. Please reconnect Gmail." },
        { status: 401 }
      );
    }
  }

  // Determine search window: since last sync or last 30 days
  const lastSyncedAt: string | null = account.metadata?.last_synced_at ?? null;
  const afterDate = lastSyncedAt
    ? new Date(lastSyncedAt)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const gmailClient = getGmailClient(accessToken);

  let messages;
  try {
    messages = await searchReceiptEmails(gmailClient, afterDate);
  } catch (err) {
    console.error("[receipts/sync] Gmail search failed:", err);
    return NextResponse.json(
      { error: "Failed to search Gmail" },
      { status: 502 }
    );
  }

  if (!messages.length) {
    await supabase
      .from("connected_accounts")
      .update({ metadata: { ...account.metadata, last_synced_at: new Date().toISOString() } })
      .eq("id", account.id);
    return NextResponse.json({ created: 0, skipped: 0 });
  }

  // Fetch categories once
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, parent_id")
    .eq("type", "consumer");

  const categoryMap = new Map((categories || []).map((c) => [c.id, c]));
  const categoryList = (categories || []).map((c) => ({
    slug: c.slug,
    name: c.name,
    parent_name: c.parent_id ? categoryMap.get(c.parent_id)?.name ?? null : null,
  }));
  const slugToCategory = new Map((categories || []).map((c) => [c.slug, c]));

  let created = 0;
  let skipped = 0;
  const toProcess = messages.slice(0, MAX_EMAILS_PER_SYNC);

  for (const msg of toProcess) {
    if (!msg.id) continue;

    // Skip already-processed emails
    const { data: existing } = await supabase
      .from("receipts")
      .select("id")
      .eq("user_id", user.id)
      .eq("raw_email_id", msg.id)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    // Fetch email content
    let emailData;
    try {
      emailData = await getEmailContent(gmailClient, msg.id);
    } catch (err) {
      console.error(`[receipts/sync] Failed to fetch email ${msg.id}:`, err);
      continue;
    }

    if (!emailData) continue;

    // Extract readable text
    const rawText = emailData.htmlBody
      ? extractTextFromHtml(emailData.htmlBody)
      : emailData.textBody ?? "";

    if (!rawText.trim()) continue;

    // AI parse
    let parsed;
    try {
      parsed = await parseReceiptText(rawText);
    } catch (err) {
      console.error(`[receipts/sync] Parse failed for ${msg.id}:`, err);
      continue;
    }

    if (!parsed.merchant_name || !parsed.total_amount) continue;

    // AI categorize
    let categorized: Awaited<ReturnType<typeof categorizeItems>> = [];
    try {
      const itemsForCat = parsed.items.map((item) => ({
        name: item.name,
        merchant_name: parsed.merchant_name,
      }));
      if (itemsForCat.length > 0) {
        categorized = await categorizeItems(itemsForCat, categoryList);
      }
    } catch (err) {
      console.error(`[receipts/sync] Categorize failed for ${msg.id}:`, err);
      // Non-fatal — proceed without categories
    }

    // Create receipt
    const { data: receipt, error: receiptError } = await supabase
      .from("receipts")
      .insert({
        user_id: user.id,
        merchant_name: parsed.merchant_name,
        total: parsed.total_amount,
        transaction_date: parsed.transaction_date,
        source: "gmail",
        processing_status: "complete",
        raw_email_id: msg.id,
        metadata: {
          tax_amount: parsed.tax_amount,
          tip_amount: parsed.tip_amount,
          email_subject: emailData.subject,
          email_from: emailData.from,
        },
      })
      .select()
      .single();

    if (receiptError || !receipt) {
      console.error(`[receipts/sync] Receipt insert failed for ${msg.id}:`, receiptError);
      continue;
    }

    // Create receipt items
    if (parsed.items.length > 0) {
      const itemsToInsert = parsed.items.map((item, i) => {
        const cat = categorized[i];
        const matchedCategory = cat ? slugToCategory.get(cat.category_slug) : null;
        return {
          receipt_id: receipt.id,
          category_id: matchedCategory?.id ?? null,
          description: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          confidence_score: cat?.confidence ?? null,
          metadata: {
            tax_category_slug: cat?.tax_category_slug ?? null,
          },
        };
      });

      const { error: itemsError } = await supabase
        .from("receipt_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error(`[receipts/sync] Items insert failed for receipt ${receipt.id}:`, itemsError);
      }
    }

    created++;
  }

  // Update last_synced_at in metadata
  await supabase
    .from("connected_accounts")
    .update({
      metadata: {
        ...account.metadata,
        last_synced_at: new Date().toISOString(),
      },
    })
    .eq("id", account.id);

  return NextResponse.json({ created, skipped, total: toProcess.length });
}
