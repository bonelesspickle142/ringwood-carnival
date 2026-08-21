import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Check } from "lucide-react";

const STORAGE_KEY = "whatsapp_prompt_response";
const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbDW0xL5vKAI32jD6810";

export default function WhatsAppPrompt() {
  const [response, setResponse] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [showThanks, setShowThanks] = useState(false);

  const handleYes = () => {
    localStorage.setItem(STORAGE_KEY, "yes");
    setResponse("yes");
    window.open(WHATSAPP_CHANNEL_URL, "_blank", "noopener,noreferrer");
  };

  const handleNo = () => {
    localStorage.setItem(STORAGE_KEY, "no");
    setResponse("no");
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 2500);
  };

  if (response) return null;

  return (
    <AnimatePresence>
      {!showThanks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-card rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div className="bg-[#25D366] p-6 flex flex-col items-center text-white relative">
              <button
                onClick={handleNo}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h2 className="font-heading font-bold text-xl text-center">Stay in the Loop!</h2>
            </div>
            <div className="p-6">
              <p className="text-foreground text-sm leading-relaxed text-center mb-5">
                Join our WhatsApp channel to get live updates, procession times, and important announcements during the carnival. NOTE: We will NOT use your phone number (if displayed) for anything other than for notifications on carnival day. 
              </p>
              <div className="space-y-2.5">
                <button
                  onClick={handleYes}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-heading font-bold py-3 rounded-xl text-sm hover:bg-[#1da851] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Yes, subscribe me!
                </button>
                <button
                  onClick={handleNo}
                  className="w-full bg-muted text-muted-foreground font-heading font-semibold py-3 rounded-xl text-sm hover:bg-muted/80 transition-colors"
                >
                  No thanks
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {showThanks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-card rounded-3xl shadow-2xl max-w-sm w-full p-6 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-foreground text-sm leading-relaxed">
              No problem! If you change your mind, head to the <span className="font-semibold">More</span> tab to join the channel anytime.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}