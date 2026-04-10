import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get consumer first
  const { data: consumer } = await supabase
    .from("api_consumers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!consumer) {
    return NextResponse.json({ keys: [] });
  }

  const { data: keys } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, environment, last_used_at, created_at")
    .eq("consumer_id", consumer.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ keys: keys || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: consumer } = await supabase
    .from("api_consumers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!consumer) {
    return NextResponse.json({ error: "Create a developer profile first" }, { status: 400 });
  }

  let body: { name: string; environment: "test" | "live" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name || !body.environment) {
    return NextResponse.json({ error: "name and environment are required" }, { status: 400 });
  }

  if (body.environment !== "test" && body.environment !== "live") {
    return NextResponse.json({ error: "environment must be 'test' or 'live'" }, { status: 400 });
  }

  const { plainKey, prefix, hash } = generateApiKey(body.environment);
  const keyHash = await hash;

  const { data: keyRow, error } = await supabase
    .from("api_keys")
    .insert({
      consumer_id: consumer.id,
      name: body.name,
      key_prefix: prefix,
      key_hash: keyHash,
      environment: body.environment,
    })
    .select("id, name, key_prefix, environment, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create key" }, { status: 500 });
  }

  // Return the plain key ONCE — it will never be shown again
  return NextResponse.json({ key: { ...keyRow, plain_key: plainKey } }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const keyId = url.searchParams.get("id");
  if (!keyId) return NextResponse.json({ error: "id required" }, { status: 400 });

  // Verify ownership via consumer
  const { data: consumer } = await supabase
    .from("api_consumers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!consumer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", keyId)
    .eq("consumer_id", consumer.id);

  if (error) return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });

  return NextResponse.json({ success: true });
}
