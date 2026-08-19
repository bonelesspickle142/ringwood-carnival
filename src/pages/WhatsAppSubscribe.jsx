import { motion } from "framer-motion";
import { MessageCircle, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function WhatsAppSubscribe() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-[#25D366]/15 flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-10 h-10 text-[#25D366]" />
        </div>

        <h1
          className="text-2xl font-bold text-foreground mb-2"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          Ringwood Carnival Updates
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Get push notifications for procession times, schedule changes, and results — straight to WhatsApp.
        </p>

        <a
          href={base44.agents.getWhatsAppConnectURL("carnival_assistant")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-heading font-bold py-3.5 rounded-xl text-base hover:bg-[#1da851] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Subscribe on WhatsApp
        </a>

        <div className="mt-5 flex items-start gap-2 text-xs text-muted-foreground text-left">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
          <p>Tap the button, then send any message to our carnival number. You'll start receiving updates — no account needed.</p>
        </div>
      </motion.div>
    </div>
  );
}