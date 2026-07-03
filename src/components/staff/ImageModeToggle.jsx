import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Crop, Expand, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Admin toggle for the global event image display mode.
// Uses a single SiteSetting record; creates it if none exists yet.
export default function ImageModeToggle() {
  const [mode, setMode] = useState("crop");
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const settings = await base44.entities.SiteSetting.list();
        if (!cancelled) {
          if (settings.length > 0) {
            setMode(settings[0].image_display_mode || "crop");
            setSettingId(settings[0].id);
          }
        }
      } catch {
        // ignore
      }
      if (!cancelled) setLoading(false);
    };
    load();
  }, []);

  const toggle = async () => {
    const newMode = mode === "crop" ? "full" : "crop";
    setMode(newMode);
    setSaving(true);
    try {
      if (settingId) {
        await base44.entities.SiteSetting.update(settingId, { image_display_mode: newMode });
      } else {
        const created = await base44.entities.SiteSetting.create({ image_display_mode: newMode });
        setSettingId(created.id);
      }
      toast.success(`Images now show ${newMode === "full" ? "full (uncropped)" : "cropped perspective"} for everyone.`);
    } catch {
      setMode(mode === "crop" ? "full" : "crop"); // revert
      toast.error("Could not update setting.");
    }
    setSaving(false);
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  }

  const isFull = mode === "full";

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-heading font-bold transition-colors disabled:opacity-50 ${
        isFull
          ? "bg-secondary text-white hover:bg-secondary/90"
          : "bg-muted text-foreground hover:bg-muted/80"
      }`}
      title="Toggle global image display mode for all event cards"
    >
      {isFull ? <Expand className="w-3.5 h-3.5" /> : <Crop className="w-3.5 h-3.5" />}
      {isFull ? "Full Image" : "Cropped"}
    </button>
  );
}