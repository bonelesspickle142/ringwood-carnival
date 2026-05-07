import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, User, Shield, MapPin, Phone, CheckCircle2, Clock, AlertTriangle, Radio, ChevronDown, LogOut, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

const MARSHAL_AUTH_KEY = "marshalAuth";

function getMarshalSession() {
  try {
    const item = localStorage.getItem(MARSHAL_AUTH_KEY);
    if (!item) return null;
    const { marshalId, name, role, notes, sector_marshal, sector_marshal_contact, expires } = JSON.parse(item);
    if (Date.now() > expires) { localStorage.removeItem(MARSHAL_AUTH_KEY); return null; }
    return { marshalId, name, role, notes: notes || "", sector_marshal: sector_marshal || "", sector_marshal_contact: sector_marshal_contact || "" };
  } catch { return null; }
}

// ── INSERT YOUR BRIEFING PDF LINK HERE ───────────────────────────────────────
const BRIEFING_PDF_URL = "https://YOUR_PDF_LINK_HERE";
// ─────────────────────────────────────────────────────────────────────────────

const CONTACTS = [
  { name: "Control", role: "Event Control", number: "01425 517025" },
];

const BRIEFING_POINTS = [
 "Not leave your designated sector and area where you are marshalling unless it’s an emergency or related.",
 "Not be under the influence of alcohol or drugs.",
 "Remain calm and be courteous towards all members of the public.",
 "Wear and show your uniform you are given.",
 "Be aware of the communication arrangements (radio, mobile phone etc), who to contact and the location of Event Control (Greyfriars), pay attention to all communication around you and digest important information.",
 "Be familiar with the procession route and your location and be able to assist the public by giving information about the event and facilities including VIP, Toilets, Bus Stops etc.",
 "Be vigilant and aware of any suspicious packages or backs. – Do not touch or move the package, report this immediately and try and move the public away from the area in a controlled way so as not to raise alarm or cause a further situation.",

];

function BriefingTab({ marshal }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
        <p className="font-heading font-bold text-foreground text-base">Welcome, {marshal.name}!</p>
        <p className="text-muted-foreground text-sm mt-0.5">Role: <span className="font-semibold text-foreground">{marshal.role}</span></p>
        {marshal.notes && <p className="text-sm text-foreground mt-2 bg-card rounded-xl p-3 border border-border">{marshal.notes}</p>}
      </div>

      {/* PDF Briefing Document */}
      <div>
        <h3 className="font-heading font-bold text-foreground text-base mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Briefing Document
        </h3>
        <a
          href={BRIEFING_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full bg-card border border-border rounded-2xl p-4 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-heading font-bold text-foreground text-sm">Marshal Briefing Pack</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tap to open PDF</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      </div>

      {/* Key briefing points */}
      <div>
        <h3 className="font-heading font-bold text-foreground text-base mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" /> Key Reminders
        </h3>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {BRIEFING_POINTS.map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-4">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-[10px] font-bold">{i + 1}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key contacts */}
      <div>
        <h3 className="font-heading font-bold text-foreground text-base mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-secondary" /> Key Contacts
        </h3>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {/* Sector marshal contact — shown first if set */}
          {marshal.sector_marshal && (
            <div className="flex items-center justify-between p-4 bg-primary/5">
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">{marshal.sector_marshal}</p>
                <p className="text-xs text-primary font-semibold">Your Sector Marshal</p>
              </div>
              {marshal.sector_marshal_contact ? (
                <a
                  href={`tel:${marshal.sector_marshal_contact}`}
                  className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold text-xs px-3 py-2 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-3 h-3" /> {marshal.sector_marshal_contact}
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">No number set</span>
              )}
            </div>
          )}
          {CONTACTS.map((c) => (
            <div key={c.name} className="flex items-center justify-between p-4">
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <a
                href={`tel:${c.number}`}
                className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold text-xs px-3 py-2 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-3 h-3" /> {c.number}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckInTab({ marshal }) {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    base44.entities.Marshal.filter({ id: marshal.marshalId }).then((results) => {
      if (results && results.length > 0) {
        setCheckedIn(results[0].checked_in || false);
        setCheckInTime(results[0].check_in_time || null);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [marshal.marshalId]);

  const handleToggle = async () => {
    setToggling(true);
    const newCheckedIn = !checkedIn;
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    try {
      await base44.entities.Marshal.update(marshal.marshalId, {
        checked_in: newCheckedIn,
        check_in_time: newCheckedIn ? now : null,
      });
      setCheckedIn(newCheckedIn);
      setCheckInTime(newCheckedIn ? now : null);
      toast.success(newCheckedIn ? `Checked in at ${now}!` : "Checked out.");
    } catch {
      toast.error("Failed to update check-in. Please try again.");
    }
    setToggling(false);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className={`rounded-2xl p-6 text-center border-2 transition-all ${checkedIn ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700" : "bg-card border-border"}`}>
        {checkedIn ? (
          <>
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-3" />
            <p className="font-heading font-bold text-green-800 dark:text-green-300 text-xl">Checked In</p>
            {checkInTime && <p className="text-green-600 dark:text-green-400 text-sm mt-1">Since {checkInTime}</p>}
            <p className="text-green-700 dark:text-green-400 text-sm mt-2">You are registered as on duty.</p>
          </>
        ) : (
          <>
            <Clock className="w-14 h-14 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading font-bold text-foreground text-xl">Not Checked In</p>
            <p className="text-muted-foreground text-sm mt-2">Tap below when you arrive and are ready for duty.</p>
          </>
        )}
      </div>

      <button
        onClick={handleToggle}
        disabled={toggling}
        className={`w-full font-heading font-bold py-4 rounded-2xl transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50 ${
          checkedIn
            ? "bg-muted text-foreground hover:bg-muted/80"
            : "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30"
        }`}
      >
        {toggling ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : checkedIn ? (
          <><LogOut className="w-5 h-5" /> Check Out</>
        ) : (
          <><CheckCircle2 className="w-5 h-5" /> Check In Now</>
        )}
      </button>

      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="font-heading font-semibold text-foreground text-sm mb-1">Your Details</p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Name: <span className="text-foreground font-medium">{marshal.name}</span></p>
          <p>Role: <span className="text-foreground font-medium">{marshal.role}</span></p>
        </div>
      </div>
    </div>
  );
}

export default function MarshalArea() {
  const [session, setSession] = useState(() => getMarshalSession());
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState("briefing");

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed) return;
    setLoggingIn(true);
    try {
      // Find marshal by password
      const results = await base44.entities.Marshal.list();
      const match = results.find((m) => m.password === trimmed);
      if (match) {
        const sessionData = {
          marshalId: match.id,
          name: match.name,
          role: match.role,
          notes: match.notes || "",
          sector_marshal: match.sector_marshal || "",
          sector_marshal_contact: match.sector_marshal_contact || "",
          expires: Date.now() + 12 * 60 * 60 * 1000,
        };
        localStorage.setItem(MARSHAL_AUTH_KEY, JSON.stringify(sessionData));
        setSession(sessionData);
        toast.success(`Welcome, ${match.name}!`);
      } else {
        toast.error("Password not recognised. Please check with your supervisor.");
      }
    } catch {
      toast.error("Unable to verify. Please try again.");
    }
    setLoggingIn(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(MARSHAL_AUTH_KEY);
    setSession(null);
    setPassword("");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-lg">
            <div className="flex flex-col items-center mb-8">
              <img
                src="https://ss.charleymurphy.xyz/RWC%20Logo.jpg"
                alt="Ringwood Carnival"
                className="w-20 h-20 rounded-2xl object-cover shadow mb-4"
              />
              <h1 className="font-heading text-2xl font-bold text-foreground">Staff Area</h1>
              <p className="text-muted-foreground text-sm mt-1 text-center">Enter your marshal password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your marshal password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-primary text-primary-foreground font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loggingIn ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shield className="w-4 h-4" />}
                {loggingIn ? "Verifying…" : "Enter Staff Area"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-14 pb-4 max-w-xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          Staff Area
        </motion.h1>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">{session.name}</strong> — {session.role}
          </p>
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-destructive transition-colors font-heading font-semibold">
            Log out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mt-5">
          {[
            { key: "briefing", label: "Briefing" },
            { key: "checkin", label: "Check-In" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${activeTab === key ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 pb-32 max-w-xl mx-auto">
        {activeTab === "briefing" && <BriefingTab marshal={session} />}
        {activeTab === "checkin" && <CheckInTab marshal={session} />}
      </div>
    </div>
  );
}