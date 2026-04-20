import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import LivePulseHero from "../components/LivePulseHero";
import QuickLinks from "../components/QuickLinks";
import EventCard from "../components/EventCard";
import SplashScreen from "../components/SplashScreen";
import ProcessionRoute from "../components/ProcessionRoute";
import { Loader2, Heart } from "lucide-react";

const HERO_IMAGE = "https://media.base44.com/images/public/69da7ac3061580afda8ac770/567951c00_generated_23a2c72b.png";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const events = await base44.entities.Event.list("start_time", 6);
        setFeaturedEvents(events);
      } catch (e) {
        // No events yet
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <div className="min-h-screen">
        <LivePulseHero heroImage={HERO_IMAGE} />

        <ProcessionRoute />

        <QuickLinks />

        {/* Featured Events Preview */}
        <div className="px-6 md:px-12 pb-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">What's On at Carnival:</h2>

          {loading ?
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div> :
            featuredEvents.length > 0 ?
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredEvents.map((event, i) =>
                  <EventCard key={event.id} event={event} index={i} isFeatured={event.is_featured} />
                )}
              </div> :
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground text-lg mb-2">Events coming soon!</p>
                <p className="text-muted-foreground/60 text-sm">Check back on carnival day for the full schedule</p>
              </div>
          }
        </div>
      </div>
    </>
  );
}