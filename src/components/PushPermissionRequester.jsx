import { useEffect } from "react";

const STORAGE_KEY = "push_permission_asked";

export default function PushPermissionRequester() {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    localStorage.setItem(STORAGE_KEY, "1");
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return null;
}