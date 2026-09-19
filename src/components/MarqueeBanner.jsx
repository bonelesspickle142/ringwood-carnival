import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { AlertTriangle } from "lucide-react";

export default function MarqueeBanner() {
  const [banner, setBanner] = useState(null);
  const trackRef = useRef(null);
  const wrapRef = useRef(null);

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

  useEffect(() => {
    if (!banner) return;
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track || !wrap) return;

    let pos = 0;
    let raf;
    const speed = 0.6;

    const frame = () => {
      const unit = track.scrollWidth / 2;
      if (unit > 0) {
        pos += speed;
        if (pos >= unit) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [banner]);

  if (!banner) return null;

  return (
    <div className="bg-secondary text-white overflow-hidden w-full py-2.5 flex items-center gap-3 relative z-20">
      <div className="flex-shrink-0 pl-4 flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4" />
        <span className="font-heading font-bold text-xs uppercase tracking-wide whitespace-nowrap">Update</span>
      </div>
      <div ref={wrapRef} className="overflow-hidden flex-1">
        <div ref={trackRef} className="flex will-change-transform whitespace-nowrap font-heading font-semibold text-sm">
          <span className="pr-[100vw]">{banner.message}</span>
          <span className="pr-[100vw]">{banner.message}</span>
        </div>
      </div>
    </div>
  );
}