import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Truck, Crown, Music, Users, Flame, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import BandCard from "@/components/processions/BandCard";

// Drop your procession photo URLs in here (one per slot). Leave as "" to show a placeholder.
const PROCESSION_IMAGES = ["", "", ""];

function ImageSlot({ src, alt, index }) {
  if (!src) {
    return (
      <div className="rounded-xl border border-dashed border-white/30 bg-white/5 p-8 flex flex-col items-center justify-center gap-2 text-white/60">
        <Sparkles className="w-6 h-6" />
        <p className="text-xs font-heading font-semibold">Photo coming soon</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl overflow-hidden border border-white/20">
      <img src={src} alt={alt} className="w-full h-auto object-cover" />
    </div>
  );
}

export default function Processions() {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.ProcessionBand.list("sort_order", 200);
        setBands(data);
      } catch { /* empty */ }
      setLoading(false);
    };
    load();
    const unsubscribe = base44.entities.ProcessionBand.subscribe(() => load());
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative h-32 md:h-44 overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/60 to-primary/40" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            Our Processions
          </motion.h1>
          <p className="text-white/70 text-sm mt-0.5">The heart and soul of Carnival day</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-6 max-w-3xl space-y-6">
        {/* Intro — red tile */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-secondary rounded-xl p-4 text-white">
            <h2 className="font-heading text-lg font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> A Festival of Fun
            </h2>
            <p className="text-white/85 text-sm leading-relaxed">
              Ringwood Carnival is unique in that we have two processions; making it a &lsquo;festival of fun&rsquo; on Carnival day!
            </p>
          </div>
        </motion.section>

        {/* Image slot 1 — blue tile */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
          <div className="bg-primary rounded-xl p-4 text-primary-foreground">
            <ImageSlot src={PROCESSION_IMAGES[0]} alt="Ringwood Carnival procession" index={0} />
          </div>
        </motion.section>

        {/* Main description — red tile */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
          <div className="bg-secondary rounded-xl p-4 text-white">
            <h2 className="font-heading text-lg font-bold mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4" /> The Heart and Soul of the Day
            </h2>
            <p className="text-white/85 text-sm leading-relaxed">
              Our processions are the heart and soul of the day and include our wonderful community floats, feature vehicles, Carnival Court on a horse drawn carriage, marching bands, dance troupes and steam engines together with loud bangs, music and flashing lights &mdash; Ringwood Carnival is very proud of the diversity and strength of our processions.
            </p>
          </div>
        </motion.section>

        {/* Image slot 2 — blue tile */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
          <div className="bg-primary rounded-xl p-4 text-primary-foreground">
            <ImageSlot src={PROCESSION_IMAGES[1]} alt="Ringwood Carnival procession" index={1} />
          </div>
        </motion.section>

        {/* What you'll see — red tile */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="bg-secondary rounded-xl p-4 text-white">
            <h2 className="font-heading text-lg font-bold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> What You&rsquo;ll See
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/85 text-sm">
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 flex-shrink-0" /> Community floats</li>
              <li className="flex items-center gap-2"><Truck className="w-4 h-4 flex-shrink-0" /> Feature vehicles</li>
              <li className="flex items-center gap-2"><Crown className="w-4 h-4 flex-shrink-0" /> Carnival Court carriage</li>
              <li className="flex items-center gap-2"><Music className="w-4 h-4 flex-shrink-0" /> Marching bands</li>
              <li className="flex items-center gap-2"><Music className="w-4 h-4 flex-shrink-0" /> Dance troupes</li>
              <li className="flex items-center gap-2"><Flame className="w-4 h-4 flex-shrink-0" /> Steam engines</li>
            </ul>
          </div>
        </motion.section>

        {/* Image slot 3 — blue tile */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-primary rounded-xl p-4 text-primary-foreground">
            <ImageSlot src={PROCESSION_IMAGES[2]} alt="Ringwood Carnival procession" index={2} />
          </div>
        </motion.section>

        {/* Bands & Groups */}
        <div className="pt-2">
          <h2
            className="text-xl font-bold text-foreground mb-4 px-1"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            The Bands &amp; Groups
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : bands.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">Band details coming soon.</p>
            ) : (
              bands.map((band, i) => (
                <BandCard key={band.id} band={band} index={i} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}