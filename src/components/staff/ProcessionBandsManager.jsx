import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Save, Music, Loader2, Upload, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const EMPTY_BAND = {
  name: "",
  description: "",
  image_url: "",
  link_url: "",
  afternoon_sponsor: "",
  evening_sponsor: "",
  sponsor: "",
  sort_order: 0,
};

function BandForm({ band, onSave, onCancel }) {
  const [form, setForm] = useState(band || EMPTY_BAND);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      set("image_url", file_url);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Band name is required.");
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
        {band?.id ? "Edit Band / Group" : "Add Band / Group"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Quarterjacks Marching Band"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            placeholder="Tell people about this band..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Photo</label>
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="w-full h-36 object-cover rounded-xl mb-2" />
          )}
          <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : form.image_url ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Website Link</label>
          <input
            value={form.link_url}
            onChange={(e) => set("link_url", e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Afternoon Sponsor</label>
            <input
              value={form.afternoon_sponsor}
              onChange={(e) => set("afternoon_sponsor", e.target.value)}
              placeholder="Sponsor name"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Evening Sponsor</label>
            <input
              value={form.evening_sponsor}
              onChange={(e) => set("evening_sponsor", e.target.value)}
              placeholder="Sponsor name"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Sponsor (if not tied to a specific procession)</label>
          <input
            value={form.sponsor}
            onChange={(e) => set("sponsor", e.target.value)}
            placeholder="Sponsor name"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Sort Order</label>
          <input
            type="number"
            value={form.sort_order ?? 0}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onCancel} className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-primary text-white font-heading font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function sponsorSummary(b) {
  const parts = [];
  if (b.afternoon_sponsor) parts.push(`Afternoon: ${b.afternoon_sponsor}`);
  if (b.evening_sponsor) parts.push(`Evening: ${b.evening_sponsor}`);
  if (b.sponsor) parts.push(b.sponsor);
  return parts.join("  •  ");
}

export default function ProcessionBandsManager() {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.ProcessionBand.list("sort_order", 200);
      setBands(data);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsubscribe = base44.entities.ProcessionBand.subscribe(() => load());
    return unsubscribe;
  }, []);

  const handleSave = async (form) => {
    if (editing?.id) {
      setBands((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
      setShowForm(false);
      setEditing(null);
      await base44.functions.invoke("manageProcessionBand", { action: "update", id: editing.id, data: form });
      toast.success("Band updated.");
    } else {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...form, id: tempId, _optimistic: true };
      setBands((prev) => [...prev, optimistic]);
      setShowForm(false);
      setEditing(null);
      const response = await base44.functions.invoke("manageProcessionBand", { action: "create", data: form });
      setBands((prev) => prev.map((s) => (s.id === tempId ? { ...response.data } : s)));
      toast.success("Band added.");
    }
  };

  const handleDelete = async (id) => {
    setBands((prev) => prev.filter((s) => s.id !== id));
    await base44.functions.invoke("manageProcessionBand", { action: "delete", id });
    toast.success("Band removed.");
  };

  const openEdit = (band) => {
    setEditing(band);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-bold text-foreground text-base flex items-center gap-2">
          <Music className="w-4 h-4 text-primary" /> Procession Bands
        </h3>
        {!showForm && (
          <button onClick={openNew} className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold px-3 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Band
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <BandForm
            band={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : bands.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No bands yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {bands.map((band) => (
              <motion.div
                key={band.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: band._optimistic ? 0.6 : 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-center overflow-hidden"
              >
                {band.image_url ? (
                  <img src={band.image_url} alt={band.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Music className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-bold text-foreground text-sm truncate">{band.name}</p>
                  {sponsorSummary(band) && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{sponsorSummary(band)}</p>
                  )}
                  {band.link_url && (
                    <a href={band.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5 truncate">
                      <ExternalLink className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{band.link_url}</span>
                    </a>
                  )}
                </div>
                {!band._optimistic && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(band)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(band.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}