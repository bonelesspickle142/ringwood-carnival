import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function BandCard({ band, index }) {
  const bg = index % 2 === 0 ? "bg-primary" : "bg-secondary";

  const sponsors = [];
  if (band.afternoon_sponsor) sponsors.push({ period: "Afternoon", name: band.afternoon_sponsor });
  if (band.evening_sponsor) sponsors.push({ period: "Evening", name: band.evening_sponsor });
  if (band.sponsor) sponsors.push({ period: null, name: band.sponsor });

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.2) }}
    >
      <div className={`${bg} rounded-xl p-4 text-white`}>
        {/* Image */}
        {band.image_url && (
          <div className="rounded-lg overflow-hidden border border-white/20 mb-3">
            <img src={band.image_url} alt={band.name} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Name */}
        <h3 className="font-heading text-lg font-bold mb-1.5">{band.name}</h3>

        {/* Description */}
        {band.description && (
          <p className="text-white/85 text-sm leading-relaxed">{band.description}</p>
        )}

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs font-heading font-semibold uppercase tracking-wide text-white/70 mb-1.5">
              Sponsored by
            </p>
            <div className="flex flex-col gap-1">
              {sponsors.map((s, i) => (
                <p key={i} className="text-sm text-white/90">
                  {s.period ? (
                    <>
                      <span className="font-semibold">{s.period}:</span> {s.name}
                    </>
                  ) : (
                    s.name
                  )}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Link */}
        {band.link_url && (
          <a
            href={band.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors w-full justify-center"
          >
            <ExternalLink className="w-4 h-4" /> Find out more
          </a>
        )}
      </div>
    </motion.section>
  );
}