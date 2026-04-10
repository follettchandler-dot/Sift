import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";
import { parseReceiptImage } from "@/lib/ai/parse-receipt-image";
import { categorizeItems } from "@/lib/ai/categorize";

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await getAuthenticatedSupabase(req);

  const formData = await req.formData();
  const file = formData.get("receipt") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No receipt file provided" }, { status: 400 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || "image/jpeg";

  // Parse receipt image directly with Gemini Vision (one-shot OCR + structured extraction)
  let parsed;
  try {
    parsed = await parseReceiptImage(imageBuffer, mimeType);
  } catch (err) {
    console.error("Receipt parse failed:", err);
    return NextResponse.json({ error: "Could not parse receipt image" }, { status: 422 });
  }

  // Step 3: Fetch categories from DB
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, parent_id")
    .eq("type", "consumer");

  // Build category list with parent names for AI context
  const categoryMap = new Map(
    (categories || []).map((c) => [c.id, c])
  );
  const categoryList = (categories || []).map((c) => ({
    slug: c.slug,
    name: c.name,
    parent_name: c.parent_id ? categoryMap.get(c.parent_id)?.name ?? null : null,
  }));

  // Step 4: AI categorize items
  const itemsForCategorization = parsed.items.map((item) => ({
    name: item.name,
    merchant_name: parsed.merchant_name,
  }));

  const categorized = await categorizeItems(itemsForCategorization, categoryList);

  // Step 5: Upload image to Supabase Storage
  const fileName = `${user.id}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(fileName, imageBuffer, {
      contentType: file.type,
      upsert: false,
    });

  let receiptImageUrl: string | null = null;
  if (!uploadError && uploadData) {
    const { data: urlData } = supabase.storage
      .from("receipts")
      .getPublicUrl(uploadData.path);
    receiptImageUrl = urlData.publicUrl;
  }

  // Step 6: Create receipt in DB
  const { data: receipt, error: receiptError } = await supabase
    .from("receipts")
    .insert({
      user_id: user.id,
      merchant_name: parsed.merchant_name,
      total: parsed.total_amount,
      transaction_date: parsed.transaction_date,
      source: "upload",
      processing_status: "complete",
      receipt_image_url: receiptImageUrl,
      metadata: {
        tax_amount: parsed.tax_amount,
        tip_amount: parsed.tip_amount,
      },
    })
    .select()
    .single();

  if (receiptError || !receipt) {
    return NextResponse.json({ error: "Failed to create receipt" }, { status: 500 });
  }

  // Step 7: Create receipt items
  const slugToCategory = new Map(
    (categories || []).map((c) => [c.slug, c])
  );

  const itemsToInsert = parsed.items.map((item, i) => {
    const categorization = categorized[i];
    const matchedCategory = categorization
      ? slugToCategory.get(categorization.category_slug)
      : null;

    return {
      receipt_id: receipt.id,
      category_id: matchedCategory?.id ?? null,
      description: item.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      confidence_score: categorization?.confidence ?? null,
      metadata: {
        tax_category_slug: categorization?.tax_category_slug ?? null,
      },
    };
  });

  const { data: items, error: itemsError } = await supabase
    .from("receipt_items")
    .insert(itemsToInsert)
    .select(`
      *,
      category:categories(id, name, slug, parent_id)
    `);

  if (itemsError) {
    return NextResponse.json({ error: "Failed to create receipt items" }, { status: 500 });
  }

  return NextResponse.json({ ...receipt, items: items || [] });
}
