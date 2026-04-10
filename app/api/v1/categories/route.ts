import { NextResponse } from "next/server";
import { authenticateRequest, trackUsage } from "@/lib/api-auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Valid API key required." },
      { status: 401 }
    );
  }

  const supabase = createServiceClient();
  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, level")
    .order("level", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    await trackUsage({
      apiKeyId: auth.apiKey.id,
      consumerId: auth.consumer.id,
      endpoint: "/v1/categories",
      statusCode: 500,
    });
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }

  await trackUsage({
    apiKeyId: auth.apiKey.id,
    consumerId: auth.consumer.id,
    endpoint: "/v1/categories",
    statusCode: 200,
  });

  return NextResponse.json({ categories: categories || [] });
}
