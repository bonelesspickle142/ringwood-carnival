import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Award, MapPin, BookOpen } from "lucide-react";

const links = [
  {
    to: "/schedule",
    icon: Calendar,
    label: "Events & Pop-ups",
    desc: "Full schedule",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    to: "/vote",
    icon: Award,
    label: "Best in Show",
    desc: "Vote for floats",
    color: "bg-accent text-accent-foreground",
  },
  {
    to: "/info",
    icon: MapPin,
    label: "Getting Here",
    desc: "Travel & parking",
    color: "bg-primary text-primary-foreground",
  },
  {
    to: "/info",
    icon: BookOpen,
    label: "Carnival History",
    desc: "Our heritage",
    color: "bg-muted text-foreground",
  },
];

export default function QuickLinks() {
  return (
    <div className="px-6 md:px-12 py-10">
      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
        Explore the Carnival
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                to={link.to}
                className={`${link.color} rounded-xl p-4 md:p-5 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200 block h-full`}
              >
                <Icon className="w-6 h-6" />
                <span className="font-heading font-bold text-sm md:text-base">
                  {link.label}
                </span>
                <span className="text-xs opacity-80">{link.desc}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}