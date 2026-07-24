import { motion } from "framer-motion";
import { Clock, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  } catch {
    return null;
  }
}

const carnivalBg = ["bg-primary", "bg-secondary"];

export default function EventCard({ event, index, isFeatured }) {
  const bg = carnivalBg[index % 2];
  const showFull = event.image_display_mode === "full";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group ${bg} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:opacity-95 ${
      isFeatured ? "md:col-span-2 md:row-span-2" : ""}`
      }>
      
      <div className="p-4">

        {event.tagline &&
        <p className={`font-heading font-semibold text-white/90 mb-3 uppercase text-center no-underline not-italic ${isFeatured ? "text-base" : "text-sm"}`}>
          {event.tagline}
        </p>
        }

        {event.image_url &&
        <div className={`relative overflow-hidden rounded-lg mb-3 ${isFeatured ? "h-80 md:h-80" : "h-64"}`}>
            <img
            src={event.image_url}
            alt={event.title}
            className={`w-full h-full transition-transform duration-500 ${showFull ? "object-contain" : "object-cover group-hover:scale-105"}`}
            style={{ objectPosition: event.image_position || "center center" }} />
          
          </div>
        }

        <h3 className={`font-heading font-bold text-white mb-3 hidden ${isFeatured ? "text-xl" : "text-base"}`}>
          {event.title}
        </h3>

        {event.description &&
        <div className="text-white/80 text-sm leading-relaxed mb-3">
            <ReactMarkdown
            components={{
              a: ({ node, ...props }) =>
              <a {...props} target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-white/90" />

            }}>
            
              {event.description}
            </ReactMarkdown>
          </div>
        }

        <div className="flex flex-wrap gap-3 text-xs text-white/70">
          {formatDate(event.date) &&
          <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(event.date)}
            </span>
          }
          {event.start_time &&
          <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {event.start_time}
              {event.end_time ? ` – ${event.end_time}` : ""}
            </span>
          }
          {event.location &&
          <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          }
        </div>
      </div>
    </motion.div>);

}