import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BookOpen, Lock, CheckCircle, ExternalLink, CreditCard } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
const isInIframe = window.self !== window.top;

const JUSTGIVING_URL = "https://www.justgiving.com/campaign/ringwoodcarnival";
const PROGRAMME_PRICE = "£2.50";

const PROGRAMME_CONTENT = `
# Ringwood Carnival 2024 — Official Programme

## Welcome from the Chair
Welcome to the Ringwood Carnival 2024! We are delighted to welcome you to what promises to be our biggest and best carnival yet...

## Procession Order
1. Ringwood Town Band
2. Ringwood School Float
3. Ringwood Lions Club
4. New Forest Dance Academy
5. Ringwood Rotary Club
6. St John Ambulance
7. Ringwood Scout Group
8. Community Champions Float
9. Carnival Queen Float
10. Ringwood Carnival Committee

## Events Schedule
- **10:00** — Craft & Artisan Market opens (Market Place)
- **11:00** — Live music begins (Main Stage)
- **12:00** — Food stalls open
- **14:00** — Afternoon Procession departs
- **16:30** — Best Float judging & awards
- **18:00** — Evening entertainment begins
- **19:15** — Evening Procession departs
- **21:30** — Fireworks finale

## Sponsors & Supporters
A huge thank you to all our sponsors and supporters who make this event possible.

*Thank you for being part of the Ringwood Carnival family!*
`;

export default function Donate() {
  const [activeTab, setActiveTab] = useState("donate");
  const [loading, setLoading] = useState(false);

  const handleBuyProgramme = async () => {
    if (isInIframe) {
      alert("Checkout is only available from the published app, not the preview.");
      return;
    }
    setLoading(true);
    try {
      const res = await base44.functions.invoke("createProgrammeCheckout", {
        success_url: window.location.origin + "/donate?purchased=1",
        cancel_url: window.location.href,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const purchased = new URLSearchParams(window.location.search).get("purchased") === "1";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            Support the Carnival
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Donate or grab your official programme</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 bg-muted rounded-xl p-1 mt-5 max-w-xs">
          <button
            onClick={() => setActiveTab("donate")}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${activeTab === "donate" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <Heart className="w-4 h-4" />Donate
          </button>
          <button
            onClick={() => setActiveTab("programme")}
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${activeTab === "programme" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <BookOpen className="w-4 h-4" />Programme
          </button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 pb-32 max-w-2xl mx-auto">

        {/* DONATE TAB */}
        {activeTab === "donate" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">Donate via JustGiving</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Ringwood Carnival is entirely volunteer-run. Your donation helps keep this beloved community
                event alive. All donations are processed securely via JustGiving.
              </p>
              <button
                onClick={() => window.open(JUSTGIVING_URL, "_blank")}
                className="w-full bg-secondary text-white font-heading font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-secondary/30"
              >
                <Heart className="w-5 h-5" />
                Donate on JustGiving
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <h3 className="font-heading font-bold text-sm text-foreground mb-2">Where your money goes</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Road closure permits &amp; council fees</li>
                <li>• Steward training &amp; equipment</li>
                <li>• Stage &amp; sound system hire</li>
                <li>• Float building grants for community groups</li>
                <li>• First aid provision &amp; safety measures</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* PROGRAMME TAB */}
        {activeTab === "programme" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {purchased ? (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-heading font-semibold text-green-800 text-sm">Purchase complete!</p>
                  <p className="text-green-700 text-xs">Your programme has been emailed to you. Check your inbox.</p>
                </div>
              </div>
            ) : (
              <div className="relative bg-card rounded-2xl border border-border p-6 overflow-hidden">
                <div className="blur-sm select-none pointer-events-none">
                  <h1 className="font-heading font-bold text-2xl mb-2">Ringwood Carnival 2024</h1>
                  <h2 className="font-heading font-bold text-lg mb-3">Official Programme</h2>
                  <p className="text-sm text-muted-foreground mb-2">Welcome from the Chair...</p>
                  <p className="text-sm text-muted-foreground mb-2">Procession order, full events schedule, sponsor listings and much more inside...</p>
                  <div className="space-y-1">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-3 bg-muted rounded w-full" />)}
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                    <Lock className="w-7 h-7 text-primary" />
                  </div>
                  <p className="font-heading font-bold text-foreground text-lg mb-1">Official Programme</p>
                  <p className="text-muted-foreground text-sm mb-5 text-center px-6">
                    Get the full 2024 programme for just {PROGRAMME_PRICE} — delivered straight to your inbox.
                  </p>
                  <button
                    onClick={handleBuyProgramme}
                    disabled={loading}
                    className="bg-secondary text-white font-heading font-bold px-7 py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    {loading ? "Loading..." : `Buy for ${PROGRAMME_PRICE}`}
                  </button>
                  <p className="text-xs text-muted-foreground mt-3">Secure payment via Stripe · Email delivery</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}