import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Set your carnival date here
const CARNIVAL_DATE = new Date("2026-09-20T14:00:00");

function getTimeLeft() {
  const now = new Date();
  const diff = CARNIVAL_DATE - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad(n) {
  return String(n).padStart(2, "0");
}

export default function CarnivalCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: Pad(timeLeft.hours) },
    { label: "Mins", value: Pad(timeLeft.minutes) },
    { label: "Secs", value: Pad(timeLeft.seconds) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-6"
    >
      <p className="text-white/60 text-xs font-heading uppercase tracking-widest mb-2">
        Countdown to Carnival
      </p>
      <div className="flex gap-2">
        {units.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 min-w-[56px] shadow-lg"
            style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)" }}
          >
            <span className="font-heading font-bold text-2xl md:text-3xl text-white leading-none tabular-nums">
              {value}
            </span>
            <span className="text-[10px] text-white/50 font-heading uppercase tracking-widest mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}