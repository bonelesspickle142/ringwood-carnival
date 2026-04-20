import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import LogoCarousel from "./LogoCarousel";
import CarnivalCountdown from "./CarnivalCountdown";

export default function LivePulseHero({ heroImage }) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[70vh] min-h-[500px]">
        <img src={heroImage} alt="Ringwood Carnival procession" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-4 flex-wrap mb-2">
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Ringwood<br /><span className="text-secondary">Carnival</span>
            </h1>
            <Link
              to="/donate"
              className="flex items-center gap-2 bg-secondary text-white font-heading font-bold text-base md:text-lg px-5 py-3 rounded-2xl hover:bg-secondary/90 transition-all duration-200 shadow-lg shadow-secondary/30 self-end mb-2"
            >
              <Heart className="w-5 h-5" />
              Donate
            </Link>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-white/80 font-body text-lg md:text-xl mb-6 max-w-lg leading-relaxed">
            A celebration of community, colour and creativity in the heart of Hampshire
          </motion.p>

          <CarnivalCountdown />

          {/* Sponsor logos carousel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <p className="text-white/50 text-xs font-heading uppercase tracking-widest mb-3">Supported by</p>
            <LogoCarousel />
          </motion.div>
        </div>
      </div>
    </div>
  );
}