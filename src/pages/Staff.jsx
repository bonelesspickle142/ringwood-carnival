import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Send, Bell, Eye, EyeOff, AlertTriangle, User, ChevronDown, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import EventsManager from "@/components/staff/EventsManager";

const STAFF_PASSWORD = "R1ngW00d!";
const VALID_NAMES = ["Ben", "Charley", "Daniel", "Stewart", "Chris", "Dan", "Control1", "Control2"];

async function logAction(name, action) {
  try {
    await base44.functions.invoke("logStaffAction", { name, action });
  } catch (e) {
    console.error("Failed to log action:", e);
  }
}

const QUICK_MESSAGES = [
  { label: "Afternoon procession starting", body: "🎉 The afternoon procession is about to begin! Head to your spot now." },
  { label: "Evening procession starting", body: "🌟 The evening procession is starting at 19:15! Get your spot on the High Street." },
  { label: "Event delay", body: "🕐 There is a short delay to the procession. We'll update you shortly." },
];

const ROAD_CLOSURE_MESSAGES = [
  { label: "30 mins - Roads Closing", body: "🚧 The Road Closures will be CLOSED in 30 minutes" },
  { label: "10 mins - Roads Closing", body: "🚧 The Road Closures will be CLOSED in 10 minutes" },
  { label: "5 mins - Roads Closing", body: "🚧 The Road Closures will be CLOSED in 5 minutes" },
  { label: "Roads Closed", body: "🚧 The Roads are now closed. No Vehicle movement will be allowed until the roads reopen." },
  { label: "Roads reopening", body: "✅ Roads are reopening. Thank you for your patience during the procession." },
  { label: "Parking full - Short Stay, The Furlong", body: "🅿️ The Furlong Short Stay Car Park is now FULL. Please seek parking elsewhere." },
  { label: "Parking full - Long Stay, The Furlong", body: "🅿️ The Furlong Car Park is now FULL. Please seek parking elsewhere." },
  { label: "All roads clear", body: "✅ All road closures have now been lifted. Normal traffic can resume." },
];

function NotificationSection({ title, icon, messages, notifTitle, logPrefix, currentName, onConfirm, onLog, borderColor, mb }) {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [lastSent, setLastSent] = useState(null);

  const handleSend = () => {
    if (!selected) return;
    onLog(currentName, `${logPrefix}: ${selected.label}`);
    onConfirm(notifTitle, selected.body);
    setLastSent(selected.label);
    setSelected(null);
    setOpen(false);
  };

  return (
    <div className={mb}>
      <h2 className="font-heading font-bold text-foreground text-lg mb-3 flex items-center gap-2">
        {icon} {title}
      </h2>
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-background text-sm hover:bg-muted/50 transition-all"
          >
            <span className={selected ? "text-foreground font-heading font-semibold" : "text-muted-foreground"}>
              {selected ? selected.label : `Select a message…`}
            </span>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              {messages.map((msg) => (
                <button
                  key={msg.label}
                  onClick={() => { setSelected(msg); setOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0"
                >
                  <p className="font-heading font-semibold text-sm text-foreground">{msg.label}</p>
                  <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{msg.body}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        {selected && (
          <div className="bg-muted rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1">{notifTitle}</p>
            <p className="text-sm text-foreground">{selected.body}</p>
          </div>
        )}

        {lastSent && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
            <span className="text-green-600">✅</span>
            <span className="font-heading font-semibold">Sent:</span>
            <span>{lastSent}</span>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!selected}
          className={`w-full flex items-center justify-center gap-2 font-heading font-bold py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-secondary text-white hover:bg-secondary/90`}
        >
          <Send className="w-4 h-4" /> Send Notification
        </button>
      </div>
    </div>
  );
}

export default function Staff() {
  const [authenticated, setAuthenticated] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");
  const [title, setTitle] = useState("Ringwood Carnival 🎉");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmPending, setConfirmPending] = useState(null); // { title, body }
  const [sentBanner, setSentBanner] = useState(null); // { title, body }

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedName = staffName.trim();
    if (!VALID_NAMES.includes(trimmedName)) {
      toast.error("Name not recognised.");
      return;
    }
    if (password === STAFF_PASSWORD) {
      setAuthenticated(true);
      logAction(trimmedName, "Logged in to staff area");
      toast.success(`Welcome, ${trimmedName}!`);
    } else {
      toast.error("Incorrect password.");
    }
  };

  const requestConfirm = (notifTitle, notifBody) => {
    if (!notifBody.trim()) { toast.error("Please enter a message."); return; }
    setConfirmPending({ title: notifTitle, body: notifBody });
  };

  const currentName = staffName.trim();

  const confirmSend = async () => {
    const pendingSnapshot = confirmPending;
    setConfirmPending(null);
    setSending(true);

    // Try browser push notification if permission available
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(pendingSnapshot.title, { body: pendingSnapshot.body, icon: "/favicon.ico" });
    }

    logAction(currentName, `Sent notification — "${pendingSnapshot.title}": ${pendingSnapshot.body}`);
    setBody("");
    setSending(false);
    setSentBanner(pendingSnapshot);
    setTimeout(() => setSentBanner(null), 5000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground">Staff Area</h1>
              <p className="text-muted-foreground text-sm mt-1 text-center">Enter your name and password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  autoFocus
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
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
      <div className="bg-primary px-6 md:px-12 pt-12 pb-6">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-3xl md:text-5xl font-bold text-white mb-2">
          Staff Area
        </motion.h1>
        <p className="text-white/70 text-sm mb-5">Logged in as <strong>{currentName}</strong></p>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/10 rounded-xl p-1 max-w-xs">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 py-2 px-3 rounded-lg font-heading font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${activeTab === "notifications" ? "bg-white text-primary" : "text-white/80 hover:text-white"}`}
          >
            <Bell className="w-4 h-4" /> Notify
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-2 px-3 rounded-lg font-heading font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${activeTab === "events" ? "bg-white text-primary" : "text-white/80 hover:text-white"}`}
          >
            <Calendar className="w-4 h-4" /> Events
          </button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8 pb-32 max-w-xl">

        {activeTab === "events" && <EventsManager />}

        {activeTab === "notifications" && <>
        {/* Road Closures */}
        <NotificationSection
          title="Road Closures"
          icon={<AlertTriangle className="w-5 h-5 text-secondary" />}
          messages={ROAD_CLOSURE_MESSAGES}
          notifTitle="Ringwood Carnival — Road Update 🚧"
          logPrefix="Initiated road closure message"
          currentName={currentName}
          onConfirm={requestConfirm}
          onLog={logAction}
          borderColor="border-secondary/50"
          mb="mb-8"
        />

        {/* Quick Messages */}
        <NotificationSection
          title="Quick Messages"
          icon={<Bell className="w-5 h-5 text-primary" />}
          messages={QUICK_MESSAGES}
          notifTitle="Ringwood Carnival 🎉"
          logPrefix="Initiated quick message"
          currentName={currentName}
          onConfirm={requestConfirm}
          onLog={logAction}
          borderColor="border-primary/50"
          mb="mb-8"
        />

        {/* Custom notification */}
        <h2 className="font-heading font-bold text-foreground text-lg mb-3">Custom Notification</h2>
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
            onClick={() => requestConfirm(title, body)}
            disabled={sending || !body.trim()}
            className="w-full bg-secondary text-white font-heading font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? <Bell className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </div>
        </>}
      </div>

      {/* Sent Banner */}
      {sentBanner && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-28 left-4 right-4 z-50 max-w-md mx-auto bg-green-600 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-3"
        >
          <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-heading font-bold text-sm">Notification Sent!</p>
            <p className="text-white/80 text-xs mt-0.5">{sentBanner.title} — {sentBanner.body}</p>
          </div>
        </motion.div>
      )}

      {/* Confirm Modal */}
      {confirmPending && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setConfirmPending(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-secondary" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">Confirm Notification</h3>
            </div>
            <div className="bg-muted rounded-xl p-4 mb-6">
              <p className="font-heading font-bold text-sm text-foreground mb-1">{confirmPending.title}</p>
              <p className="text-muted-foreground text-sm">{confirmPending.body}</p>
            </div>
            <p className="text-muted-foreground text-xs mb-4 text-center">Are you sure you want to send this notification?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmPending(null)} className="flex-1 bg-muted text-foreground font-heading font-bold py-3 rounded-xl hover:bg-muted/80 transition-colors">
                Cancel
              </button>
              <button onClick={confirmSend} className="flex-1 bg-secondary text-white font-heading font-bold py-3 rounded-xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}