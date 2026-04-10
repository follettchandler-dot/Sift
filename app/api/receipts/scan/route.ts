import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getAuthenticatedSupabase } from "@/lib/supabase/auth";
import { parseReceiptImage } from "@/lib/ai/parse-receipt-image";
import { matchTransactionsToReceipts } from "@/lib/match-transactions";

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

  const arrayBuffer = await file.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  const mimeType = file.type || "image/jpeg";

  // Fetch categories + upload image to storage in parallel with AI call prep
  const categoriesPromise = supabase
    .from("categories")
    .select("id, slug, name, parent_id")
    .eq("type", "consumer");

  const fileName = `${user.id}/${Date.now()}-${file.name || "receipt.jpg"}`;
  const uploadPromise = supabase.storage
    .from("receipts")
    .upload(fileName, imageBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  // Wait for categories so we can pass them to the AI
  const { data: categories } = await categoriesPromise;
  const categoryMap = new Map((categories || []).map((c) => [c.id, c]));
  const categoryList = (categories || []).map((c) => ({
    slug: c.slug,
    name: c.name,
    parent_name: c.parent_id ? categoryMap.get(c.parent_id)?.name ?? null : null,
  }));

  // Run AI parse+categorize and storage upload in parallel
  let parsed;
  try {
    const [parseResult, uploadResult] = await Promise.all([
      parseReceiptImage(imageBuffer, mimeType, categoryList),
      uploadPromise,
    ]);
    parsed = parseResult;

    // Get public URL if upload succeeded
    let receiptImageUrl: string | null = null;
    if (!uploadResult.error && uploadResult.data) {
      const { data: urlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(uploadResult.data.path);
      receiptImageUrl = urlData.publicUrl;
    }

    // Create receipt
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

    // Insert items with pre-categorized data from AI
    const slugToCategory = new Map((categories || []).map((c) => [c.slug, c]));
    const itemsToInsert = parsed.items.map((item) => {
      const matchedCategory = slugToCategory.get(item.category_slug);
      return {
        receipt_id: receipt.id,
        category_id: matchedCategory?.id ?? null,
        description: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        confidence_score: item.confidence,
        metadata: {
          tax_category_slug: item.tax_category_slug,
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

    // Try to link this new receipt to any pending unmatched transactions
    await matchTransactionsToReceipts(supabase, user.id).catch(() => {});

    return NextResponse.json({ ...receipt, items: items || [] });
  } catch (err) {
    console.error("Scan failed:", err);
    return NextResponse.json({ error: "Could not parse receipt image" }, { status: 422 });
  }
}
