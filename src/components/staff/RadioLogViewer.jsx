import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, LogOut, LogIn, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function SignatureModal({ dataUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-4 max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-xs font-heading font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Signature</p>
        <img src={dataUrl} alt="Signature" className="w-full rounded-xl border border-border" />
        <button onClick={onClose} className="mt-3 w-full bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl text-sm hover:bg-muted/80 transition-colors">Close</button>
      </motion.div>
    </div>
  );
}

function LogEntry({ log, sheetType }) {
  const [showSig, setShowSig] = useState(false);
  const rawSig = log['Signature Data'] || null;

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {sheetType === 'Sign Out'
              ? <LogOut className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
              : <LogIn className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            }
            <span className="font-heading font-bold text-foreground text-sm">{log['Name'] || '—'}</span>
            <span className="text-xs text-muted-foreground">{log['Role'] || ''}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
            <span>Radio: <strong className="text-foreground">{log['Radio ID'] || '—'}</strong></span>
            {log['Earpiece'] && <span>Earpiece: {log['Earpiece']}</span>}
            {log['Spare Battery'] && <span>Battery: {log['Spare Battery']}</span>}
            {log['Earpiece Returned'] && <span>Earpiece returned: {log['Earpiece Returned']}</span>}
            {log['Battery Returned'] && <span>Battery returned: {log['Battery Returned']}</span>}
            {log['Damage?'] === 'Yes' && <span className="text-secondary font-semibold">⚠ Damage: {log['Damage Notes']}</span>}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{log['Timestamp']}</p>
        </div>
        {rawSig && (
          <button
            onClick={() => setShowSig(true)}
            className="flex-shrink-0 border border-border rounded-xl overflow-hidden w-16 h-10 bg-white hover:opacity-80 transition-opacity"
          >
            <img src={rawSig} alt="sig" className="w-full h-full object-contain" />
          </button>
        )}
      </div>
      {showSig && rawSig && <SignatureModal dataUrl={rawSig} onClose={() => setShowSig(false)} />}
    </div>
  );
}

export default function RadioLogViewer() {
  const [tab, setTab] = useState("Sign Out");
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async (sheetType) => {
    setLoading(true);
    const res = await base44.functions.invoke("radioLog", { action: "get_logs", sheet: sheetType });
    setLogs(res.data?.logs || []);
    setLoading(false);
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && logs === null) load(tab);
  };

  const switchTab = (t) => {
    setTab(t);
    setLogs(null);
    load(t);
  };

  return (
    <div className="mt-4">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted rounded-2xl text-sm font-heading font-semibold text-foreground hover:bg-muted/80 transition-colors"
      >
        <span>View Logs</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {/* Sub-tabs */}
              <div className="flex gap-1 bg-muted rounded-xl p-1">
                {["Sign Out", "Sign In"].map(t => (
                  <button
                    key={t}
                    onClick={() => switchTab(t)}
                    className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all ${tab === t ? "bg-white dark:bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                  >
                    {t === "Sign Out" ? "Signed Out" : "Returned"}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : logs && logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No entries yet.</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {(logs || []).map((log, i) => (
                    <LogEntry key={i} log={log} sheetType={tab} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}