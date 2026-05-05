import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, LogIn, LogOut, Loader2, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import SignaturePad from "./SignaturePad";

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

function invoke(action, extra = {}) {
  const session = getSuSession();
  return base44.functions.invoke("radioLog", {
    action,
    suUsername: session?.username,
    suPassword: session?.password,
    ...extra,
  });
}

// ── Sign Out Form ─────────────────────────────────────────────────────────────
function SignOutForm() {
  const [form, setForm] = useState({ name: "", role: "", radioId: "", hasEarpiece: false, hasSpareBattery: false });
  const [step, setStep] = useState("form"); // form | signature | done
  const [signature, setSignature] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.radioId.trim()) {
      toast.error("Name, role and radio ID are required.");
      return;
    }
    setStep("signature");
  };

  const handleSubmit = async (sig) => {
    setSignature(sig);
    setSubmitting(true);
    await invoke("sign_out", { ...form, signature: sig });
    setSubmitting(false);
    setStep("done");
  };

  const reset = () => { setForm({ name: "", role: "", radioId: "", hasEarpiece: false, hasSpareBattery: false }); setStep("form"); setSignature(null); };

  if (step === "done") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="font-heading font-bold text-foreground text-xl">Radio Signed Out</p>
        <p className="text-muted-foreground text-sm mt-1">Radio {form.radioId} — logged at {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
        <button onClick={reset} className="mt-6 flex items-center gap-2 mx-auto bg-primary text-white font-heading font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          <RotateCcw className="w-4 h-4" /> Sign Out Another
        </button>
      </motion.div>
    );
  }

  if (step === "signature") {
    return (
      <div>
        <h3 className="font-heading font-bold text-foreground text-base mb-1">Please Sign Below</h3>
        <p className="text-muted-foreground text-xs mb-4">By signing, you confirm you are taking responsibility for Radio {form.radioId}.</p>
        <SignaturePad onConfirm={handleSubmit} onCancel={() => setStep("form")} submitting={submitting} />
      </div>
    );
  }

  return (
    <form onSubmit={handleNext} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Full Name *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Jane Smith"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Role *</label>
          <input value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Road Marshal"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>
      <div>
        <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Radio Number *</label>
        <input value={form.radioId} onChange={e => set("radioId", e.target.value)} placeholder="e.g. R04"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Accessories Taken</label>
        <div className="flex gap-3">
          <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.hasEarpiece ? "border-primary bg-primary/5" : "border-border"}`}>
            <input type="checkbox" checked={form.hasEarpiece} onChange={e => set("hasEarpiece", e.target.checked)} className="hidden" />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${form.hasEarpiece ? "border-primary bg-primary" : "border-border"}`}>
              {form.hasEarpiece && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm font-heading font-semibold text-foreground">Earpiece</span>
          </label>
          <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.hasSpareBattery ? "border-primary bg-primary/5" : "border-border"}`}>
            <input type="checkbox" checked={form.hasSpareBattery} onChange={e => set("hasSpareBattery", e.target.checked)} className="hidden" />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${form.hasSpareBattery ? "border-primary bg-primary" : "border-border"}`}>
              {form.hasSpareBattery && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm font-heading font-semibold text-foreground">Spare Battery</span>
          </label>
        </div>
      </div>
      <button type="submit" className="w-full bg-primary text-white font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-4 h-4" /> Continue to Sign
      </button>
    </form>
  );
}

// ── Sign In (Return) Form ─────────────────────────────────────────────────────
function SignInForm() {
  const [radioId, setRadioId] = useState("");
  const [step, setStep] = useState("id"); // id | return | signature | done
  const [form, setForm] = useState({ hasDamage: false, damageNotes: "", earpieceReturned: false, batteryReturned: false });
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleIdNext = (e) => {
    e.preventDefault();
    if (!radioId.trim()) { toast.error("Please enter a radio ID."); return; }
    setStep("return");
  };

  const handleReturnNext = (e) => {
    e.preventDefault();
    setStep("signature");
  };

  const handleSubmit = async (sig) => {
    setSubmitting(true);
    await invoke("sign_in", { radioId, ...form, signature: sig });
    setSubmitting(false);
    setStep("done");
  };

  const reset = () => { setRadioId(""); setForm({ hasDamage: false, damageNotes: "", earpieceReturned: false, batteryReturned: false }); setStep("id"); };

  if (step === "done") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="font-heading font-bold text-foreground text-xl">Radio Returned</p>
        <p className="text-muted-foreground text-sm mt-1">Radio {radioId} — logged at {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
        <button onClick={reset} className="mt-6 flex items-center gap-2 mx-auto bg-primary text-white font-heading font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          <RotateCcw className="w-4 h-4" /> Return Another
        </button>
      </motion.div>
    );
  }

  if (step === "signature") {
    return (
      <div>
        <h3 className="font-heading font-bold text-foreground text-base mb-1">Please Sign Below</h3>
        <p className="text-muted-foreground text-xs mb-4">By signing, you confirm the details above for Radio {radioId}.</p>
        <SignaturePad onConfirm={handleSubmit} onCancel={() => setStep("return")} submitting={submitting} />
      </div>
    );
  }

  if (step === "return") {
    return (
      <form onSubmit={handleReturnNext} className="space-y-4">
        <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <span className="font-heading font-bold text-foreground text-sm">Returning Radio: {radioId}</span>
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Accessories Returned</label>
          <div className="flex gap-3">
            <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.earpieceReturned ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="checkbox" checked={form.earpieceReturned} onChange={e => set("earpieceReturned", e.target.checked)} className="hidden" />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${form.earpieceReturned ? "border-primary bg-primary" : "border-border"}`}>
                {form.earpieceReturned && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-heading font-semibold text-foreground">Earpiece</span>
            </label>
            <label className={`flex-1 flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.batteryReturned ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="checkbox" checked={form.batteryReturned} onChange={e => set("batteryReturned", e.target.checked)} className="hidden" />
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${form.batteryReturned ? "border-primary bg-primary" : "border-border"}`}>
                {form.batteryReturned && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-heading font-semibold text-foreground">Spare Battery</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Radio Damage?</label>
          <div className="flex gap-3 mb-3">
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${!form.hasDamage ? "border-green-500 bg-green-50 dark:bg-green-950/30" : "border-border"}`}>
              <input type="radio" name="damage" checked={!form.hasDamage} onChange={() => set("hasDamage", false)} className="hidden" />
              <span className="text-sm font-heading font-semibold text-foreground">No Damage</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.hasDamage ? "border-secondary bg-secondary/5" : "border-border"}`}>
              <input type="radio" name="damage" checked={form.hasDamage} onChange={() => set("hasDamage", true)} className="hidden" />
              <AlertTriangle className="w-4 h-4 text-secondary" />
              <span className="text-sm font-heading font-semibold text-foreground">Damaged</span>
            </label>
          </div>
          {form.hasDamage && (
            <textarea
              value={form.damageNotes}
              onChange={e => set("damageNotes", e.target.value)}
              placeholder="Please describe the damage..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-secondary bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          )}
        </div>

        <button type="submit" className="w-full bg-primary text-white font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          <LogIn className="w-4 h-4" /> Continue to Sign
        </button>
      </form>
    );
  }

  // step === "id"
  return (
    <form onSubmit={handleIdNext} className="space-y-3">
      <div>
        <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Radio Number</label>
        <input
          value={radioId}
          onChange={e => setRadioId(e.target.value)}
          placeholder="e.g. R04"
          autoFocus
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button type="submit" className="w-full bg-primary text-white font-heading font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <LogIn className="w-4 h-4" /> Find Radio
      </button>
    </form>
  );
}

// ── Main RadioLog Component ───────────────────────────────────────────────────
export default function RadioLog() {
  const [tab, setTab] = useState("out");

  return (
    <div>
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5">
        <button
          onClick={() => setTab("out")}
          className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${tab === "out" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        <button
          onClick={() => setTab("in")}
          className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 ${tab === "in" ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <LogIn className="w-4 h-4" /> Return
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {tab === "out" ? <SignOutForm /> : <SignInForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}