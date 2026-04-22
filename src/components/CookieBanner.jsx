import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-[60] max-w-md mx-auto bg-card border border-border rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-foreground text-sm mb-1">This app uses cookies</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              We use essential cookies to keep you signed in to the staff area and to remember your preferences. These are required for the app to work properly.
            </p>
            <button
              onClick={handleAccept}
              className="mt-3 bg-primary text-white font-heading font-bold text-xs px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}