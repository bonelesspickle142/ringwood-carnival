import { useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Calendar, ImageIcon, Info, Settings } from "lucide-react";
import BackHeader from "./BackHeader";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/schedule", icon: Calendar, label: "Events" },
  { path: "/gallery", icon: ImageIcon, label: "Gallery" },
  { path: "/info", icon: Info, label: "Info" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function Layout() {
  const location = useLocation();
  const scrollPositions = useRef({});

  const handleNavClick = (e, path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      e.preventDefault();
      return;
    }
    scrollPositions.current[location.pathname] = window.scrollY;
  };

  const handleAnimationComplete = () => {
    const saved = scrollPositions.current[location.pathname] ?? 0;
    window.scrollTo({ top: saved, behavior: "instant" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary z-50" />

      <BackHeader />

      <main className="pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={handleAnimationComplete}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-4 left-4 right-4 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="mx-auto max-w-md bg-primary/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 select-none ${
                    isActive
                      ? "bg-secondary text-primary scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium font-heading tracking-wide">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}