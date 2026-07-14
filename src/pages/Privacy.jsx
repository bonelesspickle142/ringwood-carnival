import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen pb-32">
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          <Shield className="w-7 h-7 text-primary" /> Privacy Policy
        </motion.h1>
      </div>

      <div className="px-6 md:px-12 max-w-xl space-y-6 text-muted-foreground text-sm leading-relaxed">
        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">Overview</h2>
          <p>
            Ringwood Carnival is provided free of charge and is intended for use as is. This policy outlines what data we collect and how we use it.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">Data We Collect</h2>
          <p className="mb-2">When you create an account, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your email address — used to identify your account.</li>
            <li>Your name (if provided) — used to personalise your experience.</li>
          </ul>
          <p className="mt-2">If you make a donation or purchase a programme, your email is used to deliver your digital programme link.</p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide access to features such as voting and programme claims.</li>
            <li>To send push notifications about procession times and event updates (only if you opt in).</li>
            <li>To prevent duplicate votes and abuse of free features.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">Data Sharing</h2>
          <p>
            We do not sell or share your personal data with third parties for marketing purposes. Donation payments are processed securely by our payment provider (Stripe), and we only receive confirmation of the transaction — not your card details.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">Data Retention</h2>
          <p>
            Your account data is retained until you choose to delete your account, which you can do at any time from the Settings page. This action is permanent and cannot be undone.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">Cookies</h2>
          <p>
            This app uses essential cookies and local storage to function correctly (e.g. keeping you logged in). Analytics cookies are only used if you accept them via the cookie banner.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-bold text-foreground text-base mb-2">Contact</h2>
          <p>
            If you have any questions about this privacy policy or your data, please contact the Ringwood Carnival committee via the website at{" "}
            <a href="https://ringwoodcarnival.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
              ringwoodcarnival.org
            </a>.
          </p>
        </section>

        <p className="text-xs text-muted-foreground pt-4">Last updated: July 2026</p>
      </div>
    </div>
  );
}