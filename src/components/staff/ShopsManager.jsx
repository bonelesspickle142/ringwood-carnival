import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Save, Store, Loader2, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const EMPTY_SHOP = { name: "", description: "", image_url: "" };

function ShopForm({ shop, onSave, onCancel }) {
  const [form, setForm] = useState(shop || EMPTY_SHOP);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("image_url", file_url);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Shop name is required."); return; }
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
      <h3 className="font-heading font-bold text-foreground mb-4">{shop?.id ? "Edit Shop" : "Add Shop Entry"}</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Shop Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. The Flower Basket"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Brief description of the window display..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Window Photo</label>
          {form.image_url && (
            <img src={form.image_url} alt="Preview" className="w-full h-36 object-cover rounded-xl mb-2" />
          )}
          <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground cursor-pointer hover:bg-muted/70 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading…" : form.image_url ? "Replace photo" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onCancel} className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button type="submit" disabled={saving} className="flex-1 bg-primary text-white font-heading font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default function ShopsManager() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  useEffect(() => {
    base44.entities.ShopEntry.list("-vote_count", 100).then((data) => {
      setShops(data);
      setLoading(false);
    });
    const unsub = base44.entities.ShopEntry.subscribe((event) => {
      if (event.type === "create") setShops((prev) => [...prev, event.data]);
      else if (event.type === "update") setShops((prev) => prev.map((s) => s.id === event.id ? { ...s, ...event.data } : s));
      else if (event.type === "delete") setShops((prev) => prev.filter((s) => s.id !== event.id));
    });
    return unsub;
  }, []);

  const handleSave = async (form) => {
    if (editingShop?.id) {
      setShops((prev) => prev.map((s) => s.id === editingShop.id ? { ...s, ...form } : s));
      setShowForm(false); setEditingShop(null);
      await base44.entities.ShopEntry.update(editingShop.id, form);
      toast.success("Shop updated.");
    } else {
      const created = await base44.entities.ShopEntry.create({ ...form, vote_count: 0 });
      setShops((prev) => [...prev, created]);
      setShowForm(false); setEditingShop(null);
      toast.success("Shop added.");
    }
  };

  const handleDelete = async (id) => {
    setShops((prev) => prev.filter((s) => s.id !== id));
    await base44.entities.ShopEntry.delete(id);
    toast.success("Shop removed.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-foreground text-lg flex items-center gap-2">
          <Store className="w-5 h-5 text-primary" /> Shop Entries
        </h2>
        {!showForm && (
          <button
            onClick={() => { setEditingShop(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-white font-heading font-bold px-4 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Shop
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ShopForm
            shop={editingShop}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingShop(null); }}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : shops.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No shop entries yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {shops.map((shop) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-start overflow-hidden"
              >
                {shop.image_url && (
                  <img src={shop.image_url} alt={shop.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-heading font-bold text-foreground text-sm">{shop.name}</p>
                      {shop.description && <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{shop.description}</p>}
                      <p className="text-xs text-primary font-heading font-semibold mt-1">{shop.vote_count || 0} votes</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingShop(shop); setShowForm(true); }} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(shop.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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