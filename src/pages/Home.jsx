import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import LivePulseHero from "../components/LivePulseHero";
import QuickLinks from "../components/QuickLinks";
import EventCard from "../components/EventCard";
import { Loader2, Clock, Heart } from "lucide-react";

const HERO_IMAGE = "https://media.base44.com/images/public/69da7ac3061580afda8ac770/567951c00_generated_23a2c72b.png";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const events = await base44.entities.Event.list("start_time", 6);
        setFeaturedEvents(events);
      } catch (e) {

        // No events yet
      }setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen">
      <LivePulseHero heroImage={HERO_IMAGE} />

      {/* Procession Times Banner */}
      <div className="mx-6 md:mx-12 mt-6 bg-primary rounded-2xl p-5 md:p-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="font-heading font-bold text-sm tracking-widest uppercase text-secondary">Procession Times 2024</span>
        </div>
        <div className="flex gap-6 mb-4">
          <div>
            <div className="font-heading text-3xl md:text-4xl font-bold">14:00</div>
            <div className="text-white/70 text-sm">Afternoon Procession</div>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <div className="font-heading text-3xl md:text-4xl font-bold">19:15</div>
            <div className="text-white/70 text-sm">Evening Procession</div>
          </div>
        </div>
        <p className="text-white/60 text-xs">Both processions depart from Market Place along the High Street</p>
      </div>

      {/* Donate CTA */}
      <div className="mx-6 md:mx-12 mt-4">
        <Link
          to="/donate"
          className="flex items-center justify-center gap-3 w-full bg-secondary text-white font-heading font-bold text-lg py-4 rounded-2xl hover:bg-secondary/90 transition-all duration-200 shadow-lg shadow-secondary/30">
          
          <Heart className="w-6 h-6" />
          Support the Carnival — Donate Now
        </Link>
      </div>

      <QuickLinks />

      {/* Featured Events Preview */}
      <div className="px-6 md:px-12 pb-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">What's On at Carnival:

        </h2>

        {loading ?
        <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div> :
        featuredEvents.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.map((event, i) =>
          <EventCard
            key={event.id}
            event={event}
            index={i}
            isFeatured={event.is_featured} />

          )}
          </div> :

        <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground text-lg mb-2">
              Events coming soon!
            </p>
            <p className="text-muted-foreground/60 text-sm">
              Check back on carnival day for the full schedule
            </p>
          </div>
        }
      </div>
    </div>);

}