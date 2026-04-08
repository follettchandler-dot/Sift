import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      const customerId = session.customer as string;

      if (!userId) break;

      // Get the subscription to determine tier
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const priceId = subscription.items.data[0]?.price.id;

      const tier =
        priceId === process.env.STRIPE_PRO_PRICE_ID
          ? "pro"
          : priceId === process.env.STRIPE_PLUS_PRICE_ID
          ? "plus"
          : "free";

      await supabase
        .from("users")
        .update({ subscription_tier: tier, stripe_customer_id: customerId })
        .eq("id", userId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await supabase
        .from("users")
        .update({ subscription_tier: "free" })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const priceId = subscription.items.data[0]?.price.id;

      const tier =
        priceId === process.env.STRIPE_PRO_PRICE_ID
          ? "pro"
          : priceId === process.env.STRIPE_PLUS_PRICE_ID
          ? "plus"
          : "free";

      await supabase
        .from("users")
        .update({ subscription_tier: tier })
        .eq("stripe_customer_id", customerId);

      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
