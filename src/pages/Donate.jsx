import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BookOpen, Lock, CheckCircle, ExternalLink, Mail, Loader2, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const JUSTGIVING_URL = "https://www.justgiving.com/campaign/ringwoodcarnival";

export default function Donate() {
  const [activeTab, setActiveTab] = useState("programme");
  const [email, setEmail] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(null); // { donor_name, pdf_url }
  const [claimError, setClaimError] = useState("");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
            
            Support the Carnival
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Donate and support Carnival here!</p>
        </motion.div>

        {/* Tabs */}
        












        
      </div>

      <div className="px-6 md:px-12 py-8 pb-32 max-w-2xl mx-auto">

        {/* DONATE TAB */}
        {activeTab === "donate" &&
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
              className="w-full bg-secondary text-white font-heading font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-secondary/30">
              
                <Heart className="w-5 h-5" />
                Donate on JustGiving
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
              <h3 className="font-heading font-bold text-sm text-foreground mb-2">Where your money goes</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Road closure permits &amp; barriers</li>
                <li>• Steward equipment</li>
                <li>• Float building grants for community groups</li>
                <li>• First aid provision &amp; safety measures</li>
              </ul>
            </div>
          </motion.div>
        }

        {/* PROGRAMME TAB */}
        {activeTab === "programme" &&
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Step 1 — Donate */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">1</div>
                <h3 className="font-heading font-bold text-foreground">Donate on JustGiving</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed hidden">
                The official 2026 programme costs just <strong className="text-foreground">£0.50</strong> — donate at least this amount to Ringwood Carnival on JustGiving using the same email address you'll enter below.
              </p>
              <a
              href={JUSTGIVING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-secondary text-white font-heading font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-secondary/20">
              
                <Heart className="w-4 h-4" /> Donate on JustGiving <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Step 2 — Claim */}
            {!claimed ?
          <div className="bg-card rounded-2xl border border-border p-5 hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-sm flex-shrink-0">2</div>
                  <h3 className="font-heading font-bold text-foreground">Claim your programme</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Enter the email address you used when donating on JustGiving to verify your donation and receive the programme.</p>
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                  type="email"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value);setClaimError("");}}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                
                  </div>
                  {claimError &&
              <p className="text-destructive text-xs">{claimError}</p>
              }
                  <button
                onClick={async () => {
                  if (!email.trim()) {setClaimError("Please enter your email address.");return;}
                  setClaiming(true);
                  setClaimError("");
                  try {
                    const res = await base44.functions.invoke("claimProgramme", { email: email.trim() });
                    if (res.data?.success) {
                      setClaimed(res.data);
                    } else {
                      setClaimError(res.data?.error || "Something went wrong. Please try again.");
                    }
                  } catch {
                    setClaimError("Something went wrong. Please try again.");
                  }
                  setClaiming(false);
                }}
                disabled={claiming}
                className="w-full bg-primary text-white font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                
                    {claiming ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : "Verify & Get Programme"}
                  </button>
                </div>
              </div> : (

          /* Success state */
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-green-800 dark:text-green-300 text-lg mb-1">
                  Thank you!
                </h3>
                <p className="text-green-700 dark:text-green-400 text-sm mb-5">
                  Your programme is ready to download below.
                </p>
                <a
              href={claimed.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white font-heading font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
              
                  <Download className="w-4 h-4" /> Download Programme PDF
                </a>
                <button
              onClick={() => {setClaimed(null);setEmail("");setClaimError("");}}
              className="mt-4 block w-full text-center text-sm text-green-700 dark:text-green-400 underline underline-offset-2">
              
                  Wrong email? Try again
                </button>
              </div>)
          }
          </motion.div>
        }
      </div>
    </div>);

}