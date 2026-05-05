import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Eye, EyeOff, Copy, Check, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const COLOURS = ['Red','Blue','Green','Gold','Silver','Purple','Orange','Pink','Black','White','Amber','Violet','Teal','Coral','Indigo'];
const OBJECTS = ['Lantern','Trumpet','Ribbon','Banner','Drum','Torch','Crown','Shield','Arrow','Anchor','Feather','Compass','Hammer','Rocket','Candle'];

function generatePassword() {
  const colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  const object = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
  const digit = Math.floor(Math.random() * 10);
  return `${colour}.${object}${digit}`;
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

export default function MarshalManager() {
  const [marshals, setMarshals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Marshal.list("-created_date", 100);
    setMarshals(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) { toast.error("Name and role are required."); return; }
    setAdding(true);
    const password = generatePassword();
    const created = await base44.entities.Marshal.create({
      name: newName.trim(),
      role: newRole.trim(),
      password,
      notes: newNotes.trim(),
      checked_in: false,
    });
    setMarshals((prev) => [created, ...prev]);
    toast.success(`Marshal added! Password: ${password}`);
    setNewName(""); setNewRole(""); setNewNotes(""); setShowAddForm(false);
    setAdding(false);
  };

  const handleDelete = async (id) => {
    setMarshals((prev) => prev.filter((m) => m.id !== id));
    await base44.entities.Marshal.delete(id);
    toast.success("Marshal removed.");
  };

  const toggleShowPass = (id) => setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Individual passwords for on-the-day staff</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-primary text-white font-heading font-bold px-3 py-2 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Marshal
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-card border border-border rounded-2xl p-4 mb-4"
          >
            <h3 className="font-heading font-bold text-foreground text-sm mb-3">New Marshal</h3>
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full name *"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Role (e.g. Road Marshal) *"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Briefing notes / assignment (optional)"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="text-xs text-muted-foreground">A unique password will be auto-generated.</p>
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
      ) : marshals.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-2xl border border-border">
          <p className="text-muted-foreground text-sm">No marshals yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {marshals.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-heading font-bold text-foreground text-sm">{m.name}</p>
                  {m.checked_in ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-2.5 h-2.5" /> IN
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" /> OUT
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{m.role}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-xs text-muted-foreground font-mono">
                    {showPasswords[m.id] ? m.password : "••••••••••"}
                  </p>
                  <button onClick={() => toggleShowPass(m.id)} className="text-muted-foreground hover:text-foreground transition-colors">
                    {showPasswords[m.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  {showPasswords[m.id] && <CopyButton text={m.password} />}
                </div>
              </div>
              <button
                onClick={() => handleDelete(m.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}