import { useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Collects every image_url used across the app's entities on load and
// pre-fetches them into the browser cache so they render instantly when
// the user scrolls to them. Runs once per authenticated session.
export default function ImagePreloader() {
  useEffect(() => {
    let cancelled = false;

    const preload = (url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    };

    const run = async () => {
      try {
        const [events, bands, sponsors] = await Promise.all([
          base44.entities.Event.list("-updated_date", 500).catch(() => []),
          base44.entities.ProcessionBand.list("sort_order", 500).catch(() => []),
          base44.entities.Sponsor.list("sort_order", 500).catch(() => []),
        ]);

        if (cancelled) return;

        const urls = new Set();
        events.forEach((e) => e.image_url && urls.add(e.image_url));
        bands.forEach((b) => b.image_url && urls.add(b.image_url));
        sponsors.forEach((s) => s.image_url && urls.add(s.image_url));

        urls.forEach(preload);
      } catch {
        // Best-effort; ignore failures silently
      }
    };

    run();
    return () => { cancelled = true; };
  }, []);

  return null;
}