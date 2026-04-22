import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, Loader2, Upload, CheckCircle2, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Gallery() {
  const isStaff = !!document.cookie.split("; ").find(r => r.startsWith("staffAuth="));
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [uploaderName, setUploaderName] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const loadPhotos = async () => {
    const data = await base44.entities.CarnivalPhoto.filter({ is_approved: true }, "-created_date", 100);
    setPhotos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPhotos();
    const unsubscribe = base44.entities.CarnivalPhoto.subscribe((event) => {
      if (event.type === "create" && event.data?.is_approved) {
        setPhotos((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        if (event.data?.is_approved) {
          setPhotos((prev) => prev.find((p) => p.id === event.id) ? prev : [event.data, ...prev]);
        } else {
          setPhotos((prev) => prev.filter((p) => p.id !== event.id));
        }
      } else if (event.type === "delete") {
        setPhotos((prev) => prev.filter((p) => p.id !== event.id));
      }
    });
    return unsubscribe;
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setShowUploadForm(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
      await base44.entities.CarnivalPhoto.create({
        image_url: file_url,
        caption: caption.trim() || undefined,
        uploader_name: uploaderName.trim() || undefined,
        is_approved: false,
      });
      setShowUploadForm(false);
      setShowSuccess(true);
      setSelectedFile(null);
      setPreview(null);
      setCaption("");
      setUploaderName("");
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleDelete = async (photoId, e) => {
    e.stopPropagation();
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    await base44.entities.CarnivalPhoto.delete(photoId);
  };

  const prev = () => setLightbox((i) => (i > 0 ? i - 1 : photos.length - 1));
  const next = () => setLightbox((i) => (i < photos.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary px-6 md:px-12 pt-12 pb-10 flex items-end justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl md:text-5xl font-bold text-white mb-2"
          >
            Gallery
          </motion.h1>
          <p className="text-white/70 text-sm md:text-base">Community carnival photos</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-secondary text-white font-heading font-bold px-4 py-3 rounded-xl hover:bg-secondary/90 transition-all shadow-lg"
        >
          <Camera className="w-4 h-4" />
          Upload Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Upload Form Modal */}
      <AnimatePresence>
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-end md:items-center justify-center p-4">
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              className="bg-card rounded-2xl border border-border p-5 w-full max-w-sm shadow-2xl mb-28"
            >
              <h3 className="font-heading font-bold text-lg text-foreground mb-4">Submit your photo</h3>
              {preview && (
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl mb-4" />
              )}
              <div className="space-y-3 mb-4">
                <input
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption (optional)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground mb-4">Your photo will be reviewed by staff before appearing in the gallery.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowUploadForm(false); setSelectedFile(null); setPreview(null); }}
                  className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-secondary text-white font-heading font-bold py-2.5 rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Banner */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-4 right-4 z-50 max-w-md mx-auto bg-green-600 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-heading font-bold text-sm">Photo Submitted!</p>
              <p className="text-white/80 text-xs mt-0.5">It will appear in the gallery once approved by staff.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="px-4 md:px-8 py-6 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-lg mb-2">No photos yet</p>
            <p className="text-muted-foreground/60 text-sm">Be the first to share a carnival memory!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="break-inside-avoid w-full block relative overflow-hidden rounded-xl group"
              >
                <button onClick={() => setLightbox(i)} className="w-full block">
                  <img
                    src={photo.image_url}
                    alt={photo.caption || "Carnival photo"}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-300 flex items-end">
                    {photo.caption && (
                      <p className="text-white text-xs font-medium p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </button>
                {isStaff && (
                  <button
                    onClick={(e) => handleDelete(photo.id, e)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-destructive text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div onClick={(e) => e.stopPropagation()} className="max-w-3xl w-full">
              <img src={photos[lightbox].image_url} alt={photos[lightbox].caption} className="w-full rounded-xl object-contain max-h-[75vh]" />
              {(photos[lightbox].caption || photos[lightbox].uploader_name) && (
                <p className="text-white/80 text-center mt-3 text-sm">
                  {photos[lightbox].caption}{photos[lightbox].uploader_name ? ` — ${photos[lightbox].uploader_name}` : ""}
                </p>
              )}
            </div>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}