export type SubscriptionTier = "free" | "plus" | "pro";

export type ReceiptSource = "email" | "scan" | "loyalty_sync" | "wallet" | "manual";
export type ProcessingStatus = "pending" | "processed" | "failed";

export interface Receipt {
  id: string;
  user_id: string;
  org_id: string | null;
  merchant_name: string;
  merchant_category: string | null;
  total_amount: number;
  currency: string;
  tax_amount: number | null;
  tip_amount: number | null;
  transaction_date: string;
  source: ReceiptSource;
  source_ref: string | null;
  plaid_transaction_id: string | null;
  raw_data_json: Record<string, unknown> | null;
  processing_status: ProcessingStatus;
  created_at: string;
  receipt_items?: ReceiptItem[];
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  category_id: string | null;
  tax_category_id: string | null;
  confidence_score: number;
  is_user_corrected: boolean;
  original_category_id: string | null;
  created_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  icon: string | null;
  type: "consumer" | "tax" | "enterprise";
  level: number;
  description: string | null;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount_limit: number;
  period: "weekly" | "monthly";
  alert_threshold_pct: number;
  is_active: boolean;
  created_at: string;
  category?: Category;
  spent?: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  created_at: string;
}
