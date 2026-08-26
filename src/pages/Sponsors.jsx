import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Loader2, Award } from "lucide-react";

function SponsorCard({ sponsor, large }) {
  const Wrapper = sponsor.url ? "a" : "div";
  const props = sponsor.url ? { href: sponsor.url, target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Wrapper
      {...props}
      className={`bg-white border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-transform ${sponsor.url ? "hover:scale-[1.02] cursor-pointer" : ""} ${large ? "min-h-[170px]" : "min-h-[130px]"}`}
    >
      {sponsor.image_url ? (
        <img
          src={sponsor.image_url}
          alt={sponsor.name}
          className={`object-contain ${large ? "max-h-24 max-w-[220px]" : "max-h-16 max-w-[150px]"}`}
        />
      ) : (
        <div className="font-heading font-bold text-foreground text-center text-lg">{sponsor.name}</div>
      )}
      {sponsor.image_url && (
        <p className="text-xs text-muted-foreground text-center">{sponsor.name}</p>
      )}
    </Wrapper>
  );
}

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Sponsor.list("sort_order", 200);
        data.sort((a, b) => {
          if (a.is_headline && !b.is_headline) return -1;
          if (!a.is_headline && b.is_headline) return 1;
          return (a.sort_order ?? 999) - (b.sort_order ?? 999);
        });
        setSponsors(data);
      } catch { /* empty */ }
      setLoading(false);
    };
    load();
    const unsubscribe = base44.entities.Sponsor.subscribe(() => load());
    return unsubscribe;
  }, []);

  const headline = sponsors.filter((s) => s.is_headline);
  const others = sponsors.filter((s) => !s.is_headline);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 md:px-12 pt-14 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          Our Sponsors
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-0.5">The businesses who make it all possible</p>
      </div>

      {/* Pre-amble — blue tile */}
      <div className="px-5 md:px-12 py-6">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm">
          <p className="text-sm leading-relaxed">
            The Ringwood Carnival simply wouldn't be possible without the incredible generosity of our sponsors. Their support helps us put on a spectacular day of fun, music, and community spirit for the whole town to enjoy — year after year.
          </p>
          <p className="text-sm leading-relaxed mt-3">
            We're proud to announce that <strong>Economy Hire</strong> is our headline sponsor for this year. A huge thank you to them for leading the way, and to all our wonderful sponsors listed below.
          </p>
        </div>
      </div>

      {/* Headline sponsor — red tile */}
      {headline.length > 0 && (
        <div className="px-5 md:px-12 py-4">
          <div className="bg-secondary text-secondary-foreground rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-heading font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" /> Headline Sponsor
              </span>
            </div>
            <div className="max-w-md mx-auto">
              {headline.map((s) => (
                <SponsorCard key={s.id} sponsor={s} large />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other sponsors — blue tile */}
      <div className="px-5 md:px-12 py-6 pb-32">
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-sm">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-white/70" />
            </div>
          ) : others.length > 0 ? (
            <>
              <h2 className="font-heading font-bold text-white text-lg mb-4">With Thanks To</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {others.map((s) => (
                  <SponsorCard key={s.id} sponsor={s} />
                ))}
              </div>
            </>
          ) : sponsors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/80 text-lg mb-2">Sponsor details coming soon!</p>
              <p className="text-white/60 text-sm">Check back for our full list of sponsors</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}