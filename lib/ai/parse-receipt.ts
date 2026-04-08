import { generateText, Output } from "ai";
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
    })
  ),
});

export type ParsedReceipt = z.infer<typeof receiptSchema>;

export async function parseReceiptText(ocrText: string): Promise<ParsedReceipt> {
  const { output } = await generateText({
    model: "anthropic/claude-sonnet-4.5",
    output: Output.object({ schema: receiptSchema }),
    prompt: `Extract structured data from this receipt text. Parse every line item with its name, quantity, and price. If quantity is not specified, assume 1. Ensure total_amount matches the receipt total.\n\nReceipt text:\n${ocrText}`,
  });
  return output!;
}
