import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, ShieldCheck, BookOpen, Clock, Phone, ExternalLink, ZoomIn, X, Users } from "lucide-react";

const INFO_IMAGE = "https://media.base44.com/images/public/69da7ac3061580afda8ac770/946e44a29_generated_924a7ac6.png";

const SECTIONS = [
  { id: "travel", label: "Travel & Parking", icon: Car },
  { id: "safety", label: "Safety", icon: ShieldCheck },
  { id: "history", label: "Carnival History", icon: BookOpen },
  { id: "staff", label: "Our Team", icon: Users },
];

// ── CARNIVAL STAFF ── Edit details here ───────────────────────────────────────
const STAFF = [
  {
    name: "Ben Salsbury",
    role: "Carnival Chair",
    bio: "Ben leads the team with brilliant ideas, bringing together all skillsets to make Carnival happen!",
    avatar: "https://ss.charleymurphy.xyz/Ben_Salsbury_headshot.jpg?w=200&q=80",
  },
  {
    name: "James Whitfield",
    role: "Procession Coordinator",
    bio: "James coordinates all float entries and manages the procession route.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    name: "Helen Graves",
    role: "Events & Entertainment",
    bio: "Helen books all performers and manages the main stage.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    name: "Tom Ashford",
    role: "Treasurer",
    bio: "Tom keeps the finances in order, making sure every penny raised goes back into the carnival.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    name: "Claire Bennett",
    role: "Volunteer Coordinator",
    bio: "Claire manages our army of 120+ volunteers who make the whole event possible.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
  {
    name: "David Park",
    role: "Safety Officer",
    bio: "David ensures every aspect of the event meets safety regulations.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function Info() {
  const [activeSection, setActiveSection] = useState("travel");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-40 md:h-52 overflow-hidden">
        <img src={INFO_IMAGE} alt="Ringwood town" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
          >
            Carnival Info
          </motion.h1>
          <p className="text-white/70 text-sm mt-0.5">Everything you need to know</p>
        </div>
      </div>

      {/* Sticky sub-header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 md:px-12 flex gap-1.5 overflow-x-auto py-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 pb-32 max-w-3xl">
        {activeSection === "travel" && <TravelSection />}
        {activeSection === "safety" && <SafetySection />}
        {activeSection === "history" && <HistorySection />}
        {activeSection === "staff" && <StaffSection />}
      </div>
    </div>
  );
}

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

function TravelSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <section>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" /> Getting to Ringwood
        </h2>
        <div className="prose prose-lg text-muted-foreground leading-relaxed space-y-4">
          <p>
            Ringwood is located in the New Forest district of Hampshire, easily accessible from the A31 and A338.
            The carnival procession takes place along the High Street and surrounding roads.
          </p>
          <p>
            <strong className="text-foreground">By Car:</strong> From the M27, take the A31 westbound. Ringwood is well signposted from all major routes.
            Please allow extra time due to road closures during the procession.
          </p>
          <p>
            <strong className="text-foreground">By Bus:</strong> Regular services run from Bournemouth, Southampton and Salisbury.
            The X3 and Bluestar services stop in Ringwood town centre.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Car className="w-5 h-5 text-accent" /> Parking
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed mb-5">
          <p>
            There are plenty of car parks in and around Ringwood for you to use on Carnival day (including disabled bays).
            There are both short and long stay parking areas, some of which are free to use!
            Please see below our illustrated map of Ringwood showing key locations, however, for more specific information
            on all car parks please visit the{" "}
            <a href="https://www.ringwood.gov.uk/information-service/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
              Ringwood Town Council website
            </a>.
          </p>
        </div>

        {/* Parking Map */}
        <ParkingMap />


      </section>

      <section className="bg-primary rounded-xl p-6 text-primary-foreground">
        <h3 className="font-heading font-bold text-lg mb-2 text-secondary">Road Closures</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          The High Street and Christchurch Road will be closed to traffic from 1:00 PM to 6:00 PM on carnival day.
          Local diversions will be clearly signposted.
        </p>
      </section>
    </motion.div>
  );
}

function SafetySection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <section>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" /> Safety Information
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The safety of all carnival-goers is our top priority. Please follow all steward instructions
            and stay behind barriers during the procession.
          </p>
        </div>
      </section>

      <div className="space-y-3">
        {[
          { title: "First Aid", desc: "ACOS Medical are providing their services for Carnival this year. You can self-present at Greyfriars Community Centre." },
          { title: "Security", desc: "For any Security incidents, please find the nearest Uniformed Security Officer and they will be able to assist." },
          { title: "Lost/Found Children", desc: "Report to the nearest Carnival Personnel." },
          { title: "Toilets", desc: "Public facilities are available at The Furlong Car Park and additional portaloos near at the fairground." },
          
        ].map((item) => (
          <div key={item.title} className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-heading font-bold text-foreground mb-1">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>


    </motion.div>
  );
}

function StaffSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" /> Our Team
        </h2>
        <p className="text-muted-foreground text-sm mb-6">The volunteers who make the magic happen</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STAFF.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card rounded-2xl border border-border p-5 flex gap-4"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-foreground">{member.name}</h3>
              <p className="text-secondary text-xs font-semibold mb-2 font-heading">{member.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HistorySection() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <section>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" /> The Story of Ringwood Carnival
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Ringwood Carnival is one of Hampshire's most cherished community events, bringing together
            residents and visitors from across the New Forest and beyond for a spectacular day of colour,
            music and celebration.
          </p>
          <p>
            The carnival has its roots in the traditional processions that have wound through the market
            town's historic streets for generations. What began as a modest local parade has grown into a
            major annual event, featuring elaborately decorated floats, marching bands, dance troupes, and
            community groups.
          </p>
          <p>
            Each year, local organisations, schools, charities and businesses pour weeks of creative energy
            into building their floats, often around a chosen theme. The procession makes its way from
            Market Place, along the High Street and through the town, watched by thousands of spectators
            who line the streets.
          </p>
          <p>
            The carnival is not just about the procession. The day is filled with entertainment, food stalls,
            craft markets, fairground rides and live performances. It is a day when the whole community
            comes together to celebrate, fundraise for local causes, and create lasting memories.
          </p>
          <p>
            Ringwood Carnival remains entirely volunteer-run, a testament to the extraordinary spirit of
            this Hampshire market town and its dedication to keeping tradition alive.
          </p>
        </div>
      </section>
    </motion.div>
  );
}