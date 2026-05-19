"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Instagram } from "lucide-react"

const team = [
  {
    name: "Kyle Chua",
    role: "Managing Director, Co-Founder",
    description: "Leads the strategic vision and business operations of Point 63, ensuring every project delivers excellence.",
    initials: "KC",
    color: "bg-primary",
  },
  {
    name: "Miggy Montemayor",
    role: "Head of 3D/VFX, Co-Founder",
    description: "Spearheads all 3D and visual effects work, bringing impossible concepts to stunning reality.",
    initials: "MM",
    color: "bg-secondary",
  },
  {
    name: "Joshua Tatel",
    role: "Head of Video, Co-Founder",
    description: "Oversees video production, ensuring cinematic quality and compelling storytelling in every project.",
    initials: "JT",
    color: "bg-accent",
  },
  {
    name: "Chelsea Engo",
    role: "Producer, Co-Founder",
    description: "Manages project timelines and client relationships, keeping productions running smoothly.",
    initials: "CE",
    color: "bg-primary",
  },
  {
    name: "Lloyd Basilla",
    role: "VFX Artist",
    description: "Creates stunning visual effects that enhance and transform footage into visual masterpieces.",
    initials: "LB",
    color: "bg-secondary",
  },
  {
    name: "Jeff De Guzman",
    role: "Graphic Artist / Illustrator",
    description: "Brings creative concepts to life through illustration and graphic design expertise.",
    initials: "JD",
    color: "bg-accent",
  },
  {
    name: "Emman Tangunan",
    role: "In-house DOP",
    description: "Captures stunning visuals as our Director of Photography, setting the visual tone for productions.",
    initials: "ET",
    color: "bg-primary",
  },
  {
    name: "Jairus Tablanza",
    role: "In-house Video Editor",
    description: "Crafts compelling narratives through expert editing, bringing raw footage to polished final cuts.",
    initials: "JT",
    color: "bg-secondary",
  },
]

export function TeamSection() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            The Creative Force
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
          >
            Meet the Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Our talented team of creatives, technicians, and storytellers who make the magic happen.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-border/50 bg-muted/30 hover:border-primary/30 overflow-hidden">
                <CardContent className="p-0">
                  {/* Avatar/Image placeholder */}
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-24 h-24 rounded-full ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <span className="text-white font-bold text-2xl">{member.initials}</span>
                      </div>
                    </div>
                    
                    {/* Hover overlay with social links */}
                    <div className="absolute inset-0 bg-secondary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary transition-colors">
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-primary transition-colors">
                        <Instagram className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
