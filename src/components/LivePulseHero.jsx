import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Radio } from "lucide-react";

const ROUTE_POINTS = [
  "Market Place",
  "High Street",
  "Christchurch Road",
  "Meeting House Lane",
  "The Furlong",
  "Carvers Recreation Ground",
];

export default function LivePulseHero({ heroImage }) {
  const [progress, setProgress] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);

  const [processionLabel, setProcessionLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMins = hours * 60 + minutes;

    // Afternoon procession: 14:00 – 16:30
    if (totalMins >= 840 && totalMins < 990) {
      const elapsed = totalMins - 840;
      const total = 150;
      setProgress(Math.min((elapsed / total) * 100, 100));
      setCurrentPoint(Math.min(Math.floor((elapsed / total) * ROUTE_POINTS.length), ROUTE_POINTS.length - 1));
      setProcessionLabel("Afternoon Procession (14:00)");
    // Evening procession: 19:15 – 21:45
    } else if (totalMins >= 1155 && totalMins < 1305) {
      const elapsed = totalMins - 1155;
      const total = 150;
      setProgress(Math.min((elapsed / total) * 100, 100));
      setCurrentPoint(Math.min(Math.floor((elapsed / total) * ROUTE_POINTS.length), ROUTE_POINTS.length - 1));
      setProcessionLabel("Evening Procession (19:15)");
    } else if (totalMins >= 1305) {
      setProgress(100);
      setCurrentPoint(ROUTE_POINTS.length - 1);
      setProcessionLabel("Evening Procession Complete");
    } else if (totalMins >= 990 && totalMins < 1155) {
      setProgress(0);
      setCurrentPoint(0);
      setProcessionLabel("Next: Evening Procession at 19:15");
    } else {
      setProgress(0);
      setCurrentPoint(0);
      setProcessionLabel("Next: Afternoon Procession at 14:00");
    }
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-[70vh] min-h-[500px]">
        <img
          src={heroImage}
          alt="Ringwood Carnival procession"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          {/* Live indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
            </span>
            <span className="text-secondary font-heading font-bold text-sm tracking-widest uppercase">
              Carnival Day
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-2"
          >
            Ringwood
            <br />
            <span className="text-secondary">Carnival</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 font-body text-lg md:text-xl mb-8 max-w-lg leading-relaxed"
          >
            A celebration of community, colour and creativity in the heart of Hampshire
          </motion.p>

          {/* Procession Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 md:p-6 max-w-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-secondary" />
                <span className="text-white/90 font-heading text-sm font-semibold">Procession Route</span>
              </div>
              {processionLabel && (
                <span className="text-secondary text-xs font-heading font-bold">{processionLabel}</span>
              )}
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-accent rounded-full"
              />
            </div>

            {/* Route points */}
            <div className="flex justify-between items-center">
              {ROUTE_POINTS.map((point, i) => (
                <div key={point} className="flex flex-col items-center group">
                  <div
                    className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                      i <= currentPoint
                        ? "bg-secondary border-secondary scale-110"
                        : "bg-transparent border-white/40"
                    }`}
                  />
                  <span
                    className={`text-[9px] md:text-xs mt-1.5 text-center leading-tight max-w-[60px] ${
                      i === currentPoint
                        ? "text-secondary font-semibold"
                        : "text-white/50"
                    }`}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}