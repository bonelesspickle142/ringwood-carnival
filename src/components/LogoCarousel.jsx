import { useEffect, useRef } from "react";

const SPONSORS = [
  { name: "Ringwood Town Council", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Ringwood_Town_Council_Logo.png/200px-Ringwood_Town_Council_Logo.png" },
  { name: "The Furlong", logo: "https://placehold.co/140x60/ffffff/555555?text=The+Furlong" },
  { name: "Hampshire County Council", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Hampshire_County_Council_logo.svg/200px-Hampshire_County_Council_logo.svg.png" },
  { name: "New Forest District", logo: "https://placehold.co/140x60/ffffff/555555?text=New+Forest+District" },
  { name: "St John Ambulance", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/St_John_Ambulance_logo.svg/200px-St_John_Ambulance_logo.svg.png" },
  { name: "Ringwood Lions", logo: "https://placehold.co/140x60/ffffff/555555?text=Ringwood+Lions" },
  { name: "Ringwood Rotary", logo: "https://placehold.co/140x60/ffffff/555555?text=Ringwood+Rotary" },
  { name: "Hampshire Constabulary", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Hampshire_Constabulary_Logo.png/200px-Hampshire_Constabulary_Logo.png" },
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
      <div ref={trackRef} className="flex gap-4 will-change-transform items-center">
        {ALL.map((s, i) => (
          <div
            key={i}
            className="flex-shrink-0 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 flex items-center justify-center min-w-[160px] h-20"
          >
            <img
              src={s.logo}
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
          </div>
        ))}
      </div>
    </div>
  );
}