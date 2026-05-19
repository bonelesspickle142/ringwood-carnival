import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Megaphone, Save, Trash2, Plus, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const items = await base44.entities.MarqueeBanner.list();
    setBanners(items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!newMessage.trim()) return;
    setSaving(true);
    await base44.entities.MarqueeBanner.create({ message: newMessage.trim(), active: true });
    setNewMessage("");
    await load();
    toast.success("Banner created and activated.");
    setSaving(false);
  };

  const handleToggle = async (banner) => {
    await base44.entities.MarqueeBanner.update(banner.id, { active: !banner.active });
    await load();
    toast.success(banner.active ? "Banner hidden." : "Banner activated.");
  };

  const handleDelete = async (id) => {
    await base44.entities.MarqueeBanner.delete(id);
    await load();
    toast.success("Banner deleted.");
  };

  const handleUpdate = async (banner, newMsg) => {
    await base44.entities.MarqueeBanner.update(banner.id, { message: newMsg });
    await load();
    toast.success("Banner updated.");
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-foreground text-lg mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-secondary" /> Marquee Banner
      </h2>

      {/* Create new */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-4 space-y-3">
        <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide">New Banner Message</label>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={2}
          placeholder="e.g. ⚠️ The procession is delayed by 15 minutes. Thank you for your patience."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
        <button
          onClick={handleCreate}
          disabled={saving || !newMessage.trim()}
          className="flex items-center gap-2 bg-secondary text-white font-heading font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Create & Activate
        </button>
      </div>

      {/* Existing banners */}
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : banners.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No banners yet.</p>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <BannerRow key={b.id} banner={b} onToggle={handleToggle} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerRow({ banner, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState(banner.message);

  return (
    <div className={`bg-card border rounded-2xl p-4 space-y-2 ${banner.active ? "border-secondary/40 bg-secondary/5" : "border-border"}`}>
      {editing ? (
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      ) : (
        <p className="text-sm text-foreground font-heading">{banner.message}</p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-heading font-bold px-2 py-0.5 rounded-full ${banner.active ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"}`}>
          {banner.active ? "Live" : "Hidden"}
        </span>
        <button onClick={() => onToggle(banner)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-heading font-semibold">
          {banner.active ? <ToggleRight className="w-4 h-4 text-secondary" /> : <ToggleLeft className="w-4 h-4" />}
          {banner.active ? "Deactivate" : "Activate"}
        </button>
        {editing ? (
          <button onClick={() => { onUpdate(banner, msg); setEditing(false); }} className="text-xs text-primary font-heading font-semibold hover:underline">Save</button>
        ) : (
          <button onClick={() => setEditing(true)} className="text-xs text-primary font-heading font-semibold hover:underline">Edit</button>
        )}
        <button onClick={() => onDelete(banner.id)} className="text-xs text-destructive font-heading font-semibold hover:underline ml-auto">
          <Trash2 className="w-3.5 h-3.5 inline mr-0.5" />Delete
        </button>
      </div>
    </div>
  );
}