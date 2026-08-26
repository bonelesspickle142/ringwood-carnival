import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, Plus, Trash2, Loader2, Eye, EyeOff, Copy, Check, RefreshCw, Users, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import MarshalManager from "./MarshalManager";
import SponsorsManager from "./SponsorsManager";

const SU_SESSION_KEY = "suAuth";

function getSuSession() {
  try {
    const item = localStorage.getItem(SU_SESSION_KEY);
    if (!item) return null;
    const { username, password, expires } = JSON.parse(item);
    if (Date.now() > expires) { localStorage.removeItem(SU_SESSION_KEY); return null; }
    return { username, password };
  } catch { return null; }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handle} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AdminArea() {
  const [suSession, setSuSession] = useState(() => getSuSession());
  const [suUsername, setSuUsername] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [showSuPass, setShowSuPass] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const [adminTab, setAdminTab] = useState("logins");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const invoke = (action, extra = {}) =>
    base44.functions.invoke("adminStaffLogins", {
      action,
      suUsername: suSession?.username,
      suPassword: suSession?.password,
      ...extra,
    });

  const loadStaff = async () => {
    setLoading(true);
    const res = await invoke("list");
    setStaff(res.data?.staff || []);
    setLoading(false);
  };

  useEffect(() => {
    if (suSession) loadStaff();
  }, [suSession]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    const res = await base44.functions.invoke("adminStaffLogins", {
      action: "login",
      username: suUsername,
      password: suPassword,
    });
    setLoggingIn(false);
    if (res.data?.success) {
      const session = { username: suUsername, password: suPassword, expires: Date.now() + 8 * 60 * 60 * 1000 };
      localStorage.setItem(SU_SESSION_KEY, JSON.stringify(session));
      setSuSession({ username: suUsername, password: suPassword });
      toast.success("Welcome, Superuser!");
    } else {
      toast.error("Invalid credentials.");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) { toast.error("Name and username are required."); return; }
    setAdding(true);
    const res = await invoke("add", { name: newName.trim(), username: newUsername.trim(), password: newPassword.trim() || undefined });
    setAdding(false);
    if (res.data?.success) {
      toast.success(`Staff member added! Password: ${res.data.password}`);
      setNewName(""); setNewUsername(""); setNewPassword(""); setShowAddForm(false);
      loadStaff();
    } else {
      toast.error("Failed to add staff member.");
    }
  };

  const handleDelete = async (username) => {
    setStaff((prev) => prev.filter((s) => s.username !== username));
    await invoke("delete", { username });
    toast.success("Staff member removed.");
  };

  const toggleShowPass = (username) => setShowPasswords((prev) => ({ ...prev, [username]: !prev[username] }));

  if (!suSession) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground text-lg">Admin Area</h2>
            <p className="text-muted-foreground text-xs">Superuser access required</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Username</label>
              <input
                value={suUsername}
                onChange={(e) => setSuUsername(e.target.value)}
                placeholder="Superuser username"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Password</label>
              <input
                type={showSuPass ? "text" : "password"}
                value={suPassword}
                onChange={(e) => setSuPassword(e.target.value)}
                placeholder="Superuser password"
                className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={() => setShowSuPass(!showSuPass)} className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-colors">
                {showSuPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-primary text-white font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loggingIn ? "Verifying…" : "Enter Admin Area"}
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground text-base">Admin</h2>
            <p className="text-xs text-muted-foreground">Committee &amp; Marshal management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadStaff} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold px-3 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>
          <button
            onClick={() => { localStorage.removeItem(SU_SESSION_KEY); setSuSession(null); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors font-heading font-semibold px-2"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Admin sub-tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
        <button
          onClick={() => setAdminTab("logins")}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${adminTab === "logins" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <Shield className="w-3.5 h-3.5" /> Committee Logins
        </button>
        <button
          onClick={() => setAdminTab("marshals")}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${adminTab === "marshals" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <Users className="w-3.5 h-3.5" /> Marshal Passwords
        </button>
        <button
          onClick={() => setAdminTab("sponsors")}
          className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${adminTab === "sponsors" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <Award className="w-3.5 h-3.5" /> Sponsors
        </button>
      </div>

      {adminTab === "marshals" && <MarshalManager />}

      {adminTab === "sponsors" && <SponsorsManager />}

      {adminTab === "logins" && <>
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-card border border-border rounded-2xl p-4 mb-4"
          >
            <h3 className="font-heading font-bold text-foreground text-sm mb-3">New Staff Member</h3>
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full name *"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Username *"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password (leave blank to auto-generate)"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl text-sm hover:bg-muted/80 transition-colors">Cancel</button>
                <button type="submit" disabled={adding} className="flex-1 bg-primary text-white font-heading font-bold py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : staff.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No staff members yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {staff.map((member) => (
            <div key={member.username} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-foreground text-sm">{member.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">@{member.username}</p>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">
                    {showPasswords[member.username] ? member.password : "••••••••"}
                  </p>
                  <button onClick={() => toggleShowPass(member.username)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {showPasswords[member.username] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  {showPasswords[member.username] && <CopyButton text={member.password} />}
                </div>
              </div>
              <button
                onClick={() => handleDelete(member.username)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        <a href="https://docs.google.com/spreadsheets/d/1IARpSN3VmSr5z55W8Tp0EE4oJAkzwnpJSHh_7yC4H3g" target="_blank" rel="noopener noreferrer" className="underline">View in Google Sheets ↗</a>
      </p>
      </>}
    </div>
  );
}