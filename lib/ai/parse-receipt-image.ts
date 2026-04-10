import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const receiptSchema = z.object({
  merchant_name: z.string().describe("Name of the store or merchant"),
  transaction_date: z.string().describe("Date of purchase in YYYY-MM-DD format"),
  total_amount: z.number().describe("Total amount paid"),
  tax_amount: z.number().nullable().describe("Tax amount, null if not found"),
  tip_amount: z.number().nullable().describe("Tip amount, null if not applicable"),
  items: z.array(
    z.object({
      name: z.string().describe("Item name as shown on receipt"),
      quantity: z.number().default(1).describe("Quantity purchased"),
      unit_price: z.number().describe("Price per unit"),
      total_price: z.number().describe("Total price for this line item"),
      category_slug: z.string().describe("The slug of the most specific matching category from the list provided"),
      tax_category_slug: z.string().nullable().describe("IRS Schedule C tax category slug if business expense, null for personal items"),
      confidence: z.number().min(0).max(1).describe("Confidence score for the categorization"),
    })
  ),
});

export type ParsedReceipt = z.infer<typeof receiptSchema>;

/**
 * Parse and categorize a receipt image in one Gemini Vision call.
 * Returns structured receipt data with pre-categorized items.
 */
export async function parseReceiptImage(
  imageBuffer: Buffer,
  mimeType: string,
  categoryList: { slug: string; name: string; parent_name: string | null }[]
): Promise<ParsedReceipt> {
  const categoryText = categoryList
    .map((c) => `${c.slug}: ${c.parent_name ? c.parent_name + " > " : ""}${c.name}`)
    .join("\n");

  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: receiptSchema }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Extract structured data from this receipt image AND categorize each item.

For each line item, identify:
- Item name, quantity (assume 1 if not specified), unit price, total price
- The best matching category_slug from the list below
- tax_category_slug if it's a business expense, or null for personal items
- confidence score (0-1) for the categorization

Also identify: merchant name, transaction date (YYYY-MM-DD), total amount, tax amount, tip amount.

Available categories:
${categoryText}

Be thorough — capture every item on the receipt.`,
          },
          {
            type: "image",
            image: imageBuffer,
            mediaType: mimeType,
          },
        ],
      },
    ],
  });

  return output!;
}
