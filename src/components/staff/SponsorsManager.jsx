import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Save, Award, Loader2, Star, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const EMPTY_SPONSOR = {
  name: "",
  image_url: "",
  url: "",
  is_headline: false,
  sort_order: 0,
};

function SponsorForm({ sponsor, onSave, onCancel }) {
  const [form, setForm] = useState(sponsor || EMPTY_SPONSOR);
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Sponsor name is required.");
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
        {sponsor?.id ? "Edit Sponsor" : "Add New Sponsor"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Sponsor name"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Logo URL</label>
          <input
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Website URL</label>
          <input
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_headline}
            onChange={(e) => set("is_headline", e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-foreground font-heading flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-secondary" /> Headline sponsor
          </span>
        </label>

        {form.image_url && (
          <div className="bg-muted rounded-xl p-3 flex items-center justify-center min-h-[80px]">
            <img src={form.image_url} alt="preview" className="max-h-16 max-w-[200px] object-contain" />
          </div>
        )}

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

export default function SponsorsManager() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
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

  useEffect(() => {
    load();
    const unsubscribe = base44.entities.Sponsor.subscribe(() => load());
    return unsubscribe;
  }, []);

  const handleSave = async (form) => {
    if (editing?.id) {
      setSponsors((prev) => prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)));
      setShowForm(false);
      setEditing(null);
      await base44.functions.invoke("manageSponsor", { action: "update", id: editing.id, data: form });
      toast.success("Sponsor updated.");
    } else {
      const tempId = `temp-${Date.now()}`;
      const optimistic = { ...form, id: tempId, _optimistic: true };
      setSponsors((prev) => [...prev, optimistic]);
      setShowForm(false);
      setEditing(null);
      const response = await base44.functions.invoke("manageSponsor", { action: "create", data: form });
      setSponsors((prev) => prev.map((s) => (s.id === tempId ? { ...response.data } : s)));
      toast.success("Sponsor added.");
    }
  };

  const handleDelete = async (id) => {
    setSponsors((prev) => prev.filter((s) => s.id !== id));
    await base44.functions.invoke("manageSponsor", { action: "delete", id });
    toast.success("Sponsor removed.");
  };

  const openEdit = (sponsor) => {
    setEditing(sponsor);
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
          <Award className="w-4 h-4 text-primary" /> Sponsors
        </h3>
        {!showForm && (
          <button onClick={openNew} className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold px-3 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Sponsor
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <SponsorForm
            sponsor={editing}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : sponsors.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No sponsors yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sponsors.map((sponsor) => (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: sponsor._optimistic ? 0.6 : 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-center overflow-hidden"
              >
                {sponsor.image_url ? (
                  <img src={sponsor.image_url} alt={sponsor.name} className="w-12 h-12 rounded-xl object-contain bg-muted/50 p-1 flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-bold text-foreground text-sm truncate">{sponsor.name}</p>
                    {sponsor.is_headline && (
                      <span className="bg-secondary/10 text-secondary text-[10px] font-heading font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0">Headline</span>
                    )}
                  </div>
                  {sponsor.url && (
                    <a href={sponsor.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5 truncate">
                      <ExternalLink className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{sponsor.url}</span>
                    </a>
                  )}
                </div>
                {!sponsor._optimistic && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(sponsor)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(sponsor.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
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