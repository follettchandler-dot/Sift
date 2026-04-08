import { Mail, ShoppingCart, Building2, Apple, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CONNECTIONS = [
  {
    icon: Mail,
    name: "Gmail",
    description: "Automatically import receipts from your Gmail inbox.",
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    icon: Mail,
    name: "Outlook",
    description: "Pull receipts from your Microsoft Outlook or Hotmail account.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: ShoppingCart,
    name: "Amazon",
    description: "Sync your Amazon order history and itemize every purchase.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: ShoppingCart,
    name: "Walmart+",
    description: "Import Walmart+ receipts and break down your grocery spending.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Building2,
    name: "Bank Account",
    description: "Connect via Plaid to match transactions with your receipts automatically.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Apple,
    name: "Apple Wallet",
    description: "Import Apple Pay and Apple Card transactions directly.",
    color: "text-zinc-300",
    bg: "bg-zinc-500/10",
  },
  {
    icon: CreditCard,
    name: "Credit Card",
    description: "Connect any major credit card to automatically track spending.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
]

export default function ConnectPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect Accounts</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Link your accounts to automatically import receipts and transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONNECTIONS.map((conn) => (
          <Card key={conn.name}>
            <CardHeader className="flex-row items-center gap-3 pb-2">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${conn.bg}`}>
                <conn.icon className={`size-5 ${conn.color}`} />
              </div>
              <div>
                <CardTitle className="text-sm">{conn.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>{conn.description}</CardDescription>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming soon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
