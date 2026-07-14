import { motion } from "framer-motion";
import { MapPin, Car, ShieldCheck, BookOpen, Users, ExternalLink, ZoomIn, X } from "lucide-react";
import { useState } from "react";

const INFO_IMAGE = "https://media.base44.com/images/public/69da7ac3061580afda8ac770/946e44a29_generated_924a7ac6.png";
const TEAM_PHOTO_URL = "https://ss.charleymurphy.xyz/RW%20Team%20Photo.JPG";
const TEAM_TEXT = "The Ringwood Carnival volunteers are the heartbeat of the town's massive end-of-summer celebration, dedicating their time entirely for the love of their community. Behind the scenes, the dedicated committee spends months planning logistical details, coordinating with local groups, and organizing fundraising events to ensure everything runs smoothly and stays financially sustainable.\n\nWhen the third Saturday of September rolls around, a massive wave of event-day volunteers springs into action. They get up to everything from marshalling the spectacular afternoon and evening illuminated processions to managing the lively family zones on the Village Green, dressing the magnificent Carnival Royalty float, and keeping the town tidy. Ultimately, their hard work pays off by creating a completely free \"festival of fun\" for thousands of spectators, with all surplus funds raised being donated back to local charities and good causes.";

const PARKING_MAP = "https://ss.charleymurphy.xyz/April_20_2026_10-31-29_zosKQ8Ya.png";

function ParkingMap() {
  const [enlarged, setEnlarged] = useState(false);
  return (
    <>
      <div
        className="relative cursor-zoom-in rounded-xl overflow-hidden border border-border group"
        onClick={() => setEnlarged(true)}
      >
        <img src={PARKING_MAP} alt="Ringwood parking map" className="w-full h-auto" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
            <ZoomIn className="w-5 h-5 text-foreground" />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 text-center">Tap to enlarge</p>

      {enlarged && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setEnlarged(false)}
        >
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            onClick={() => setEnlarged(false)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={PARKING_MAP}
            alt="Ringwood parking map"
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

const SectionTitle = ({ icon: Icon, children }) => (
  <h2 className="font-heading text-lg font-bold text-foreground mb-2 flex items-center gap-2">
    <Icon className="w-4 h-4 text-accent" /> {children}
  </h2>
);

export default function Info() {
  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="relative h-32 md:h-44 overflow-hidden">
        <img src={INFO_IMAGE} alt="Ringwood town" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            Carnival Info
          </motion.h1>
          <p className="text-white/70 text-sm mt-0.5">Everything you need to know</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-6 max-w-3xl space-y-6">
        {/* Travel & Parking */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <SectionTitle icon={MapPin}>Getting to Ringwood</SectionTitle>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Ringwood is in the New Forest, Hampshire, easily accessible from the A31 and A338. The procession runs along the High Street and surrounding roads.
            <strong className="text-foreground"> By Car:</strong> From the M27, take the A31 westbound — allow extra time for road closures.
            <strong className="text-foreground"> By Bus:</strong> X3 and Bluestar services from Bournemouth, Southampton and Salisbury stop in the town centre.
          </p>

          <SectionTitle icon={Car}>Parking</SectionTitle>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Plenty of car parks (including disabled bays) — both short and long stay, some free. For full details visit the{" "}
            <a href="https://www.ringwood.gov.uk/information-service/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
              Ringwood Town Council website
            </a>.
          </p>
          <ParkingMap />

          <div className="bg-primary rounded-xl p-4 text-primary-foreground mt-3">
            <h3 className="font-heading font-bold text-sm mb-1 text-secondary">Road Closures</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              High Street and Christchurch Road closed 1:00 PM – 6:00 PM on carnival day. Diversions signposted.
            </p>
          </div>
        </motion.section>

        {/* Safety */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionTitle icon={ShieldCheck}>Safety</SectionTitle>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            Safety is our top priority. Follow all steward instructions and stay behind barriers during the procession.
          </p>
          <div className="space-y-2">
            {[
              { title: "First Aid", desc: "ACOS Medical — self-present at Greyfriars Community Centre." },
              { title: "Security", desc: "Find the nearest Uniformed Security Officer for assistance." },
              { title: "Lost/Found Children", desc: "Report to the nearest Carnival Personnel." },
              { title: "Toilets", desc: "The Furlong Car Park and portaloos near the fairground." },
            ].map((item) => (
              <div key={item.title} className="bg-card rounded-xl p-3 border border-border">
                <h3 className="font-heading font-bold text-foreground text-sm mb-0.5">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* History */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionTitle icon={BookOpen}>Carnival History</SectionTitle>
          <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
            <p>
              Ringwood Carnival is one of Hampshire's most cherished community events, bringing together residents and visitors from across the New Forest and beyond for a spectacular day of colour, music and celebration.
            </p>
            <p>
              What began as a modest local parade has grown into a major annual event, featuring elaborately decorated floats, marching bands, dance troupes, and community groups. Each year, local organisations, schools, charities and businesses pour weeks of creative energy into building their floats around a chosen theme.
            </p>
            <p>
              The procession makes its way from Market Place, along the High Street and through the town, watched by thousands. The day is filled with entertainment, food stalls, craft markets, fairground rides and live performances — a day when the whole community comes together to celebrate, fundraise, and create lasting memories.
            </p>
            <p>
              Ringwood Carnival remains entirely volunteer-run, a testament to the extraordinary spirit of this Hampshire market town.
            </p>
          </div>
        </motion.section>

        {/* Team */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionTitle icon={Users}>Our Team</SectionTitle>
          <div className="rounded-xl overflow-hidden border border-border mb-3">
            <img src={TEAM_PHOTO_URL} alt="Ringwood Carnival Team" className="w-full object-cover" />
          </div>
          <a
            href="https://ringwoodcarnival.org/get-involved/volunteer/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-secondary text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-secondary/90 active:scale-95 transition-all duration-150 shadow-lg shadow-secondary/30 w-full mb-3"
          >
            Express interest in Volunteering
          </a>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {TEAM_TEXT}
          </p>
        </motion.section>
      </div>
    </div>
  );
}