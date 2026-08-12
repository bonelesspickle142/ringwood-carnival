import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { Loader2, Trash2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const RINGWOOD_CENTER = [50.8477, -1.7925];

const CATEGORIES = ["Event", "Parking", "Toilet", "First Aid", "Food", "Information", "Other"];

const CATEGORY_EMOJI = {
  "Event": "🎪",
  "Parking": "🅿️",
  "Toilet": "🚻",
  "First Aid": "✚",
  "Food": "🍽️",
  "Information": "ℹ️",
  "Other": "📍",
};

function makeIcon(category) {
  const color = {
    "Event": "#3b4d8f",
    "Parking": "#2563eb",
    "Toilet": "#6b7280",
    "First Aid": "#dc2626",
    "Food": "#f59e0b",
    "Information": "#8b5cf6",
    "Other": "#6b7280",
  }[category] || "#6b7280";
  return L.divIcon({
    className: "rwc-map-marker",
    html: `<div style="background:${color};width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"><span style="transform:rotate(45deg);font-size:14px;">${CATEGORY_EMOJI[category] || "📍"}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

function LocationPicker({ position, onPick }) {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={makeIcon("Other")} /> : null;
}

export default function MapManager() {
  const [points, setPoints] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [linkedEventId, setLinkedEventId] = useState("");
  const [pickerPos, setPickerPos] = useState(null);

  const loadData = async () => {
    try {
      const [pts, evts] = await Promise.all([
        base44.entities.MapPoint.list(),
        base44.entities.Event.list("start_time", 100),
      ]);
      setPoints(pts);
      setEvents(evts);
    } catch (e) {
      // empty
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (pickerPos) {
      setLatitude(pickerPos[0].toFixed(6));
      setLongitude(pickerPos[1].toFixed(6));
    }
  }, [pickerPos]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !latitude || !longitude) {
      toast.error("Name and location are required.");
      return;
    }
    setSaving(true);
    try {
      await base44.entities.MapPoint.create({
        name: name.trim(),
        description: description.trim(),
        category,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        linked_event_id: linkedEventId || undefined,
      });
      toast.success("Map point added!");
      setName("");
      setDescription("");
      setCategory("Other");
      setLatitude("");
      setLongitude("");
      setLinkedEventId("");
      setPickerPos(null);
      loadData();
    } catch (err) {
      toast.error("Failed to add point.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
    await base44.entities.MapPoint.delete(id);
    toast.success("Point removed.");
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-foreground text-lg mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" /> Map Points
      </h2>

      <style>{`
        .leaflet-popup-content-wrapper { border-radius: 16px; }
        .leaflet-container { font-family: var(--font-body); }
      `}</style>

      {/* Add Form */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <h3 className="font-heading font-bold text-foreground text-sm mb-3">Add New Point</h3>

        {/* Mini picker map */}
        <p className="text-xs text-muted-foreground mb-2">Tap the map to set location, or enter coordinates manually.</p>
        <div className="rounded-xl overflow-hidden border border-border h-[200px] mb-3">
          <MapContainer center={RINGWOOD_CENTER} zoom={15} className="w-full h-full" scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <LocationPicker position={pickerPos} onPick={setPickerPos} />
          </MapContainer>
        </div>

        <form onSubmit={handleAdd} className="space-y-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Point name *"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Latitude *"
              type="number"
              step="any"
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Longitude *"
              type="number"
              step="any"
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Select value={linkedEventId} onValueChange={setLinkedEventId}>
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue placeholder="No linked event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>No linked event</SelectItem>
              {events.map((ev) => (
                <SelectItem key={ev.id} value={ev.id}>{ev.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-white font-heading font-bold py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Point"}
          </button>
        </form>
      </div>

      {/* Existing Points */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : points.length === 0 ? (
        <div className="text-center py-8 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No map points yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {points.map((point, i) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg flex-shrink-0">
                {CATEGORY_EMOJI[point.category] || "📍"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground text-sm truncate">{point.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {point.category} · {point.latitude?.toFixed(4)}, {point.longitude?.toFixed(4)}
                </p>
                {point.linked_event_id && (
                  <p className="text-xs text-primary">↗ Linked to event</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(point.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}