import { useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Calendar, ImageIcon, Info, Settings } from "lucide-react";
import { useState } from "react";
// BackHeader removed — iOS tab bar handles navigation

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/schedule", icon: Calendar, label: "Events" },
  { path: "/gallery", icon: ImageIcon, label: "Gallery" },
  { path: "/info", icon: Info, label: "Info" },
  { path: "/settings", icon: Settings, label: "More" },
];

export default function Layout() {
  const location = useLocation();
  const scrollPositions = useRef({});
  const [logoTaps, setLogoTaps] = useState(0);
  const logoTapTimer = useRef(null);

  const handleNavClick = (e, path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      e.preventDefault();
      return;
    }
    scrollPositions.current[location.pathname] = window.scrollY;
  };

  const handleLogoTap = () => {
    const newCount = logoTaps + 1;
    setLogoTaps(newCount);
    clearTimeout(logoTapTimer.current);
    if (newCount >= 5) {
      setLogoTaps(0);
      window.location.href = "/committee";
    } else {
      logoTapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
    }
  };

  const handleAnimationComplete = () => {
    const saved = scrollPositions.current[location.pathname] ?? 0;
    window.scrollTo({ top: saved, behavior: "instant" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      <main className="pb-28" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            onAnimationComplete={handleAnimationComplete}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* iOS-style tab bar */}
      <div
        className="fixed bottom-4 left-4 right-4 z-[100]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-xl">
          <div className="relative flex items-center justify-around px-2 pt-2 pb-2">
            {/* Carnival logo — 5 taps navigates to /committee (committee only) */}
            <button
              onClick={handleLogoTap}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg overflow-hidden opacity-40 hover:opacity-60 transition-opacity"
              aria-hidden="true"
            >
              <img src="https://ss.charleymurphy.xyz/RWC%20Logo.jpg" alt="" className="w-full h-full object-cover" />
            </button>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[56px] select-none"
                >
                  <div className="relative flex items-center justify-center w-7 h-7">
                    <Icon
                      className={`w-6 h-6 transition-all duration-200 ${
                        isActive
                          ? "text-secondary scale-110"
                          : "text-muted-foreground"
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                      isActive ? "text-secondary" : "text-muted-foreground"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}