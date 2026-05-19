"use client"

import { motion } from "framer-motion"
import { Target, Eye, Sparkles } from "lucide-react"

export function OurStory() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              Our Story
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              Crafting Visual Excellence Since <span className="text-gradient">2021</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Point 63 was founded with a singular mission: to push the boundaries of visual storytelling through innovative multimedia production. Based in Manila, Philippines, we&apos;ve grown into a full-service creative studio specializing in 3D graphics, CGI, video production, and motion design.
              </p>
              <p>
                Our team combines artistic vision with technical expertise, delivering content that not only meets but exceeds client expectations. We believe in the power of collaboration, working closely with brands and creators to bring their unique visions to life.
              </p>
              <p>
                From commercials to corporate content, from stunning 3D renders to dynamic motion graphics, Point 63 is your partner in creating visual content that resonates, engages, and inspires.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">50+</div>
                <p className="text-sm text-muted-foreground mt-1">Projects</p>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">20+</div>
                <p className="text-sm text-muted-foreground mt-1">Clients</p>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-primary">3</div>
                <p className="text-sm text-muted-foreground mt-1">Years</p>
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10">
              {/* Grid overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                  backgroundSize: "40px 40px"
                }}
              />

              {/* Floating cards */}
              <div className="absolute top-8 left-8 bg-card rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Our Mission</p>
                    <p className="text-xs text-muted-foreground">Visual Excellence</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 right-8 bg-card rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Our Vision</p>
                    <p className="text-xs text-muted-foreground">Global Creative Leader</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-card rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Based in</p>
                    <p className="text-xs text-muted-foreground">Manila, Philippines</p>
                  </div>
                </div>
              </div>

              {/* Center logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full w-28 h-28 flex items-center justify-center shadow-xl animate-pulse-glow">
                <span className="text-primary-foreground font-bold text-3xl">P63</span>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
