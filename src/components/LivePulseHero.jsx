import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import LogoCarousel from "./LogoCarousel";
import CarnivalCountdown from "./CarnivalCountdown";

export default function LivePulseHero({ heroImage }) {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero image */}
      <div className="relative min-h-[520px]" style={{ height: "calc(62vh + env(safe-area-inset-top))" }}>
        <img
          src={heroImage}
          alt="Ringwood Carnival procession"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle dark scrim — no heavy blue gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-1 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ringwood<br />
              <span className="text-secondary">Carnival</span>
            </h1>
            <p className="text-white/75 text-base md:text-lg mb-5 max-w-sm leading-snug">
              A celebration of community &amp; colour in the heart of Hampshire
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3 mb-6"
          >
            <Link
              to="/donate"
              className="flex items-center gap-2 bg-secondary text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-secondary/90 active:scale-95 transition-all duration-150 shadow-lg shadow-secondary/30"
            >
              <Heart className="w-4 h-4" />
              Donate
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <CarnivalCountdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-5"
          >
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2">Supported by</p>
            <LogoCarousel />
          </motion.div>
        </div>
      </div>
    </div>
  );
}