import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, trackUsage } from "@/lib/api-auth";
import { parseReceiptText } from "@/lib/ai/parse-receipt";
import { categorizeItems } from "@/lib/ai/categorize";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Valid API key required." },
      { status: 401 }
    );
  }

  let body: { text?: string; image_url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.text && !body.image_url) {
    return NextResponse.json(
      { error: "Bad Request", message: "Provide either `text` (OCR/receipt text) or `image_url`." },
      { status: 400 }
    );
  }

  try {
    // For image_url, fetch and convert to text via OCR (future)
    // For now, both paths use text parsing
    const inputText = body.text || `Image URL: ${body.image_url}`;

    const parsed = await parseReceiptText(inputText);

    // Load categories for item categorization
    const supabase = createServiceClient();
    const { data: categoryList } = await supabase
      .from("categories")
      .select("slug, name, parent_id")
      .order("level", { ascending: true });

    // Build parent name map
    const categoryMap = new Map<string, string>();
    if (categoryList) {
      for (const c of categoryList) {
        categoryMap.set(c.slug, c.name);
      }
    }

    const categoriesForAI = (categoryList || []).map((c) => ({
      slug: c.slug,
      name: c.name,
      parent_name: null as string | null,
    }));

    const itemsForCategorization = parsed.items.map((item) => ({
      name: item.name,
      merchant_name: parsed.merchant_name,
    }));

    const categorized = categoriesForAI.length > 0
      ? await categorizeItems(itemsForCategorization, categoriesForAI)
      : [];

    const categorizedMap = new Map(categorized.map((c) => [c.name, c]));

    const enrichedItems = parsed.items.map((item) => {
      const cat = categorizedMap.get(item.name);
      return {
        ...item,
        category_slug: cat?.category_slug ?? null,
        tax_category_slug: cat?.tax_category_slug ?? null,
        confidence: cat?.confidence ?? null,
      };
    });

    await trackUsage({
      apiKeyId: auth.apiKey.id,
      consumerId: auth.consumer.id,
      endpoint: "/v1/parse",
      statusCode: 200,
      receiptsProcessed: 1,
      itemsProcessed: enrichedItems.length,
    });

    return NextResponse.json({
      merchant_name: parsed.merchant_name,
      transaction_date: parsed.transaction_date,
      total_amount: parsed.total_amount,
      tax_amount: parsed.tax_amount,
      tip_amount: parsed.tip_amount,
      items: enrichedItems,
      meta: {
        items_count: enrichedItems.length,
        environment: auth.apiKey.environment,
      },
    });
  } catch (err) {
    console.error("[v1/parse] error:", err);
    await trackUsage({
      apiKeyId: auth.apiKey.id,
      consumerId: auth.consumer.id,
      endpoint: "/v1/parse",
      statusCode: 500,
    });
    return NextResponse.json(
      { error: "Parse failed", message: "AI parsing encountered an error. Check your input and try again." },
      { status: 500 }
    );
  }
}
