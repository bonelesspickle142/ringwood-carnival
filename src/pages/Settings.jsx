import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Info, ExternalLink, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionState(Notification.permission);
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const handleNotificationToggle = async (checked) => {
    if (!("Notification" in window)) {
      toast.error("Push notifications are not supported on this device.");
      return;
    }

    if (checked) {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast.success("Notifications enabled! You'll be alerted for procession updates.");
        new Notification("Ringwood Carnival 🎉", {
          body: "You're all set! We'll notify you when the procession is about to begin.",
          icon: "/favicon.ico"
        });
      } else {
        setNotificationsEnabled(false);
        toast.error("Notification permission was denied. Please enable it in your browser settings.");
      }
    } else {
      setNotificationsEnabled(false);
      toast.info("Notifications turned off.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary px-6 md:px-12 pt-12 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl font-bold text-white mb-2">
          
          Settings
        </motion.h1>
        <p className="text-white/70 text-sm md:text-base">
          Options &amp; preferences
        </p>
      </div>

      <div className="px-6 md:px-12 py-8 pb-32 max-w-xl">
        {/* Notifications section */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">Notifications</h2>

        <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notificationsEnabled ? "bg-primary/10" : "bg-muted"}`}>
                {notificationsEnabled ?
                <Bell className="w-5 h-5 text-primary" /> :

                <BellOff className="w-5 h-5 text-muted-foreground" />
                }
              </div>
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">Push Notifications</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {notificationsEnabled ?
                  "You'll receive carnival updates" :
                  "Get alerts for procession times and events"}
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={permissionState === "denied"} />
            
          </div>

          {permissionState === "denied" &&
          <div className="px-5 pb-4 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-secondary" />
              <p>Notifications are blocked in your browser. To enable them, go to your browser's site settings and allow notifications for this site.</p>
            </div>
          }
        </div>

        {/* Notification types */}
        {notificationsEnabled &&
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
          
            {[
          { label: "Procession Starting Soon", desc: "15 min reminder before each procession" },
          { label: "Event Updates", desc: "Changes to the event schedule" },
          { label: "Results & Announcements", desc: "Best in Show winner and highlights" }].
          map((item, i) =>
          <div key={item.label} className={`p-4 flex items-center justify-between ${i > 0 ? "border-t border-border" : ""}`}>
                <div>
                  <p className="font-heading font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
                <Switch defaultChecked />
              </div>
          )}
          </motion.div>
        }

        {/* App info */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">About</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {[
          { label: "About Ringwood Carnival", to: "/info" },
          { label: "Meet the Team", to: "/team" },
          { label: "Donate & Support", to: "/donate" }].
          map((item, i) =>
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
            
              <span className="font-heading text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          )}
          <div className="border-t border-border p-4">
            <p className="text-xs text-muted-foreground">Ringwood Carnival App v1.0</p>
            <p className="text-xs text-muted-foreground">Ringwood Carnival App v0.1</p>
          </div>
        </div>
      </div>
    </div>);

}