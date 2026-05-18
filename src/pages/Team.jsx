import { motion } from "framer-motion";
import { Mail, Heart } from "lucide-react";

const TEAM = [
{
  name: "Ben Salsbury",
  role: "Carnival Chair",
  bio: "Ben has been involved with Carnival for a while now, leading the team with his brilliant and insightful ideas. Ben is our carnival chair, leading the way and bringing together all skillsets to make Carnival happen!",
  avatar: "https://ss.charleymurphy.xyz/Ben_Salsbury_headshot.jpg?w=200&q=80",
  email: ""
},
{
  name: "Dan Searley",
  role: "Event Director",
  bio: "Dan co-ordinates everything infrastructure, from fencing to toilets, and everything inbetween!",
  avatar: "https://ss.charleymurphy.xyz/Dan-headshotjpg.jpg?w=200&q=80",
  email: ""
},
{
  name: "Helen Graves",
  role: "Events & Entertainment",
  bio: "Helen books all performers and manages the main stage, making sure the entertainment is top-class every single year.",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  email: "events@ringwoodcarnival.org"
},
{
  name: "Tom Ashford",
  role: "Treasurer",
  bio: "Tom keeps the finances in order, making sure every penny raised goes back into making the carnival bigger and better.",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  email: "treasurer@ringwoodcarnival.org"
},
{
  name: "Claire Bennett",
  role: "Volunteer Coordinator",
  bio: "Claire manages our army of 120+ volunteers who make the whole event possible. She is the unsung hero of carnival day.",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  email: "volunteers@ringwoodcarnival.org"
},
{
  name: "David Park",
  role: "Safety Officer",
  bio: "David ensures every aspect of the event meets safety regulations, liaising with Hampshire Constabulary and First Aid teams.",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  email: "safety@ringwoodcarnival.org"
}];


export default function Team() {
  return (
    <div className="min-h-screen">
      {/* Header */}
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

      <div className="px-6 md:px-12 py-8 pb-32">
        <div className="flex items-center gap-2 mb-6 bg-secondary/10 rounded-xl p-4 border border-secondary/20">
          <Heart className="w-4 h-4 text-secondary flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Ringwood Carnival is run entirely by volunteers. If you'd like to get involved, please get in touch!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEAM.map((member, i) =>
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card rounded-2xl border border-border p-5 flex gap-4">
            
              <img
              src={member.avatar}
              alt={member.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
            
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-foreground">{member.name}</h3>
                <p className="text-secondary text-xs font-semibold mb-2 font-heading">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">{member.bio}</p>
                





              
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}