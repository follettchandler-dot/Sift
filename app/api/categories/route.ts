import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("level", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }

  return NextResponse.json({ categories: categories || [] })
}
