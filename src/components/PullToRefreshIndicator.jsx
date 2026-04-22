import { Loader2, ArrowDown } from "lucide-react";

export default function PullToRefreshIndicator({ pullDistance, refreshing, threshold = 80 }) {
  const ready = pullDistance >= threshold;
  const visible = refreshing || pullDistance > 8;

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
      style={{ paddingTop: `calc(env(safe-area-inset-top) + ${refreshing ? 48 : pullDistance * 0.5}px)` }}
    >
      <div className={`flex items-center gap-2 bg-primary text-white text-xs font-heading font-semibold px-4 py-2 rounded-full shadow-lg transition-all duration-150 ${visible ? "opacity-100" : "opacity-0"}`}>
        {refreshing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowDown className={`w-4 h-4 transition-transform duration-200 ${ready ? "rotate-180" : ""}`} />
        )}
        {refreshing ? "Refreshing…" : ready ? "Release to refresh" : "Pull to refresh"}
      </div>
    </div>
  );
}