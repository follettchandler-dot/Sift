import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const categorizationSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      category_slug: z
        .string()
        .describe("The slug of the most specific matching category"),
      tax_category_slug: z
        .string()
        .nullable()
        .describe(
          "IRS Schedule C tax category slug if applicable, null for personal items"
        ),
      confidence: z
        .number()
        .min(0)
        .max(1)
        .describe("Confidence score for this categorization"),
    })
  ),
});

export async function categorizeItems(
  items: { name: string; merchant_name: string }[],
  categoryList: { slug: string; name: string; parent_name: string | null }[]
): Promise<
  {
    name: string;
    category_slug: string;
    tax_category_slug: string | null;
    confidence: number;
  }[]
> {
  const categoryText = categoryList
    .map(
      (c) =>
        `${c.slug}: ${c.parent_name ? c.parent_name + " > " : ""}${c.name}`
    )
    .join("\n");

  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({ schema: categorizationSchema }),
    prompt: `Categorize each receipt item into the most specific matching category. Also assign an IRS Schedule C tax category if the item could be a business expense (null if clearly personal).\n\nAvailable categories:\n${categoryText}\n\nItems to categorize (from ${items[0]?.merchant_name || "unknown merchant"}):\n${items.map((i) => `- ${i.name}`).join("\n")}`,
  });

  return output!.items;
}
