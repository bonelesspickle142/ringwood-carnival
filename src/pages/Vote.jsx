import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Heart, CheckCircle2, Loader2, Store, X } from "lucide-react";

const VOTE_KEY = "shopWindowVote";

export default function Vote() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votedId, setVotedId] = useState(() => localStorage.getItem(VOTE_KEY));
  const [voting, setVoting] = useState(null);

  useEffect(() => {
    base44.entities.ShopEntry.list("-vote_count", 100).then((data) => {
      setShops(data);
      setLoading(false);
    });
    const unsub = base44.entities.ShopEntry.subscribe((event) => {
      if (event.type === "create") setShops((prev) => [...prev, event.data]);
      else if (event.type === "update") setShops((prev) => prev.map((s) => s.id === event.id ? { ...s, ...event.data } : s));
      else if (event.type === "delete") setShops((prev) => prev.filter((s) => s.id !== event.id));
    });
    return unsub;
  }, []);

  const handleVote = async (shop) => {
    if (voting) return;
    setVoting(shop.id);

    if (votedId === shop.id) {
      // Remove vote
      const newCount = Math.max((shop.vote_count || 1) - 1, 0);
      setShops((prev) => prev.map((s) => s.id === shop.id ? { ...s, vote_count: newCount } : s));
      localStorage.removeItem(VOTE_KEY);
      setVotedId(null);
      await base44.entities.ShopEntry.update(shop.id, { vote_count: newCount });
    } else {
      // Switch vote: remove old vote first
      if (votedId) {
        const oldShop = shops.find((s) => s.id === votedId);
        if (oldShop) {
          const oldCount = Math.max((oldShop.vote_count || 1) - 1, 0);
          setShops((prev) => prev.map((s) => s.id === votedId ? { ...s, vote_count: oldCount } : s));
          await base44.entities.ShopEntry.update(votedId, { vote_count: oldCount });
        }
      }
      // Add new vote
      const newCount = (shop.vote_count || 0) + 1;
      setShops((prev) => prev.map((s) => s.id === shop.id ? { ...s, vote_count: newCount } : s));
      localStorage.setItem(VOTE_KEY, shop.id);
      setVotedId(shop.id);
      await base44.entities.ShopEntry.update(shop.id, { vote_count: newCount });
    }

    setVoting(null);
  };

  const sortedShops = [...shops];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-3xl font-bold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            Shop Window<br />
            <span className="text-secondary">Competition</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {votedId
              ? "Thanks for voting! Tap your choice again to remove your vote."
              : "Vote for your favourite decorated shop window."}
          </p>
        </motion.div>
      </div>

      {/* Already voted banner */}
      <AnimatePresence>
        {votedId && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-4 flex items-center gap-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl px-4 py-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-300 font-heading font-semibold">
              You voted for <span className="text-green-700 dark:text-green-200">{shops.find((s) => s.id === votedId)?.name || "a shop"}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 md:px-12 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <Store className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-heading font-bold text-lg mb-1">No entries yet</p>
            <p className="text-muted-foreground text-sm">Shop entries will appear here once added by staff.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedShops.map((shop, i) => {
              const isVoted = votedId === shop.id;
              const hasVoted = !!votedId;
              return (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-card border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isVoted ? "border-secondary shadow-lg shadow-secondary/20" : "border-border"
                  }`}
                >
                  {shop.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img src={shop.image_url} alt={shop.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-foreground text-base leading-tight">{shop.name}</p>
                        {shop.description && (
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{shop.description}</p>
                        )}
                      </div>

                    </div>
                    <button
                      onClick={() => handleVote(shop)}
                      disabled={voting !== null}
                      className={`mt-4 w-full flex items-center justify-center gap-2 font-heading font-bold py-3 rounded-xl transition-all text-sm ${
                        isVoted
                          ? "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 active:scale-95"
                          : "bg-secondary text-white hover:bg-secondary/90 active:scale-95"
                      } disabled:opacity-50`}
                    >
                      {voting === shop.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isVoted ? (
                        <><CheckCircle2 className="w-4 h-4" /> Your Vote — tap to remove</>
                      ) : (
                        <><Heart className="w-4 h-4" /> Vote for this shop</>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}