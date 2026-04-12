import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Send, Bell, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const STAFF_PASSWORD = "R1ngW00d!";

const QUICK_MESSAGES = [
  { label: "Afternoon procession starting", body: "🎉 The afternoon procession is about to begin! Head to Market Place now." },
  { label: "Evening procession starting", body: "🌟 The evening procession is starting at 19:15! Get your spot on the High Street." },
  { label: "Route change", body: "⚠️ There is a minor route change today. Please follow steward instructions." },
  { label: "Event delay", body: "🕐 There is a short delay to the procession. We'll update you shortly." },
];

export default function Staff() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState("Ringwood Carnival 🎉");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === STAFF_PASSWORD) {
      setAuthenticated(true);
      toast.success("Welcome, staff member!");
    } else {
      toast.error("Incorrect password.");
    }
  };

  const sendNotification = async () => {
    if (!body.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (!("Notification" in window)) {
      toast.error("Notifications not supported in this browser.");
      return;
    }

    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        toast.error("Notification permission denied.");
        return;
      }
    }

    setSending(true);
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 600));
    new Notification(title, { body, icon: "/favicon.ico" });
    toast.success("Notification sent!");
    setBody("");
    setSending(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Staff Area</h1>
              <p className="text-muted-foreground text-sm mt-1 text-center">Enter the staff password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Enter Staff Area
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary px-6 md:px-12 pt-12 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl font-bold text-white mb-2"
        >
          Staff Area
        </motion.h1>
        <p className="text-white/70 text-sm">Send push notifications to carnival attendees</p>
      </div>

      <div className="px-6 md:px-12 py-8 pb-32 max-w-xl">
        {/* Quick messages */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">Quick Messages</h2>
        <div className="grid grid-cols-1 gap-2 mb-8">
          {QUICK_MESSAGES.map((msg) => (
            <button
              key={msg.label}
              onClick={() => setBody(msg.body)}
              className="text-left bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/50 hover:bg-muted/50 transition-all"
            >
              <p className="font-heading font-semibold text-sm text-foreground">{msg.label}</p>
              <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{msg.body}</p>
            </button>
          ))}
        </div>

        {/* Custom notification */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">Send Notification</h2>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Type your message here..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            onClick={sendNotification}
            disabled={sending || !body.trim()}
            className="w-full bg-secondary text-white font-heading font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Bell className="w-4 h-4 animate-pulse" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Notifications are delivered to users who have enabled them on their device.
        </p>
      </div>
    </div>
  );
}