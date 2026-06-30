import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import PullToRefreshIndicator from "../components/PullToRefreshIndicator";
import { usePullToRefresh } from "../hooks/usePullToRefresh";

const RINGWOOD_CENTER = [50.8477, -1.7925];

const CATEGORY_CONFIG = {
  "Event": { emoji: "🎪", color: "#3b4d8f" },
  "Parking": { emoji: "🅿️", color: "#2563eb" },
  "Toilet": { emoji: "🚻", color: "#6b7280" },
  "First Aid": { emoji: "✚", color: "#dc2626" },
  "Food": { emoji: "🍽️", color: "#f59e0b" },
  "Information": { emoji: "ℹ️", color: "#8b5cf6" },
  "Other": { emoji: "📍", color: "#6b7280" },
};

const FILTERS = ["All", "Event", "Parking", "Toilet", "First Aid", "Food", "Information", "Other"];

function makeIcon(category) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["Other"];
  return L.divIcon({
    className: "rwc-map-marker",
    html: `<div style="
      background: ${config.color};
      width: 34px; height: 34px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    "><span style="transform: rotate(45deg); font-size: 15px; line-height: 1;">${config.emoji}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

export default function MapView() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const loadData = useCallback(async () => {
    try {
      const data = await base44.entities.MapPoint.list();
      setPoints(data);
    } catch (e) {
      // No points yet
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = base44.entities.MapPoint.subscribe(() => { loadData(); });
    return unsubscribe;
  }, [loadData]);

  const { pulling, pullDistance, refreshing } = usePullToRefresh(loadData);

  const filtered = activeFilter === "All" ? points : points.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen">
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />

      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .leaflet-popup-content {
          margin: 12px 14px;
          font-family: var(--font-body);
        }
        .leaflet-container {
          font-family: var(--font-body);
        }
      `}</style>

      {/* Header */}
      <div className="px-5 md:px-12 pt-14 pb-2">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground flex items-center gap-2"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          <MapPin className="w-7 h-7 text-secondary" />
          Carnival Map
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-0.5">Find your way around Ringwood</p>
      </div>

      {/* Filters */}
      <div className="px-5 md:px-12 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "All" ? "🗺️ All" : `${CATEGORY_CONFIG[f]?.emoji || "📍"} ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="px-5 md:px-12 pb-32">
        <div className="rounded-2xl overflow-hidden border border-border h-[60vh] md:h-[70vh] mb-28">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-muted">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <MapContainer
              center={RINGWOOD_CENTER}
              zoom={15}
              scrollWheelZoom
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filtered.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.latitude, point.longitude]}
                  icon={makeIcon(point.category)}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{CATEGORY_CONFIG[point.category]?.emoji || "📍"}</span>
                        <h3 className="font-bold text-sm text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                          {point.name}
                        </h3>
                      </div>
                      {point.description && (
                        <p className="text-muted-foreground text-xs leading-relaxed mb-2">{point.description}</p>
                      )}
                      {point.linked_event_id && (
                        <Link
                          to="/schedule"
                          className="inline-block text-xs font-semibold text-primary hover:underline mt-1"
                        >
                          View on What's On →
                        </Link>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
        {points.length === 0 && !loading && (
          <p className="text-center text-muted-foreground text-sm mt-4">
            Map points are being added. Check back soon!
          </p>
        )}
      </div>
    </div>
  );
}