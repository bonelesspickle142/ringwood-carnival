import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Calendar, ImageIcon, Info, Settings, ShieldCheck } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/schedule", icon: Calendar, label: "Events" },
  { path: "/gallery", icon: ImageIcon, label: "Gallery" },
  { path: "/info", icon: Info, label: "Info" },
  { path: "/settings", icon: Settings, label: "Settings" },
  { path: "/staff", icon: ShieldCheck, label: "Staff" },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Progress Ribbon - kinetic background line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary z-50" />

      <main className="pb-24">
        <Outlet />
      </main>

      {/* Floating Island Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50">
        <div className="mx-auto max-w-md bg-primary/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
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