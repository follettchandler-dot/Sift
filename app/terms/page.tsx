import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of Itemized.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-stone-500 text-sm">Last updated: April 7, 2026</p>
        </div>

        <div className="space-y-10 text-stone-700 leading-relaxed">

          <section>
            <p className="text-lg text-stone-800">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of Itemized (&ldquo;the Service&rdquo;), operated by Itemized, Inc.
              By creating an account or using the Service, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              1. Account Terms
            </h2>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>You must be at least 18 years old to create an account and use Itemized.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>One account per person. You may not share your account credentials or allow others to access your account.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>You are responsible for maintaining the security of your password and account. Notify us immediately if you believe your account has been compromised.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>You must provide accurate, complete information when creating your account and keep it up to date.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              2. Acceptable Use
            </h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Use Itemized for any illegal purpose or in violation of any applicable laws.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Attempt to gain unauthorized access to any part of the Service or its related systems.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Reverse engineer, decompile, or attempt to extract the source code of the Service.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Use automated scripts or bots to scrape or interact with the Service.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Transmit malware, spam, or any content that could damage the Service or its users.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Resell or sublicense access to the Service without our written permission.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              3. Subscription and Billing
            </h2>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Itemized offers a free tier and paid subscription plans (Plus at $8/month, Pro at $15/month). Pricing is subject to change with 30 days notice.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>All billing is handled by Stripe. By subscribing, you authorize us to charge your payment method on a recurring monthly basis.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of your current billing period — you retain access until then.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>We do not provide refunds for partial months of service. If you cancel mid-cycle, your access continues through the end of that billing period.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>If a payment fails, we will attempt to notify you. Continued failed payments may result in suspension of your paid plan features.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              4. Your Content
            </h2>
            <p className="mb-4">
              You own your data. The receipts you scan, the transactions you import, and the data you upload remain yours.
            </p>
            <p className="mb-4">
              By using Itemized, you grant us a limited, non-exclusive, royalty-free license to process, store, and display
              your content solely for the purpose of providing the Service to you. We do not use your financial data to train
              AI models, sell to third parties, or for any purpose beyond operating Itemized.
            </p>
            <p>
              You are responsible for ensuring you have the rights to upload any content you submit to Itemized.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              5. Termination
            </h2>
            <p className="mb-4">
              You may terminate your account at any time by deleting it from Settings or contacting us. Upon termination,
              your data will be deleted within 30 days per our{" "}
              <Link href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</Link>.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms, with or without notice,
              at our sole discretion. In cases of clear abuse or illegal activity, we may terminate immediately without
              a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              6. Disclaimers — Not Financial Advice
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
              <p className="text-amber-900 text-sm font-medium">
                Itemized is a personal finance tracking tool, not a financial advisor, bank, or investment service.
              </p>
            </div>
            <ul className="space-y-3 pl-4">
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Nothing in Itemized constitutes financial, investment, tax, or legal advice.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>Itemized is not a bank, and we do not hold, manage, or process your money.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>AI-extracted receipt data may contain errors. Always verify against your actual receipts and statements.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600 mt-1 shrink-0">—</span>
                <span>The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              7. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, Itemized, Inc. and its officers, employees, and agents
              shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including
              loss of profits, data, or goodwill — arising from your use of or inability to use the Service.
            </p>
            <p>
              Our total liability to you for any claims arising from these Terms or your use of the Service shall not
              exceed the greater of (a) the amount you paid us in the 12 months preceding the claim or (b) $50 USD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              8. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. When we make material changes, we will notify you by email
              or in-app notification at least 14 days before the changes take effect. Continued use of the Service after
              changes take effect constitutes your acceptance of the new Terms. If you disagree with the updated Terms,
              you should stop using the Service and delete your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              9. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of the State of South Carolina, without regard to its conflict-of-law
              provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the
              state or federal courts located in South Carolina.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-stone-900 mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              10. Contact
            </h2>
            <p>
              Questions about these Terms? Email us at{" "}
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
            <Link href="/privacy" className="text-stone-400 hover:text-stone-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-stone-500 hover:text-stone-900 transition-colors font-medium">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
