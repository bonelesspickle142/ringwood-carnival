import { motion, useMotionValue, useTransform } from "framer-motion";
import { Star } from "lucide-react";

export default function FloatVoteCard({ float, onVote, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        onVote(float);
      }
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 bg-card rounded-2xl border border-border shadow-lg overflow-hidden scale-95 opacity-60">
        {float.image_url && (
          <img src={float.image_url} alt={float.name} className="w-full h-2/3 object-cover" />
        )}
      </div>
    );
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      whileTap={{ scale: 1.02 }}
    >
      {float.image_url ? (
        <div className="relative h-2/3">
          <img src={float.image_url} alt={float.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
        </div>
      ) : (
        <div className="h-2/3 bg-primary flex items-center justify-center">
          <Star className="w-16 h-16 text-secondary" />
        </div>
      )}

      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-foreground mb-1">
          {float.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-2">
          {float.organization}
        </p>
        {float.description && (
          <p className="text-muted-foreground text-xs line-clamp-2 leading-relaxed">
            {float.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">← Skip</span>
          <span className="text-xs text-secondary font-semibold flex items-center gap-1">
            <Star className="w-3 h-3" /> Swipe right to vote →
          </span>
        </div>
      </div>
    </motion.div>
  );
}