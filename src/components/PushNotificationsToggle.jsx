import { useState } from "react";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

function getPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export default function PushNotificationsToggle() {
  const [permission, setPermission] = useState(getPermission);

  const isGranted = permission === "granted";
  const isDenied = permission === "denied";
  const isUnsupported = permission === "unsupported";

  let helper = "Tap to enable live updates & announcements";
  if (isGranted) helper = "Enabled — you'll receive live updates & announcements";
  if (isDenied) helper = "Blocked — enable notifications in your device settings";
  if (isUnsupported) helper = "Notifications aren't supported on this device";

  const handleToggle = async (checked) => {
    if (isUnsupported || isDenied) return;
    if (checked) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "denied") {
        toast("Notifications were blocked. Enable them in your device settings.");
      }
    } else {
      toast("Disable notifications in your device settings to turn them off.");
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6 flex items-center gap-3 p-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/15 flex-shrink-0">
        <Bell className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-foreground text-sm">Push Notifications</p>
        <p className="text-muted-foreground text-xs mt-0.5">{helper}</p>
      </div>
      <Switch
        checked={isGranted}
        onCheckedChange={handleToggle}
        disabled={isUnsupported || isDenied}
        aria-label="Toggle push notifications"
      />
    </div>
  );
}