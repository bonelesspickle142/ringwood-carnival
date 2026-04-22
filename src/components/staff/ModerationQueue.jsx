import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Trash2, Loader2, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ModerationQueue() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPhotos = async () => {
    const data = await base44.entities.CarnivalPhoto.filter({ is_approved: false }, "-created_date", 100);
    setPhotos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
    const unsubscribe = base44.entities.CarnivalPhoto.subscribe((event) => {
      if (event.type === "create") {
        if (!event.data.is_approved) setPhotos((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setPhotos((prev) => prev.filter((p) => p.id !== event.id));
      } else if (event.type === "delete") {
        setPhotos((prev) => prev.filter((p) => p.id !== event.id));
      }
    });
    return unsubscribe;
  }, []);

  const handleApprove = async (photo) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    await base44.entities.CarnivalPhoto.update(photo.id, { is_approved: true });
    toast.success("Photo approved!");
  };

  const handleDelete = async (photo) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    await base44.entities.CarnivalPhoto.delete(photo.id);
    toast.success("Photo deleted.");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-10 bg-card rounded-2xl border border-border">
        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
        <p className="font-heading font-bold text-foreground">All clear!</p>
        <p className="text-muted-foreground text-sm mt-1">No photos pending moderation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{photos.length} photo{photos.length !== 1 ? "s" : ""} awaiting approval</p>
      <AnimatePresence>
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
          >
            <div className="flex gap-3 p-3 items-start">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                {photo.image_url ? (
                  <img src={photo.image_url} alt="Pending" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {photo.caption && <p className="text-sm text-foreground font-heading font-semibold line-clamp-1">{photo.caption}</p>}
                {photo.uploader_name && <p className="text-xs text-muted-foreground mt-0.5">By {photo.uploader_name}</p>}
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(photo.created_date).toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleApprove(photo)}
                    className="flex items-center gap-1.5 bg-green-500 text-white font-heading font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleDelete(photo)}
                    className="flex items-center gap-1.5 bg-destructive text-white font-heading font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}