import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Bell, BellOff, Info, ChevronRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState("default");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const logoTapTimer = useRef(null);

  const handleLogoTap = () => {
    const newCount = logoTaps + 1;
    setLogoTaps(newCount);
    clearTimeout(logoTapTimer.current);
    if (newCount >= 5) {
      setLogoTaps(0);
      window.location.href = "/committee";
    } else {
      logoTapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
    }
  };

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
        // Show test notification via service worker if available, else fallback
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready.catch(() => null);
          if (reg) {
            reg.showNotification("Ringwood Carnival 🎉", {
              body: "You're all set! We'll notify you when the procession is about to begin.",
              icon: "/favicon.ico",
              badge: "/favicon.ico",
            });
          } else {
            new Notification("Ringwood Carnival 🎉", {
              body: "You're all set! We'll notify you when the procession is about to begin.",
              icon: "/favicon.ico",
            });
          }
        } else {
          new Notification("Ringwood Carnival 🎉", {
            body: "You're all set! We'll notify you when the procession is about to begin.",
            icon: "/favicon.ico",
          });
        }
      } else {
        setNotificationsEnabled(false);
        toast.error("Notification permission was denied. Please enable it in your settings.");
      }
    } else {
      setNotificationsEnabled(false);
      toast.info("Notifications turned off.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          Settings
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-0.5">Options &amp; preferences</p>
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
          { label: "Donate & Support", to: "/donate" },
          { label: "Staff Area", to: "/staff" },
        ].
          map((item, i) =>
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${i > 0 ? "border-t border-border" : ""}`}>
            
              <span className="font-heading text-sm font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          )}
          <div className="border-t border-border p-4 flex items-center gap-3">
            <button onClick={handleLogoTap} className="w-6 h-6 rounded-md overflow-hidden opacity-40 hover:opacity-70 transition-opacity flex-shrink-0" aria-hidden="true">
              <img src="https://ss.charleymurphy.xyz/RWC%20Logo.jpg" alt="" className="w-full h-full object-cover" />
            </button>
            <p className="text-xs text-muted-foreground">Ringwood Carnival App v1.0</p>
          </div>
        </div>

        {/* Delete Account */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3 mt-8">Account</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/5 transition-colors">
                <Trash2 className="w-4 h-4" />
                <span className="font-heading text-sm font-medium">Delete Account</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={async () => {
                    try {
                      await base44.functions.invoke("deleteAccount", {});
                      base44.auth.logout("/");
                    } catch {
                      toast.error("Failed to delete account. Please try again.");
                    }
                  }}
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>);

}