"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, ShoppingCart, Building2, Apple, CreditCard, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { usePlaidLink } from "react-plaid-link";

interface ConnectedAccount {
  id: string;
  provider: string;
  metadata: { last_synced_at?: string } | null;
}

interface PlaidItemStatus {
  id: string;
  institution_name: string | null;
  last_synced_at: string | null;
  account_count: number;
}

function PlaidLinkButton({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [fetchingToken, setFetchingToken] = useState(false);

  const fetchLinkToken = useCallback(async () => {
    setFetchingToken(true);
    try {
      const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
      if (!res.ok) throw new Error("Failed to get link token");
      const data = await res.json();
      setLinkToken(data.link_token);
    } catch {
      toast.error("Failed to initialize bank connection. Please try again.");
    } finally {
      setFetchingToken(false);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess: async (public_token) => {
      try {
        const res = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Exchange failed");
        toast.success(
          `Connected ${data.institution_name ?? "bank"} — ${data.account_count} account${data.account_count !== 1 ? "s" : ""} linked.`
        );
        onSuccess();
      } catch {
        toast.error("Failed to link bank account. Please try again.");
      }
    },
    onExit: () => {
      setLinkToken(null);
    },
  });

  // Auto-open once we have a token
  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open]);

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={fetchLinkToken}
      disabled={fetchingToken}
    >
      {fetchingToken ? (
        <>
          <Loader2 className="mr-2 size-3 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Bank"
      )}
    </Button>
  );
}

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const [gmailAccount, setGmailAccount] = useState<ConnectedAccount | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [plaidItems, setPlaidItems] = useState<PlaidItemStatus[]>([]);
  const [loadingPlaid, setLoadingPlaid] = useState(true);
  const [syncingPlaid, setSyncingPlaid] = useState(false);

  // Show toast for OAuth redirects
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    if (success === "gmail") {
      toast.success("Gmail connected! You can now sync your receipts.");
    } else if (error === "gmail_denied") {
      toast.error("Gmail authorization was denied.");
    } else if (error === "gmail_token" || error === "gmail_db") {
      toast.error("Something went wrong connecting Gmail. Please try again.");
    }
  }, [searchParams]);

  // Fetch connected account status
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/connect/status");
        if (res.ok) {
          const data = await res.json();
          setGmailAccount(data.gmail ?? null);
        }
      } catch {
        // Non-fatal
      } finally {
        setLoadingStatus(false);
      }
    }
    fetchStatus();
  }, []);

  const fetchPlaidStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/plaid/status");
      if (res.ok) {
        const data = await res.json();
        setPlaidItems(data.items ?? []);
      }
    } catch {
      // Non-fatal
    } finally {
      setLoadingPlaid(false);
    }
  }, []);

  useEffect(() => {
    fetchPlaidStatus();
  }, [fetchPlaidStatus]);

  async function handlePlaidSyncNow() {
    setSyncingPlaid(true);
    try {
      const res = await fetch("/api/plaid/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sync failed");
      } else {
        const { added, modified, removed } = data;
        const total = added + modified + removed;
        if (total === 0) {
          toast.success("Already up to date — no new transactions.");
        } else {
          toast.success(
            `Synced: ${added} new, ${modified} updated, ${removed} removed.`
          );
        }
        await fetchPlaidStatus();
      }
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncingPlaid(false);
    }
  }

  async function handleSyncNow() {
    setSyncing(true);
    try {
      const res = await fetch("/api/receipts/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sync failed");
      } else {
        const { created, skipped } = data;
        if (created === 0) {
          toast.success("Already up to date — no new receipts found.");
        } else {
          toast.success(`Synced ${created} new receipt${created !== 1 ? "s" : ""}!`);
        }
        // Refresh status to update last_synced_at
        const statusRes = await fetch("/api/connect/status");
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setGmailAccount(statusData.gmail ?? null);
        }
        void skipped;
      }
    } catch {
      toast.error("Sync failed. Please try again.");
    } finally {
      setSyncing(false);
    }
  }

  const gmailConnected = !loadingStatus && !!gmailAccount;
  const lastSynced = gmailAccount?.metadata?.last_synced_at
    ? new Date(gmailAccount.metadata.last_synced_at).toLocaleString()
    : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connect Accounts</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Link your accounts to automatically import receipts and transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Gmail — functional */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <Mail className="size-5 text-red-400" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Gmail</CardTitle>
              {gmailConnected && (
                <CheckCircle2 className="size-4 text-emerald-400" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Automatically import receipts from your Gmail inbox.
            </CardDescription>
            {lastSynced && (
              <p className="text-xs text-zinc-500">Last synced: {lastSynced}</p>
            )}
            {loadingStatus ? (
              <Button variant="outline" size="sm" disabled className="w-full">
                <Loader2 className="mr-2 size-3 animate-spin" />
                Loading...
              </Button>
            ) : gmailConnected ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleSyncNow}
                disabled={syncing}
              >
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 size-3 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 size-3" />
                    Sync Now
                  </>
                )}
              </Button>
            ) : (
              <a
                href="/api/connect/gmail"
                className="inline-flex h-7 w-full items-center justify-center rounded-[min(var(--radius-md),12px)] border border-border bg-background px-2.5 text-[0.8rem] font-medium transition-all hover:bg-muted hover:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
              >
                Connect Gmail
              </a>
            )}
          </CardContent>
        </Card>

        {/* Outlook */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Mail className="size-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-sm">Outlook</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Pull receipts from your Microsoft Outlook or Hotmail account.
            </CardDescription>
            <Button variant="outline" size="sm" disabled className="w-full">
              Coming soon
            </Button>
          </CardContent>
        </Card>

        {/* Amazon */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
              <ShoppingCart className="size-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-sm">Amazon</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Sync your Amazon order history and itemize every purchase.
            </CardDescription>
            <Button variant="outline" size="sm" disabled className="w-full">
              Coming soon
            </Button>
          </CardContent>
        </Card>

        {/* Walmart+ */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <ShoppingCart className="size-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-sm">Walmart+</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Import Walmart+ receipts and break down your grocery spending.
            </CardDescription>
            <Button variant="outline" size="sm" disabled className="w-full">
              Coming soon
            </Button>
          </CardContent>
        </Card>

        {/* Bank Account — Plaid */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
              <Building2 className="size-5 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm">Bank Account</CardTitle>
              {!loadingPlaid && plaidItems.length > 0 && (
                <CheckCircle2 className="size-4 text-emerald-400" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Connect via Plaid to automatically track bank and credit card transactions.
            </CardDescription>
            {!loadingPlaid && plaidItems.length > 0 && (
              <div className="space-y-1">
                {plaidItems.map((item) => (
                  <div key={item.id} className="text-xs text-zinc-400">
                    <span className="font-medium text-zinc-300">
                      {item.institution_name ?? "Bank"}
                    </span>
                    {" · "}
                    {item.account_count} account{item.account_count !== 1 ? "s" : ""}
                    {item.last_synced_at && (
                      <span className="text-zinc-500">
                        {" · "}Last synced:{" "}
                        {new Date(item.last_synced_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {loadingPlaid ? (
              <Button variant="outline" size="sm" disabled className="w-full">
                <Loader2 className="mr-2 size-3 animate-spin" />
                Loading...
              </Button>
            ) : plaidItems.length > 0 ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handlePlaidSyncNow}
                  disabled={syncingPlaid}
                >
                  {syncingPlaid ? (
                    <>
                      <Loader2 className="mr-2 size-3 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 size-3" />
                      Sync Now
                    </>
                  )}
                </Button>
                <PlaidLinkButton onSuccess={fetchPlaidStatus} />
              </div>
            ) : (
              <PlaidLinkButton onSuccess={fetchPlaidStatus} />
            )}
          </CardContent>
        </Card>

        {/* Apple Wallet */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-500/10">
              <Apple className="size-5 text-zinc-300" />
            </div>
            <div>
              <CardTitle className="text-sm">Apple Wallet</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Import Apple Pay and Apple Card transactions directly.
            </CardDescription>
            <Button variant="outline" size="sm" disabled className="w-full">
              Coming soon
            </Button>
          </CardContent>
        </Card>

        {/* Credit Card */}
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
              <CreditCard className="size-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-sm">Credit Card</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Connect any major credit card to automatically track spending.
            </CardDescription>
            <Button variant="outline" size="sm" disabled className="w-full">
              Coming soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
