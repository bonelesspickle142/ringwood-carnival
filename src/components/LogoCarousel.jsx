import { useEffect, useRef } from "react";

const SPONSORS = [
  { name: "Ringwood Accident Repair", logo: "https://ss.charleymurphy.xyz/Ringwood-Accident-Repair.png", url: "https://www.ringwoodaccidentrepair.co.uk" },
  { name: "Framptons", logo: "https://ss.charleymurphy.xyz/Framptons.jpg", url: "https://framptonsringwood.co.uk" },
  { name: "Ringwood Motor Company", logo: "https://ss.charleymurphy.xyz/RMC.png", url: "https://www.ringwoodmotorco.co.uk" },
  { name: "Marilake Aero Systems LTD", logo: "https://ss.charleymurphy.xyz/Marilake.png", url: "https://www.marilake.com" },
  { name: "Quatuma Advisory LTD", logo: "https://ss.charleymurphy.xyz/Quantuma.jpg", url: "https://www.quantuma.com" },
  { name: "RoCare", logo: "https://ss.charleymurphy.xyz/rocare-logo-colour.png", url: "https://www.rocare.co.uk" },
  { name: "Events Insurance Service Limited", logo: "https://ss.charleymurphy.xyz/eis-30-colour.png", url: "https://www.events-insurance.co.uk" },
  { name: "Ellis Jones", logo: "https://ss.charleymurphy.xyz/Ellis_Jones.png", url: "https://www.ellisjones.co.uk" },
];

// Duplicate for seamless loop
const ALL = [...SPONSORS, ...SPONSORS];

export default function LogoCarousel() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let paused = false;
    const speed = 0.7;
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
  }, []);

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
          </a>
        ))}
      </div>
    </div>
  );
}