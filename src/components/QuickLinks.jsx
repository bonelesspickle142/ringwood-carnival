import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, ImageIcon, Store, Map } from "lucide-react";

const links = [
{
  to: "/schedule",
  icon: Calendar,
  label: "Events & Pop-ups",
  desc: "Full schedule",
},
{
  to: "/vote",
  icon: Store,
  label: "Shop Window Vote",
  desc: "Vote for your favourite",
},
{
  to: "/gallery",
  icon: ImageIcon,
  label: "Gallery",
  desc: "Photos & memories",
},
{
  to: "/map",
  icon: Map,
  label: "Carnival Map",
  desc: "Find your way around",
},
{
  to: "/info",
  icon: MapPin,
  label: "Getting Here",
  desc: "Travel & parking",
}];


export default function QuickLinks() {
  return (
    <div className="px-4 md:px-12 py-6">
      <h2
        className="text-xl font-bold text-foreground mb-4 px-1"
        style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
        
        Explore the Carnival
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {links.map((link, i) => {
          const Icon = link.icon;
          const bg = i % 2 === 0 ? "bg-primary" : "bg-secondary";
          return (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
              
              <Link
                to={link.to}
                className={`rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.97] transition-transform duration-150 block h-full shadow-sm border border-white/10 ${bg}`}>
                
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white leading-tight">{link.label}</p>
                  <p className="text-xs text-white/70 mt-0.5">{link.desc}</p>
                </div>
              </Link>
            </motion.div>);

        })}
      </div>
    </div>);

}