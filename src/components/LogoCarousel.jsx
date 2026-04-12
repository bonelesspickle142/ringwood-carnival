import { useEffect, useRef } from "react";

const SPONSORS = [
  { name: "Ringwood Town Council", logo: null },
  { name: "The Furlong", logo: null },
  { name: "Hampshire County Council", logo: null },
  { name: "New Forest District", logo: null },
  { name: "St John Ambulance", logo: null },
  { name: "Ringwood Lions", logo: null },
  { name: "Ringwood Rotary", logo: null },
  { name: "Hampshire Constabulary", logo: null },
];

// Duplicate for seamless loop
const ALL = [...SPONSORS, ...SPONSORS];

export default function LogoCarousel() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    const speed = 0.5;
    const half = track.scrollWidth / 2;
    const frame = () => {
      pos += speed;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4 will-change-transform">
        {ALL.map((s, i) => (
          <div
            key={i}
            className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 flex items-center justify-center min-w-[140px]"
          >
            <span className="font-heading font-semibold text-white/80 text-xs text-center leading-tight">
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}