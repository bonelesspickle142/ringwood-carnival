import { motion } from "framer-motion";
import { Clock, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categoryColors = {
  performance: "bg-accent text-accent-foreground",
  food: "bg-secondary text-secondary-foreground",
  craft: "bg-primary text-primary-foreground",
  music: "bg-accent text-accent-foreground",
  family: "bg-secondary text-secondary-foreground",
  stall: "bg-muted text-muted-foreground",
  other: "bg-muted text-muted-foreground",
};

const carnivalBg = ["bg-primary", "bg-secondary"];

export default function EventCard({ event, index, isFeatured }) {
  const bg = carnivalBg[index % 2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group ${bg} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:opacity-95 ${
        isFeatured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {event.image_url && (
        <div className={`relative overflow-hidden ${isFeatured ? "h-48 md:h-64" : "h-36"}`}>
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-white/20 text-white border-0">
            {event.category}
          </Badge>
        </div>
      )}

      <div className="p-4">
        {!event.image_url && (
          <Badge className="mb-2 bg-white/20 text-white border-0">
            {event.category}
          </Badge>
        )}

        <h3 className={`font-heading font-bold text-white mb-2 ${isFeatured ? "text-xl" : "text-base"}`}>
          {event.title}
        </h3>

        {event.description && (
          <p className="text-white/80 text-sm leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-white/70">
          {event.start_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {event.start_time}
              {event.end_time ? ` – ${event.end_time}` : ""}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}