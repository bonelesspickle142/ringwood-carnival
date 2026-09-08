import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, RefreshCw, Save, X, Pencil, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function SectorMarshalManager() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.SectorMarshal.list("sort_order", 50);
      data.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
      setSectors(data);
    } catch {
      toast.error("Failed to load sector marshals.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) { toast.error("Sector name is required."); return; }
    setAdding(true);
    try {
      const created = await base44.entities.SectorMarshal.create({
        name: newName.trim(),
        phone: newPhone.trim(),
        sort_order: sectors.length,
      });
      setSectors((prev) => [...prev, created]);
      toast.success("Sector marshal added.");
      setNewName(""); setNewPhone(""); setShowAddForm(false);
    } catch {
      toast.error("Failed to add sector marshal.");
    }
    setAdding(false);
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditPhone(s.phone || "");
  };

  const handleSave = async (id) => {
    if (!editName.trim()) { toast.error("Sector name cannot be empty."); return; }
    setSaving(true);
    try {
      const updated = await base44.entities.SectorMarshal.update(id, {
        name: editName.trim(),
        phone: editPhone.trim(),
      });
      setSectors((prev) => prev.map((s) => s.id === id ? updated : s));
      toast.success("Sector marshal updated.");
      setEditingId(null);
    } catch {
      toast.error("Failed to update sector marshal.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setSectors((prev) => prev.filter((s) => s.id !== id));
    try {
      await base44.entities.SectorMarshal.delete(id);
      toast.success("Sector marshal removed.");
    } catch {
      toast.error("Failed to remove.");
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Names &amp; contact numbers shown to marshals in their briefing</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold px-3 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Sector
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-card border border-border rounded-2xl p-4 mb-4"
          >
            <h3 className="font-heading font-bold text-foreground text-sm mb-3">New Sector Marshal</h3>
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Sector name (e.g. Sector 1 — John Smith) *"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Contact number (e.g. 07700 000000)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl text-sm hover:bg-muted/80 transition-colors">Cancel</button>
                <button type="submit" disabled={adding} className="flex-1 bg-primary text-white font-heading font-bold py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : sectors.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No sector marshals yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sectors.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-2xl p-4">
              {editingId === s.id ? (
                <div className="space-y-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Sector name"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                  <input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Contact number"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-muted text-foreground font-heading font-bold py-2 rounded-xl text-sm hover:bg-muted/80 transition-colors flex items-center justify-center gap-1.5">
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                    <button onClick={() => handleSave(s.id)} disabled={saving} className="flex-1 bg-primary text-white font-heading font-bold py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-foreground text-sm">{s.name}</p>
                    {s.phone ? (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {s.phone}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground/60 mt-0.5">No number set</p>
                    )}
                  </div>
                  <button
                    onClick={() => startEdit(s)}
                    className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}