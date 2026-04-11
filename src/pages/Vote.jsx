import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import FloatVoteCard from "../components/FloatVoteCard";
import VoteConfetti from "../components/VoteConfetti";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trophy, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VOTE_IMAGE = "/__generating__/img_72c71db76c79.png";

export default function Vote() {
  const [floats, setFloats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(0);
  const [votedFloat, setVotedFloat] = useState(null);

  useEffect(() => {
    const loadFloats = async () => {
      try {
        const data = await base44.entities.Float.list("order_number", 50);
        setFloats(data);
      } catch (e) {
        // empty
      }
      setLoading(false);
    };
    loadFloats();
  }, []);

  const handleVote = async (float) => {
    setVotedFloat(float);
    setVoted(true);
    setShowConfetti((c) => c + 1);

    await base44.entities.Vote.create({
      float_id: float.id,
      float_name: float.name,
    });

    // Update vote count
    await base44.entities.Float.update(float.id, {
      vote_count: (float.vote_count || 0) + 1,
    });
  };

  const handleSkip = () => {
    if (currentIndex < floats.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <VoteConfetti trigger={showConfetti} />

      {/* Header */}
      <div className="relative h-40 md:h-52 overflow-hidden">
        <img src={VOTE_IMAGE} alt="Vote for best float" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-heading text-sm font-bold tracking-widest uppercase">
                People's Choice
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-white">
              Best in Show
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-8">
        {voted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">
              Vote Cast!
            </h2>
            <p className="text-muted-foreground text-lg mb-2">
              You voted for <span className="font-semibold text-foreground">{votedFloat?.name}</span>
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Thank you for taking part in the Ringwood Carnival!
            </p>
            <Button
              onClick={() => {
                setVoted(false);
                setVotedFloat(null);
                setCurrentIndex(0);
              }}
              variant="outline"
              className="font-heading"
            >
              Vote Again
            </Button>
          </motion.div>
        ) : floats.length > 0 ? (
          <>
            <p className="text-muted-foreground text-sm mb-6 text-center">
              Swipe right on your favourite float to cast your vote
            </p>

            {/* Card stack */}
            <div className="relative w-full max-w-sm mx-auto h-[420px]">
              <AnimatePresence>
                {floats.slice(currentIndex, currentIndex + 2).reverse().map((float, i, arr) => (
                  <FloatVoteCard
                    key={float.id}
                    float={float}
                    isTop={i === arr.length - 1}
                    onVote={handleVote}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <Button
                onClick={handleSkip}
                variant="outline"
                disabled={currentIndex >= floats.length - 1}
                className="font-heading"
              >
                Skip
              </Button>
              <Button
                onClick={() => handleVote(floats[currentIndex])}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-heading"
              >
                <Star className="w-4 h-4 mr-2" /> Vote for this float
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              {currentIndex + 1} of {floats.length} floats
            </p>
          </>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-border">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              Voting opens on carnival day!
            </p>
            <p className="text-muted-foreground/60 text-sm">
              Come back to vote for your favourite float
            </p>
          </div>
        )}
      </div>
    </div>
  );
}