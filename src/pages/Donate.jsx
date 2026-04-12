import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BookOpen, Lock, Mail, CheckCircle, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

// Replace with your actual JustGiving campaign URL
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
  const [unlocked, setUnlocked] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email."); return; }
    setLoading(true);
    try {
      await base44.functions.invoke("sendProgrammeEmail", { email, name });
      setUnlocked(true);
      setDone(true);
      setShowPaywall(false);
      toast.success("Programme unlocked! A copy has been emailed to you.");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary px-6 md:px-12 pt-12 pb-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary" />
          <div className="absolute bottom-4 right-8 w-24 h-24 rounded-full bg-white" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-2">
            Support the Carnival
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto">
            Donate or grab your official programme
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="relative z-10 flex gap-2 mt-6 bg-white/10 rounded-xl p-1 max-w-xs mx-auto">
          <button
            onClick={() => setActiveTab("donate")}
            className={`flex-1 py-2 rounded-lg font-heading font-bold text-sm transition-all ${activeTab === "donate" ? "bg-white text-primary" : "text-white/80"}`}
          >
            <Heart className="w-4 h-4 inline mr-1" />Donate
          </button>
          <button
            onClick={() => setActiveTab("programme")}
            className={`flex-1 py-2 rounded-lg font-heading font-bold text-sm transition-all ${activeTab === "programme" ? "bg-white text-primary" : "text-white/80"}`}
          >
            <BookOpen className="w-4 h-4 inline mr-1" />Programme
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
            {unlocked ? (
              <div>
                {done && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-heading font-semibold text-green-800 text-sm">Programme unlocked!</p>
                      <p className="text-green-700 text-xs">A copy has also been emailed to {email}</p>
                    </div>
                  </div>
                )}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {PROGRAMME_CONTENT.trim().split('\n').map((line, i) => {
                      if (line.startsWith('## ')) return <h2 key={i} className="font-heading font-bold text-lg mt-6 mb-2 text-foreground">{line.replace('## ', '')}</h2>;
                      if (line.startsWith('# ')) return <h1 key={i} className="font-heading font-bold text-2xl mb-4 text-foreground">{line.replace('# ', '')}</h1>;
                      if (line.startsWith('- **')) {
                        const [time, ...rest] = line.replace('- **', '').split('**');
                        return <p key={i} className="text-sm text-muted-foreground my-1"><strong className="text-foreground">{time}</strong>{rest.join('')}</p>;
                      }
                      if (/^\d+\./.test(line)) return <p key={i} className="text-sm text-muted-foreground my-0.5 ml-2">{line}</p>;
                      if (line.startsWith('- ')) return <p key={i} className="text-sm text-muted-foreground my-0.5 ml-2">• {line.slice(2)}</p>;
                      if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="text-sm italic text-muted-foreground mt-4">{line.slice(1, -1)}</p>;
                      if (line === '') return <div key={i} className="h-2" />;
                      return <p key={i} className="text-sm text-muted-foreground">{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Preview (blurred) */}
                <div className="relative bg-card rounded-2xl border border-border p-6 mb-4 overflow-hidden">
                  <div className="blur-sm select-none pointer-events-none">
                    <h1 className="font-heading font-bold text-2xl mb-2">Ringwood Carnival 2024</h1>
                    <h2 className="font-heading font-bold text-lg mb-3">Official Programme</h2>
                    <p className="text-sm text-muted-foreground mb-2">Welcome from the Chair...</p>
                    <p className="text-sm text-muted-foreground mb-2">Procession order, full events schedule, sponsor listings and much more inside...</p>
                    <div className="space-y-1">
                      {[1,2,3,4,5].map(i => <div key={i} className="h-3 bg-muted rounded w-full" />)}
                    </div>
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                      <Lock className="w-7 h-7 text-primary" />
                    </div>
                    <p className="font-heading font-bold text-foreground text-lg mb-1">Official Programme</p>
                    <p className="text-muted-foreground text-sm mb-4 text-center px-6">
                      Unlock the 2024 programme for just {PROGRAMME_PRICE}
                    </p>
                    <button
                      onClick={() => setShowPaywall(true)}
                      className="bg-secondary text-white font-heading font-bold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Unlock for {PROGRAMME_PRICE}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Paywall modal */}
            {showPaywall && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setShowPaywall(false)}>
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">Unlock Programme</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Pay {PROGRAMME_PRICE} via JustGiving, then enter your email to receive your programme copy.
                  </p>

                  <button
                    onClick={() => window.open(JUSTGIVING_URL, "_blank")}
                    className="w-full bg-secondary text-white font-heading font-bold py-3 rounded-xl mb-4 flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all"
                  >
                    <Heart className="w-4 h-4" /> Pay {PROGRAMME_PRICE} on JustGiving <ExternalLink className="w-3 h-3" />
                  </button>

                  <p className="text-xs text-muted-foreground mb-3 text-center">After donating, enter your email to unlock:</p>

                  <form onSubmit={handlePurchase} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground font-heading font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                      <Mail className="w-4 h-4" />
                      {loading ? "Sending..." : "Unlock & Email Me"}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}