import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Lazy singleton — only instantiated at runtime, not at module load
let _stripe: Stripe | null = null;
export function getStripeClient(): Stripe {
  if (!_stripe) _stripe = getStripe();
  return _stripe;
}

// Keep named export for convenience in server actions / route handlers
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripeClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PRICE_IDS = {
  plus_monthly: process.env.STRIPE_PLUS_PRICE_ID ?? "",
  pro_monthly: process.env.STRIPE_PRO_PRICE_ID ?? "",
};

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  return getStripeClient().checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    metadata: { user_id: userId },
  });
}

export async function createPortalSession(customerId: string) {
  return getStripeClient().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });
}
