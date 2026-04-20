import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-primary flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <img
              src="https://ss.charleymurphy.xyz/RWC%20Logo.jpg"
              alt="Ringwood Carnival"
              className="w-48 h-48 rounded-3xl object-cover shadow-2xl"
            />
            <div className="text-center">
              <h1 className="font-heading text-4xl font-bold text-white">Ringwood</h1>
              <h1 className="font-heading text-4xl font-bold text-secondary">Carnival</h1>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}