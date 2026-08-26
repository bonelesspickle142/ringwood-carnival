import { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function LogoCarousel() {
  const trackRef = useRef(null);
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await base44.entities.Sponsor.list("sort_order", 100);
        setSponsors(data);
      } catch { /* empty */ }
    };
    load();
    const unsubscribe = base44.entities.Sponsor.subscribe(() => load());
    return unsubscribe;
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || sponsors.length === 0) return;
    let pos = 0;
    let paused = false;
    const speed = 1.6;
    const half = track.scrollWidth / 2;
    const frame = () => {
      if (!paused) {
        pos += speed;
        if (pos >= half) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);

    const parent = track.parentElement;
    const setPaused = (v) => { paused = v; };
    const onEnter = () => setPaused(true);
    const onLeave = () => setPaused(false);
    if (parent) {
      parent.addEventListener("mouseenter", onEnter);
      parent.addEventListener("mouseleave", onLeave);
      parent.addEventListener("touchstart", onEnter);
      parent.addEventListener("touchend", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (parent) {
        parent.removeEventListener("mouseenter", onEnter);
        parent.removeEventListener("mouseleave", onLeave);
        parent.removeEventListener("touchstart", onEnter);
        parent.removeEventListener("touchend", onLeave);
      }
    };
  }, [sponsors]);

  if (sponsors.length === 0) return null;

  const ALL = [...sponsors, ...sponsors];

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4 will-change-transform items-center">
        {ALL.map((s, i) => (
          <a
            key={i}
            href={s.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 flex items-center justify-center min-w-[160px] h-20 hover:bg-white/25 transition-colors cursor-pointer"
          >
            <img
              src={s.image_url}
              alt={s.name}
              className="max-h-12 max-w-[140px] object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="font-heading font-semibold text-white/80 text-xs text-center leading-tight hidden">
              {s.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}