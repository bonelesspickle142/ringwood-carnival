import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Save, Calendar, MapPin, Tag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Performance", "Food", "Craft", "Music", "Family", "other"];

const EMPTY_EVENT = {
  title: "",
  description: "",
  location: "",
  date: "",
  start_time: "",
  end_time: "",
  category: "other",
  carnival_period: "",
  image_url: "",
  image_position: "center center",
  is_featured: false,
};

// Parse "x% y%" → {x, y}; default to center
function parsePosition(str) {
  const m = (str || "50% 50%").match(/([\d.]+)%\s+([\d.]+)%/);
  if (m) return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
  const map = { top: 0, left: 0, center: 50, bottom: 100, right: 100 };
  const parts = (str || "center center").split(/\s+/);
  return { x: map[parts[0]] ?? map[parts[1]] ?? 50, y: map[parts[1]] ?? map[parts[0]] ?? 50 };
}

function EventForm({ event, onSave, onCancel }) {
  const [form, setForm] = useState(event || EMPTY_EVENT);
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.start_time.trim()) {
      toast.error("Title and start time are required.");
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5 mb-4"
    >
      <h3 className="font-heading font-bold text-foreground mb-4">
        {event?.id ? "Edit Event" : "Add New Event"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Title *</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Event title"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Brief description..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Start Time *</label>
            <input
              value={form.start_time}
              onChange={(e) => set("start_time", e.target.value)}
              placeholder="e.g. 14:00"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">End Time</label>
            <input
              value={form.end_time}
              onChange={(e) => set("end_time", e.target.value)}
              placeholder="e.g. 15:30"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Date</label>
          <input
            type="date"
            value={form.date || ""}
            onChange={(e) => set("date", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Location</label>
          <input
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="e.g. Market Place"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Category</label>
            <Select value={form.category} onValueChange={(value) => set("category", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Carnival Period</label>
            <Select value={form.carnival_period || ""} onValueChange={(value) => set("carnival_period", value)}>
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carnival_week">Carnival Week</SelectItem>
                <SelectItem value="carnival_day">Carnival Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Image URL</label>
          <input
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {form.image_url && (
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
              Image Position — click or drag on the image
            </label>
            <div
              className="relative w-full h-40 rounded-xl overflow-hidden border border-border cursor-crosshair select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const handle = (ev) => {
                  const x = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100));
                  const y = Math.min(100, Math.max(0, ((ev.clientY - rect.top) / rect.height) * 100));
                  set("image_position", `${Math.round(x)}% ${Math.round(y)}%`);
                };
                handle(e);
                const move = (ev) => handle(ev);
                const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
                window.addEventListener("mousemove", move);
                window.addEventListener("mouseup", up);
              }}
            >
              <img
                src={form.image_url}
                alt="preview"
                className="w-full h-full object-cover pointer-events-none"
                style={{ objectPosition: form.image_position || "center center" }}
              />
              {(() => {
                const { x, y } = parsePosition(form.image_position);
                return (
                  <>
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute w-px h-full bg-white/60" style={{ left: `${x}%` }} />
                      <div className="absolute h-px w-full bg-white/60" style={{ top: `${y}%` }} />
                      <div className="absolute w-4 h-4 border-2 border-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md" style={{ left: `${x}%`, top: `${y}%` }} />
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded font-heading pointer-events-none">
                      {form.image_position || "50% 50%"}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => set("is_featured", e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-foreground font-heading">Featured event</span>
        </label>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-primary text-white font-heading font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Event"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    const data = await base44.entities.Event.list("start_time", 50);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
    const unsubscribe = base44.entities.Event.subscribe((event) => {
      if (event.type === "create") {
        setEvents((prev) => [...prev, event.data].sort((a, b) => (a.start_time > b.start_time ? 1 : -1)));
      } else if (event.type === "update") {
        setEvents((prev) => prev.map((e) => e.id === event.id ? { ...e, ...event.data } : e));
      } else if (event.type === "delete") {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
      }
    });
    return unsubscribe;
  }, []);

  const handleSave = async (form) => {
    if (editingEvent?.id) {
      setEvents((prev) => prev.map((e) => e.id === editingEvent.id ? { ...e, ...form } : e));
      setShowForm(false);
      setEditingEvent(null);
      await base44.functions.invoke("manageEvent", { action: "update", id: editingEvent.id, data: form });
      toast.success("Event updated.");
    } else {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...form, id: tempId, _optimistic: true };
      setEvents((prev) => [...prev, optimistic]);
      setShowForm(false);
      setEditingEvent(null);
      const response = await base44.functions.invoke("manageEvent", { action: "create", data: form });
      setEvents((prev) => prev.map((e) => e.id === tempId ? { ...response.data } : e));
      toast.success("Event created.");
    }
  };

  const handleDelete = async (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await base44.functions.invoke("manageEvent", { action: "delete", id });
    toast.success("Event deleted.");
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openNew = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-foreground text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Events
        </h2>
        {!showForm && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-primary text-white font-heading font-bold px-4 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <EventForm
            event={editingEvent}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingEvent(null); }}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No events yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: event._optimistic ? 0.6 : 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-start overflow-hidden"
              >
                {event.image_url && (
                  <img src={event.image_url} alt={event.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{event.title}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
                        {event.start_time && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{event.start_time}{event.end_time ? ` – ${event.end_time}` : ""}
                          </span>
                        )}
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{event.location}
                          </span>
                        )}
                        {event.category && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />{event.category}
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{event.description}</p>
                      )}
                    </div>
                    {!event._optimistic && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openEdit(event)}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}