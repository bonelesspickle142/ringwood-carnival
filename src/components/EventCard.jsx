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

export default function EventCard({ event, index, isFeatured }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group bg-card rounded-xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 ${
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
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
          <Badge className={`absolute top-3 left-3 ${categoryColors[event.category] || categoryColors.other}`}>
            {event.category}
          </Badge>
        </div>
      )}

      <div className="p-4">
        {!event.image_url && (
          <Badge className={`mb-2 ${categoryColors[event.category] || categoryColors.other}`}>
            {event.category}
          </Badge>
        )}

        <h3 className={`font-heading font-bold text-foreground mb-2 ${isFeatured ? "text-xl" : "text-base"}`}>
          {event.title}
        </h3>

        {event.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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