import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    caption: "The Main Procession, High Street",
    year: "2023",
  },
  {
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    caption: "Opening Night Celebrations",
    year: "2023",
  },
  {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    caption: "Community Float Parade",
    year: "2023",
  },
  {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    caption: "Market Place Stage",
    year: "2023",
  },
  {
    url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80",
    caption: "Live Music Performances",
    year: "2022",
  },
  {
    url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    caption: "Evening Procession Lights",
    year: "2022",
  },
  {
    url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    caption: "Fireworks Finale",
    year: "2022",
  },
  {
    url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    caption: "Craft & Artisan Market",
    year: "2022",
  },
  {
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    caption: "Dance Troupes in the Procession",
    year: "2021",
  },
];

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  const prev = () => setLightbox((i) => (i > 0 ? i - 1 : GALLERY_IMAGES.length - 1));
  const next = () => setLightbox((i) => (i < GALLERY_IMAGES.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary px-6 md:px-12 pt-12 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl font-bold text-white mb-2"
        >
          Gallery
        </motion.h1>
        <p className="text-white/70 text-sm md:text-base">
          Memories from past Ringwood Carnivals
        </p>
      </div>

      {/* Masonry-style grid */}
      <div className="px-4 md:px-8 py-6 pb-32">
        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setLightbox(i)}
              className="break-inside-avoid w-full block relative overflow-hidden rounded-xl group"
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-300 flex items-end">
                <p className="text-white text-xs font-medium p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.caption}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div onClick={(e) => e.stopPropagation()} className="max-w-3xl w-full">
              <img
                src={GALLERY_IMAGES[lightbox].url}
                alt={GALLERY_IMAGES[lightbox].caption}
                className="w-full rounded-xl object-contain max-h-[75vh]"
              />
              <p className="text-white/80 text-center mt-3 text-sm">
                {GALLERY_IMAGES[lightbox].caption} — {GALLERY_IMAGES[lightbox].year}
              </p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}