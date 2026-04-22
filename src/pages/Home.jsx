import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import LivePulseHero from "../components/LivePulseHero";
import QuickLinks from "../components/QuickLinks";
import EventCard from "../components/EventCard";
import SplashScreen from "../components/SplashScreen";
import ProcessionRoute from "../components/ProcessionRoute";
import PullToRefreshIndicator from "../components/PullToRefreshIndicator";
import { usePullToRefresh } from "../hooks/usePullToRefresh";
import { Loader2, Heart } from "lucide-react";

const HERO_IMAGE = "https://ss.charleymurphy.xyz/20250920_Ringwood-carnival-night-proccesion_0493%20%281%29.jpg";

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const events = await base44.entities.Event.list("start_time", 6);
      setFeaturedEvents(events);
    } catch (e) {
      // No events yet
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = base44.entities.Event.subscribe(() => { loadData(); });
    return unsubscribe;
  }, [loadData]);

  const { pulling, pullDistance, refreshing } = usePullToRefresh(loadData);

  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
      <div className="min-h-screen">
        <LivePulseHero heroImage={HERO_IMAGE} />

        <ProcessionRoute />

        <QuickLinks />

        {/* Featured Events Preview */}
        <div className="px-4 md:px-12 pb-32">
          <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>What's On at Carnival</h2>

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