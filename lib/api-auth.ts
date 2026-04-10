import { createServiceClient } from "@/lib/supabase/service";

// ─── Key generation ──────────────────────────────────────────────────────────

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateApiKey(environment: "test" | "live"): {
  plainKey: string;
  prefix: string;
  hash: Promise<string>;
} {
  const random = randomHex(16); // 32 hex chars
  const prefix = `sk_${environment}_`;
  const plainKey = `${prefix}${random}`;
  return {
    plainKey,
    prefix,
    hash: hashApiKey(plainKey),
  };
}

// ─── Auth types ───────────────────────────────────────────────────────────────

export interface ApiConsumer {
  id: string;
  user_id: string | null;
  name: string;
  company_name: string | null;
  email: string;
  status: string;
  plan: string;
}

export interface ApiKeyRecord {
  id: string;
  consumer_id: string;
  name: string;
  key_prefix: string;
  environment: string;
  last_used_at: string | null;
}

export interface AuthenticatedRequest {
  consumer: ApiConsumer;
  apiKey: ApiKeyRecord;
}

// ─── Request authentication ──────────────────────────────────────────────────

export async function authenticateRequest(
  request: Request
): Promise<AuthenticatedRequest | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const plainKey = authHeader.slice(7).trim();
  if (!plainKey.startsWith("sk_test_") && !plainKey.startsWith("sk_live_")) {
    return null;
  }

  const keyHash = await hashApiKey(plainKey);
  const supabase = createServiceClient();

  const { data: keyRow, error } = await supabase
    .from("api_keys")
    .select(
      `
      id,
      consumer_id,
      name,
      key_prefix,
      environment,
      last_used_at,
      consumer:api_consumers(
        id,
        user_id,
        name,
        company_name,
        email,
        status,
        plan
      )
    `
    )
    .eq("key_hash", keyHash)
    .single();

  if (error || !keyRow) return null;

  const consumer = Array.isArray(keyRow.consumer)
    ? keyRow.consumer[0]
    : keyRow.consumer;

  if (!consumer || consumer.status !== "active") return null;

  // Update last_used_at async (don't await to keep latency low)
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyRow.id)
    .then(() => {});

  return {
    consumer: consumer as ApiConsumer,
    apiKey: {
      id: keyRow.id,
      consumer_id: keyRow.consumer_id,
      name: keyRow.name,
      key_prefix: keyRow.key_prefix,
      environment: keyRow.environment,
      last_used_at: keyRow.last_used_at,
    },
  };
}

// ─── Usage tracking ──────────────────────────────────────────────────────────

export async function trackUsage({
  apiKeyId,
  consumerId,
  endpoint,
  statusCode,
  receiptsProcessed = 0,
  itemsProcessed = 0,
  aiTokensUsed = 0,
}: {
  apiKeyId: string;
  consumerId: string;
  endpoint: string;
  statusCode: number;
  receiptsProcessed?: number;
  itemsProcessed?: number;
  aiTokensUsed?: number;
}) {
  const supabase = createServiceClient();
  await supabase.from("api_usage").insert({
    api_key_id: apiKeyId,
    consumer_id: consumerId,
    endpoint,
    status_code: statusCode,
    receipts_processed: receiptsProcessed,
    items_processed: itemsProcessed,
    ai_tokens_used: aiTokensUsed,
  });
}
