import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Itemized collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-[#FAFAF7]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white font-bold text-sm">
              I
            </div>
            <span className="font-semibold text-stone-900 tracking-tight">itemized</span>
          </Link>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
            ← Back to home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="text-sm text-amber-700 font-medium tracking-wide uppercase mb-4">Legal</p>
          <h1
            className="text-5xl text-stone-900 mb-4 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-stone-500 text-sm">Last updated: April 7, 2026</p>
        </div>

        <div className="prose-stone space-y-10 text-stone-700 leading-relaxed">

          <section>
            <p className="text-lg text-stone-800">
              Itemized is built on a simple principle: your financial data belongs to you. This policy explains exactly
              what we collect, why we collect it, and how we keep it safe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              What We Collect
            </h2>
            <p className="mb-4">When you use Itemized, we collect the following categories of data:</p>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Account information:</strong> Your email address and authentication credentials when you create an account.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Receipt images:</strong> Photos you scan or import from your camera roll. These are processed by AI to extract line-item data.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Receipt and transaction data:</strong> Merchant names, itemized products, prices, dates, and spending categories derived from your receipts and linked accounts.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Gmail receipt data:</strong> If you connect Gmail, we read emails matching receipt patterns (subject lines like "Your order," "Receipt for," etc.) to extract purchase data. We do not read or store other emails.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Bank and card transaction data:</strong> If you connect a financial account via Plaid, we receive transaction records including merchant name, amount, and date. We do not receive your account numbers or login credentials — those go directly to Plaid.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Usage data:</strong> How you interact with the app (features used, session length) to help us improve the product. This is not sold or shared with advertisers.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Billing information:</strong> Managed by Stripe. We store your subscription status but never your card numbers.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Why We Collect It
            </h2>
            <p className="mb-4">
              Everything we collect has a single purpose: to give you item-level visibility into your spending. Specifically:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Receipts and transactions are processed to categorize your spending at the line-item level.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Your email is used for account authentication and transactional communications (receipts for your Itemized subscription, important product notices).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Usage data helps us understand which features are working and where we can improve.</span>
              </li>
            </ul>
            <p className="mt-4 text-stone-600">
              We do not build advertising profiles. We do not sell your data. We do not share personal data with third parties
              beyond the vendors listed below that power the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Third-Party Services
            </h2>
            <p className="mb-6">Itemized uses the following trusted third parties to deliver the service:</p>
            <div className="space-y-4">
              {[
                {
                  name: "Google (Gmail OAuth & Gemini AI)",
                  detail: "Gmail OAuth lets you connect your inbox for receipt extraction. Gemini AI processes receipt images and text to extract line items. Google's privacy policy governs their handling of data.",
                },
                {
                  name: "Plaid",
                  detail: "Plaid is the industry-standard bank connectivity layer. Your bank credentials never touch our servers — they go directly to Plaid. We receive only the transaction data you authorize.",
                },
                {
                  name: "Stripe",
                  detail: "Stripe handles all subscription billing. We store your plan status; Stripe stores your payment method.",
                },
                {
                  name: "Supabase",
                  detail: "Our database and authentication provider. Your data is stored on Supabase's infrastructure, encrypted at rest, in US-based data centers.",
                },
                {
                  name: "Vercel",
                  detail: "Our hosting and edge infrastructure provider. Vercel serves the application and processes web requests.",
                },
              ].map((vendor) => (
                <div key={vendor.name} className="bg-white border border-stone-200 rounded-xl p-5">
                  <p className="font-semibold text-stone-900 mb-1">{vendor.name}</p>
                  <p className="text-sm text-stone-600">{vendor.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Your Rights and Controls
            </h2>
            <p className="mb-4">You have full control over your data:</p>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Access:</strong> Request a copy of all data we hold on you at any time.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Delete:</strong> Delete your account and all associated data at any time from the app settings or by emailing us. Deletion is permanent and processed within 30 days.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Export:</strong> Export your receipt and transaction data in CSV format from your account settings.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">Disconnect integrations:</strong> Revoke Gmail or Plaid access at any time from Settings → Connections. Existing data is retained until you delete it.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span><strong className="text-stone-900">California (CCPA) and EU/UK (GDPR) residents</strong> have additional rights including right to know, right to opt-out, and right to non-discrimination. Contact us to exercise these rights.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active. When you delete your account, all associated
              data is permanently deleted within 30 days. Aggregate, anonymized analytics data (with no link to your identity)
              may be retained indefinitely to improve the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Security
            </h2>
            <p className="mb-4">
              We take security seriously:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>All data is encrypted in transit via HTTPS/TLS 1.3.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Data at rest is encrypted using AES-256 on Supabase's infrastructure.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Authentication uses Supabase Auth with industry-standard JWT tokens and OAuth 2.0.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>We are working toward SOC 2 Type II certification.</span>
              </li>
            </ul>
            <p className="mt-4 text-stone-600">
              No system is 100% secure. If you discover a security vulnerability, please email{" "}
              <a href="mailto:jacob.h.trask@gmail.com" className="text-amber-700 hover:underline">jacob.h.trask@gmail.com</a>{" "}
              and we will respond promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Children&apos;s Privacy
            </h2>
            <p>
              Itemized is not designed for or directed at children under 18 years of age. We do not knowingly collect
              personal information from anyone under 18. If you believe a minor has provided us personal information,
              please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top
              and, for material changes, notify you by email or in-app banner. Continued use of Itemized after changes
              take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Contact
            </h2>
            <p>
              Questions, requests, or concerns about this policy? Email us at{" "}
              <a href="mailto:jacob.h.trask@gmail.com" className="text-amber-700 hover:underline">
                jacob.h.trask@gmail.com
              </a>
              . We aim to respond within 5 business days.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} Itemized, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/privacy" className="text-stone-500 hover:text-stone-900 transition-colors font-medium">
              Privacy
            </Link>
            <Link href="/terms" className="text-stone-400 hover:text-stone-900 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
