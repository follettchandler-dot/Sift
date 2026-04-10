import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, trackUsage } from "@/lib/api-auth";
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

  let body: { items?: { name: string; merchant?: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json(
      { error: "Bad Request", message: "Provide an `items` array with at least one item." },
      { status: 400 }
    );
  }

  if (body.items.length > 100) {
    return NextResponse.json(
      { error: "Bad Request", message: "Maximum 100 items per request." },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const { data: categoryList } = await supabase
      .from("categories")
      .select("slug, name, parent_id")
      .order("level", { ascending: true });

    const categoriesForAI = (categoryList || []).map((c) => ({
      slug: c.slug,
      name: c.name,
      parent_name: null as string | null,
    }));

    const merchantName = body.items[0]?.merchant || "unknown";
    const itemsForAI = body.items.map((i) => ({
      name: i.name,
      merchant_name: i.merchant || merchantName,
    }));

    const categorized = await categorizeItems(itemsForAI, categoriesForAI);

    await trackUsage({
      apiKeyId: auth.apiKey.id,
      consumerId: auth.consumer.id,
      endpoint: "/v1/categorize",
      statusCode: 200,
      itemsProcessed: categorized.length,
    });

    return NextResponse.json({
      items: categorized,
      meta: {
        items_count: categorized.length,
        environment: auth.apiKey.environment,
      },
    });
  } catch (err) {
    console.error("[v1/categorize] error:", err);
    await trackUsage({
      apiKeyId: auth.apiKey.id,
      consumerId: auth.consumer.id,
      endpoint: "/v1/categorize",
      statusCode: 500,
    });
    return NextResponse.json(
      { error: "Categorization failed", message: "AI categorization encountered an error." },
      { status: 500 }
    );
  }
}
