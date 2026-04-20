import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";

const ROUTE_POINTS = [
  "Parkside",
  "Castleman Roundabout",
  "Greyfriars Roundabout",
  "Market place",
  "Meeting House Lane",
  "Quomp",
 
];

export default function ProcessionRoute() {
  const [progress, setProgress] = useState(0);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [processionLabel, setProcessionLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const totalMins = now.getHours() * 60 + now.getMinutes();

    if (totalMins >= 840 && totalMins < 990) {
      const elapsed = totalMins - 840;
      setProgress(Math.min((elapsed / 150) * 100, 100));
      setCurrentPoint(Math.min(Math.floor((elapsed / 150) * ROUTE_POINTS.length), ROUTE_POINTS.length - 1));
      setProcessionLabel("Afternoon Procession (14:00)");
    } else if (totalMins >= 1155 && totalMins < 1305) {
      const elapsed = totalMins - 1155;
      setProgress(Math.min((elapsed / 150) * 100, 100));
      setCurrentPoint(Math.min(Math.floor((elapsed / 150) * ROUTE_POINTS.length), ROUTE_POINTS.length - 1));
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mx-6 md:mx-12 mt-6 bg-primary rounded-2xl p-5 md:p-6 border border-primary/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-secondary" />
          <span className="text-white font-heading text-base font-semibold">Procession Route</span>
        </div>
        {processionLabel && (
          <span className="text-secondary text-xs font-heading font-bold">{processionLabel}</span>
        )}
      </div>
      <div className="relative h-2 bg-white/20 rounded-full mb-5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-accent rounded-full"
        />
      </div>
      <div className="flex justify-between items-center">
        {ROUTE_POINTS.map((point, i) => (
          <div key={point} className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${i <= currentPoint ? "bg-secondary border-secondary scale-110" : "bg-transparent border-white/40"}`} />
            <span className={`text-[9px] md:text-xs mt-1.5 text-center leading-tight max-w-[60px] ${i === currentPoint ? "text-secondary font-semibold" : "text-white/50"}`}>
              {point}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}