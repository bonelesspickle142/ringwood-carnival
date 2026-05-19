import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle } from "lucide-react";

export default function MarqueeBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    base44.entities.MarqueeBanner.list().then((items) => {
      const active = items.find((b) => b.active);
      setBanner(active || null);
    }).catch(() => {});

    const unsub = base44.entities.MarqueeBanner.subscribe(() => {
      base44.entities.MarqueeBanner.list().then((items) => {
        const active = items.find((b) => b.active);
        setBanner(active || null);
      }).catch(() => {});
    });
    return unsub;
  }, []);

  if (!banner) return null;

  return (
    <div className="bg-secondary text-white overflow-hidden w-full py-2.5 flex items-center gap-3 relative z-20">
      <div className="flex-shrink-0 pl-4 flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-heading font-bold text-xs uppercase tracking-wide whitespace-nowrap">Update</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="animate-marquee whitespace-nowrap font-heading font-semibold text-sm">
          {banner.message}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{banner.message}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{banner.message}
        </div>
      </div>
    </div>
  );
}