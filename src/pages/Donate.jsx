import { motion } from "framer-motion";
import { Heart, Gift, Star, Users } from "lucide-react";

// Replace this URL with your actual Stripe Payment Link
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/your-link-here";

const tiers = [
  {
    amount: "£5",
    label: "Supporter",
    icon: Heart,
    desc: "Help cover the cost of bunting and decorations",
    color: "border-secondary/30 hover:border-secondary",
    iconColor: "text-secondary",
  },
  {
    amount: "£10",
    label: "Patron",
    icon: Star,
    desc: "Contribute to the road closure costs and steward equipment",
    color: "border-primary/30 hover:border-primary",
    iconColor: "text-primary",
    featured: true,
  },
  {
    amount: "£25",
    label: "Champion",
    icon: Gift,
    desc: "Fund a full float entry for a community group",
    color: "border-secondary/30 hover:border-secondary",
    iconColor: "text-secondary",
  },
];

export default function Donate() {
  const handleDonate = (amount) => {
    window.open(`${STRIPE_PAYMENT_LINK}?amount=${amount}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-primary pt-12 pb-16 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary" />
          <div className="absolute bottom-4 right-8 w-24 h-24 rounded-full bg-white" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">
            Support the Carnival
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Ringwood Carnival is entirely volunteer-run. Your donation helps keep this beloved community
            event alive for generations to come.
          </p>
        </motion.div>
      </div>

      <div className="px-6 md:px-12 py-10 -mt-6 max-w-2xl mx-auto">
        {/* Donation tiers */}
        <div className="space-y-4 mb-8">
          {tiers.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.button
                key={tier.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleDonate(tier.amount.replace("£", ""))}
                className={`w-full bg-card rounded-2xl border-2 ${tier.color} p-5 text-left transition-all duration-200 hover:shadow-lg group ${tier.featured ? "ring-2 ring-primary/20" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${tier.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading text-xl font-bold text-foreground">{tier.amount}</span>
                      <span className="font-heading font-semibold text-muted-foreground text-sm">— {tier.label}</span>
                      {tier.featured && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">Popular</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{tier.desc}</p>
                  </div>
                  <span className="text-muted-foreground/40 group-hover:text-primary transition-colors text-xl font-bold">→</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Custom amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6 mb-8"
        >
          <h3 className="font-heading font-bold text-foreground mb-1">Choose your own amount</h3>
          <p className="text-muted-foreground text-sm mb-4">Every contribution, big or small, makes a difference.</p>
          <button
            onClick={() => window.open(STRIPE_PAYMENT_LINK, "_blank")}
            className="w-full bg-secondary text-white font-heading font-bold py-3 rounded-xl hover:bg-secondary/90 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" /> Donate Any Amount
          </button>
        </motion.div>

        {/* Social proof */}
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold text-sm text-foreground">Where your money goes</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>• Road closure permits &amp; council fees</li>
            <li>• Steward training &amp; equipment</li>
            <li>• Stage &amp; sound system hire</li>
            <li>• Float building grants for community groups</li>
            <li>• First aid provision &amp; safety measures</li>
          </ul>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Payments are processed securely via Stripe. Ringwood Carnival Committee — registered charity.
        </p>
      </div>
    </div>
  );
}