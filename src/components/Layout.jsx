import { useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Calendar, ImageIcon, Info, Settings } from "lucide-react";
import BackHeader from "./BackHeader";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/schedule", icon: Calendar, label: "What's On" },
  { path: "/gallery", icon: ImageIcon, label: "Gallery" },
  { path: "/info", icon: Info, label: "Info" },
  { path: "/settings", icon: Settings, label: "More" },
];

const TAB_PATHS = navItems.map((n) => n.path);

// Determine which tab root the current path belongs to
function getActiveTab(pathname) {
  // Exact match first
  if (TAB_PATHS.includes(pathname)) return pathname;
  // Find the deepest tab prefix match
  return TAB_PATHS.find((t) => t !== "/" && pathname.startsWith(t)) ?? "/";
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Per-tab: remember the last visited path within each tab
  const tabHistory = useRef(
    Object.fromEntries(TAB_PATHS.map((p) => [p, p]))
  );

  // Per-tab: remember scroll position
  const scrollPositions = useRef({});

  const activeTab = getActiveTab(location.pathname);

  // Keep tabHistory up to date with the current path
  tabHistory.current[activeTab] = location.pathname;

  const isRootPath = location.pathname === "/";

  // main top padding: home has only safe-area-inset-top; others also account for the 48px BackHeader
  const mainTopPadding = isRootPath
    ? "env(safe-area-inset-top)"
    : "calc(env(safe-area-inset-top) + 48px)";

  const handleNavClick = (e, tabPath) => {
    const isActiveTab = activeTab === tabPath;

    if (isActiveTab) {
      if (location.pathname !== tabPath) {
        // On this tab's "subtree" but not the root — navigate to root
        e.preventDefault();
        navigate(tabPath);
      } else {
        // Already at the tab root — scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
        e.preventDefault();
      }
      return;
    }

    // Save current scroll position before leaving
    scrollPositions.current[location.pathname] = window.scrollY;

    // Navigate to the last known path within the destination tab
    const destination = tabHistory.current[tabPath] ?? tabPath;
    if (destination !== tabPath) {
      e.preventDefault();
      navigate(destination);
    }
    // If destination === tabPath, let the Link handle it normally
  };

  const handleAnimationComplete = () => {
    const saved = scrollPositions.current[location.pathname] ?? 0;
    window.scrollTo({ top: saved, behavior: "instant" });
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* BackHeader: visible on all non-root pages, respects safe-area-inset-top */}
      <BackHeader />

      <main className="pb-28" style={{ paddingTop: mainTopPadding }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          onAnimationComplete={handleAnimationComplete}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* iOS-style tab bar — user-select:none scoped to nav only */}
      <div
        className="fixed bottom-4 left-4 right-4 z-[1000]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav
          className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-xl"
          style={{ userSelect: "none" }}
        >
          <div className="flex items-center justify-around px-2 pt-1 pb-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.path;
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