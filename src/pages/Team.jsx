import { motion } from "framer-motion";

const TEAM_PHOTO_URL = "https://ss.charleymurphy.xyz/team-photo.jpg";
const TEAM_TEXT = "Ringwood Carnival is run entirely by volunteers who give their time year-round to bring the community together. From planning and logistics to safety, entertainment, and everything in between, this dedicated team works tirelessly to make Carnival Day a celebration to remember.";

export default function Team() {
  return (
    <div className="min-h-screen">
      <div className="px-5 md:px-12 pt-14 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          Meet the Team
        </motion.h1>
        <p className="text-muted-foreground text-sm mt-0.5">The volunteers who make the magic happen</p>
      </div>

      <div className="px-5 md:px-12 py-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl"
        >
          <div className="rounded-2xl overflow-hidden border border-border">
            <img
              src={TEAM_PHOTO_URL}
              alt="Ringwood Carnival Team"
              className="w-full object-cover"
            />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mt-5">
            {TEAM_TEXT}
          </p>
        </motion.div>
      </div>
    </div>
  );
}