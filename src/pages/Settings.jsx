import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ChevronRight, Trash2, Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import PushNotificationsToggle from "@/components/PushNotificationsToggle";
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
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const logoTapTimer = useRef(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleDark = (checked) => {
    setIsDark(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

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
        {/* Push notifications */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">Stay Updated</h2>
        <PushNotificationsToggle />

        {/* Appearance */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3 mt-8">Appearance</h2>
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-4 h-4 text-foreground" /> : <Sun className="w-4 h-4 text-foreground" />}
            <span className="font-heading text-sm font-medium text-foreground">Dark Mode</span>
          </div>
          <Switch checked={isDark} onCheckedChange={toggleDark} />
        </div>

        {/* App info */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">About</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {[
          { label: "About Ringwood Carnival", to: "/info" },
          { label: "Meet the Team", to: "/team" },
          { label: "Donate & Support", to: "/donate" },
          { label: "Staff Area", to: "/staff" },
          { label: "Privacy Policy", to: "/privacy" },
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