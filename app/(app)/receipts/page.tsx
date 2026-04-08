import Link from "next/link"
import { Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ReceiptCard } from "@/components/receipt-card"

export default async function ReceiptsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: receipts } = await supabase
    .from("receipts")
    .select(
      `
      *,
      receipt_items(
        *,
        category:categories(id, name, slug, parent_id)
      )
    `
    )
    .eq("user_id", user!.id)
    .order("transaction_date", { ascending: false })
    .limit(50)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Receipts</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {receipts?.length ?? 0} receipt{receipts?.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button render={<Link href="/scan" />} className="gap-2">
          <Camera className="size-4" />
          Scan Receipt
        </Button>
      </div>

      {receipts && receipts.length > 0 ? (
        <div className="flex flex-col gap-3">
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt.id} receipt={receipt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-zinc-900 text-zinc-600">
            <Camera className="size-8" />
          </div>
          <div>
            <p className="font-medium text-zinc-300">No receipts yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Scan your first receipt to get started
            </p>
          </div>
          <Button variant="outline" render={<Link href="/scan" />}>
            Scan a Receipt
          </Button>
        </div>
      )}
    </div>
  )
}
