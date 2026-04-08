import { redirect } from "next/navigation"
import { Check } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { stripe, PRICE_IDS, createCheckoutSession, createPortalSession } from "@/lib/stripe"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "",
    features: [
      "Up to 10 receipts/month",
      "Basic categorization",
      "30-day history",
    ],
  },
  {
    key: "plus",
    name: "Plus",
    price: "$8",
    period: "/mo",
    priceId: "plus_monthly" as const,
    features: [
      "Unlimited receipts",
      "AI categorization",
      "Full history",
      "Spending dashboard",
      "Budget alerts",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$15",
    period: "/mo",
    priceId: "pro_monthly" as const,
    features: [
      "Everything in Plus",
      "AI chat assistant",
      "Email receipt sync",
      "Export to CSV",
      "Priority support",
    ],
  },
]

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, email, subscription_tier, stripe_customer_id")
    .eq("id", user.id)
    .single()

  const currentTier = profile?.subscription_tier ?? "free"
  const params = await searchParams
  const justUpgraded = params.upgraded === "true"

  async function upgradeAction(priceKey: "plus_monthly" | "pro_monthly") {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id, email, full_name")
      .eq("id", user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email ?? "",
        name: profile?.full_name ?? undefined,
        metadata: { user_id: user.id },
      })
      customerId = customer.id
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const session = await createCheckoutSession(
      customerId,
      PRICE_IDS[priceKey],
      user.id
    )

    redirect(session.url!)
  }

  async function manageAction() {
    "use server"
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (!profile?.stripe_customer_id) redirect("/settings")

    const portalSession = await createPortalSession(profile.stripe_customer_id)
    redirect(portalSession.url)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Manage your account and billing</p>
      </div>

      {justUpgraded && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
          <Check className="size-4 shrink-0" />
          You&apos;re all set! Your plan has been upgraded.
        </div>
      )}

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Email</span>
            <span>{profile?.email ?? user.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Name</span>
            <span>{profile?.full_name ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Current plan</span>
            <span className="capitalize font-medium text-emerald-400">{currentTier}</span>
          </div>
        </CardContent>
      </Card>

      {/* Plan Cards */}
      <div>
        <h2 className="mb-4 font-semibold">Plans</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.key === currentTier
            const isDowngrade =
              (plan.key === "free" && currentTier !== "free") ||
              (plan.key === "plus" && currentTier === "pro")

            return (
              <Card
                key={plan.key}
                className={isCurrent ? "ring-2 ring-emerald-500" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    {isCurrent && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-sm text-zinc-400">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="size-3.5 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrent && plan.key !== "free" && (
                    <form action={manageAction}>
                      <Button variant="outline" size="sm" className="w-full" type="submit">
                        Manage billing
                      </Button>
                    </form>
                  )}

                  {!isCurrent && !isDowngrade && plan.key !== "free" && (
                    <form
                      action={upgradeAction.bind(
                        null,
                        plan.priceId as "plus_monthly" | "pro_monthly"
                      )}
                    >
                      <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white" type="submit">
                        Upgrade to {plan.name}
                      </Button>
                    </form>
                  )}

                  {isDowngrade && (
                    <form action={manageAction}>
                      <Button variant="outline" size="sm" className="w-full" type="submit">
                        Downgrade
                      </Button>
                    </form>
                  )}

                  {isCurrent && plan.key === "free" && (
                    <Button variant="ghost" size="sm" className="w-full" disabled>
                      Current plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
