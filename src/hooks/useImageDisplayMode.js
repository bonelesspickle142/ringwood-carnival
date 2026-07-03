import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

// Fetches the global image display mode setting once and subscribes to changes.
// Returns "crop" as default until the setting loads.
export function useImageDisplayMode() {
  const [mode, setMode] = useState("crop");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const settings = await base44.entities.SiteSetting.list();
        if (!cancelled && settings.length > 0) {
          setMode(settings[0].image_display_mode || "crop");
        }
      } catch {
        // Default to crop on error
      }
    };
    load();
    const unsubscribe = base44.entities.SiteSetting.subscribe((event) => {
      if (event.type === "create" || event.type === "update") {
        setMode(event.data.image_display_mode || "crop");
      } else if (event.type === "delete") {
        setMode("crop");
      }
    });
    return () => { cancelled = true; unsubscribe(); };
  }, []);

  return mode;
}