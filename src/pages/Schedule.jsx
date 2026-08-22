import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import EventCard from "../components/EventCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import PullToRefreshIndicator from "../components/PullToRefreshIndicator";
import { usePullToRefresh } from "../hooks/usePullToRefresh";

const MASK_URL = "https://ss.charleymurphy.xyz/RWC%20Logo.png";

const FILTERS = [
{ key: "all", label: "All" },
{ key: "carnival_week", label: "Carnival Week" },
{ key: "carnival_day", label: "Carnival Day" }];


export default function Schedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const loadEvents = useCallback(async () => {
    try {
      const data = await base44.entities.Event.list("sort_order", 200);
      data.sort((a, b) => {
        const oa = a.sort_order ?? 999;
        const ob = b.sort_order ?? 999;
        if (oa !== ob) return oa - ob;
        return (a.start_time || "").localeCompare(b.start_time || "");
      });
      setEvents(data);
    } catch (e) {





      // empty
    }setLoading(false);}, []);useEffect(() => {loadEvents();
      const unsubscribe = base44.entities.Event.subscribe(() => {loadEvents();});
      return unsubscribe;
    }, [loadEvents]);

  const { pulling, pullDistance, refreshing } = usePullToRefresh(loadEvents);

  const filtered = activeFilter === "all" ?
  events :
  events.filter((e) => e.carnival_period === activeFilter);

  return (
    <div className="min-h-screen relative">
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />

      {/* Watermark mask */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
        aria-hidden="true">
        
        <img
          src={MASK_URL}
          alt=""
          className="w-72 h-72 object-contain opacity-[0.04] dark:opacity-[0.06] select-none" />
        
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-5 md:px-12 pt-14 pb-2">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
            
            What's On
          </motion.h1>
          <p className="text-muted-foreground text-sm mt-0.5">Everything happening at the carnival</p>
        </div>

        {/* Filters */}
        <div className="px-5 md:px-12 py-4">
          <div className="flex items-center gap-2">
            {FILTERS.map((f) =>
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full font-semibold transition-all duration-200 text-4xl bg-[#ed3833] text-[hsl(var(--card))] ${
              activeFilter === f.key ?
              "bg-primary text-primary-foreground" :
              "hover:bg-muted/80"}`
              }>
              
                {f.label}
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="px-6 md:px-12 pb-32">
          {loading ?
          <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div> :
          filtered.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((event, i) =>
            <EventCard
              key={event.id}
              event={event}
              index={i}
              isFeatured={event.is_featured} />

            )}
            </div> :

          <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground text-lg mb-2">
                {events.length === 0 ? "Events coming soon!" : "No events in this category"}
              </p>
              <p className="text-muted-foreground/60 text-sm">
                {events.length === 0 ?
              "Check back on carnival day for the full schedule" :
              "Try selecting a different filter"}
              </p>
            </div>
          }
        </div>
      </div>
    </div>);

}