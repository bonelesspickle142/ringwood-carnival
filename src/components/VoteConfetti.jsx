import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function VoteConfetti({ trigger }) {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#EB5E28", "#0A2118"],
        ticks: 60,
      });
    }
  }, [trigger]);

  return null;
}