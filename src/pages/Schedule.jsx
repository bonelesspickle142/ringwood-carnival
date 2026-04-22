import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import EventCard from "../components/EventCard";
import { Loader2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import PullToRefreshIndicator from "../components/PullToRefreshIndicator";
import { usePullToRefresh } from "../hooks/usePullToRefresh";

const EVENTS_IMAGE = "https://media.base44.com/images/public/69da7ac3061580afda8ac770/c843088ab_generated_4ee0f178.png";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "performance", label: "Performance" },
  { key: "music", label: "Music" },
  { key: "food", label: "Food & Drink" },
  { key: "family", label: "Family" },
  { key: "craft", label: "Craft" },
  { key: "stall", label: "Stalls" },
  { key: "other", label: "Other" },
];

export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const loadEvents = useCallback(async () => {
    try {
      const data = await base44.entities.Event.list("start_time", 100);
      setEvents(data);
    } catch (e) {
      // empty
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
    const unsubscribe = base44.entities.Event.subscribe(() => { loadEvents(); });
    return unsubscribe;
  }, [loadEvents]);

  const { pulling, pullDistance, refreshing } = usePullToRefresh(loadEvents);

  const filtered = activeFilter === "all"
    ? events
    : events.filter((e) => e.category === activeFilter);

  return (
    <div className="min-h-screen">
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
      {/* Header banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={EVENTS_IMAGE}
          alt="Ringwood Carnival events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white"
          >
            Events & Pop-ups
          </motion.h1>
          <p className="text-white/70 text-sm md:text-base mt-1">
            Everything happening at the carnival today
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 md:px-12 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveFilter(cat.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-heading font-semibold transition-all duration-200 ${
                activeFilter === cat.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="px-6 md:px-12 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                isFeatured={event.is_featured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground text-lg mb-2">
              {events.length === 0 ? "Events coming soon!" : "No events in this category"}
            </p>
            <p className="text-muted-foreground/60 text-sm">
              {events.length === 0
                ? "Check back on carnival day for the full schedule"
                : "Try selecting a different category"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}