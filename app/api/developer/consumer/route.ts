import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: consumer } = await supabase
    .from("api_consumers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ consumer: consumer || null });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if already exists
  const { data: existing } = await supabase
    .from("api_consumers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Consumer profile already exists" }, { status: 409 });
  }

  let body: {
    name: string;
    company_name?: string;
    website?: string;
    use_case?: string;
    monthly_volume_estimate?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { data: consumer, error } = await supabase
    .from("api_consumers")
    .insert({
      user_id: user.id,
      email: user.email!,
      name: body.name,
      company_name: body.company_name || null,
      website: body.website || null,
      use_case: body.use_case || null,
      monthly_volume_estimate: body.monthly_volume_estimate || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create consumer" }, { status: 500 });
  }

  return NextResponse.json({ consumer }, { status: 201 });
}
