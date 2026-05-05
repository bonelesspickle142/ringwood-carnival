import { useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Calendar, ImageIcon, Info, Settings } from "lucide-react";
import BackHeader from "./BackHeader";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/schedule", icon: Calendar, label: "Events" },
  { path: "/gallery", icon: ImageIcon, label: "Gallery" },
  { path: "/info", icon: Info, label: "Info" },
  { path: "/settings", icon: Settings, label: "More" },
];

// Tab paths that have their own scroll positions tracked
const TAB_PATHS = navItems.map((n) => n.path);

export default function Layout() {
  const location = useLocation();
  const scrollPositions = useRef({});

  const isRootPath = location.pathname === "/";
  // Non-root pages show a BackHeader (~48px tall + safe-area-inset-top)
  // We add top padding to main so content isn't hidden under it.
  const mainTopPadding = isRootPath
    ? "env(safe-area-inset-top)"
    : "calc(env(safe-area-inset-top) + 48px)";

  const handleNavClick = (e, path) => {
    const isActive = location.pathname === path;
    if (isActive) {
      // Tapping active tab scrolls to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      e.preventDefault();
      return;
    }
    // Save scroll position for the current page before leaving
    scrollPositions.current[location.pathname] = window.scrollY;
  };

  const handleAnimationComplete = () => {
    // After the page transition animation, restore saved scroll for this route
    const saved = scrollPositions.current[location.pathname] ?? 0;
    window.scrollTo({ top: saved, behavior: "instant" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* BackHeader: visible on all non-root pages, uses safe-area-inset-top */}
      <BackHeader />

      <main className="pb-28" style={{ paddingTop: mainTopPadding }}>
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

      {/* iOS-style tab bar — user-select:none scoped to this nav element only */}
      <div
        className="fixed bottom-4 left-4 right-4 z-[100]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav
          className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-xl"
          style={{ userSelect: "none" }}
        >
          <div className="flex items-center justify-around px-2 pt-1 pb-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="flex flex-col items-center justify-center gap-0.5"
                  style={{ minWidth: 56, minHeight: 44 }}
                >
                  <div className="flex items-center justify-center w-7 h-7">
                    <Icon
                      className={`w-6 h-6 transition-all duration-200 ${
                        isActive ? "text-secondary scale-110" : "text-muted-foreground"
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
        </nav>
      </div>
    </div>
  );
}