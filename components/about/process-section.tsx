"use client"

import { motion } from "framer-motion"
import { FileText, Video, Wand2 } from "lucide-react"

const process = [
  {
    step: "01",
    icon: FileText,
    title: "Pre-Production",
    description: "We start with understanding your vision, developing concepts, storyboarding, and planning every detail of your project.",
    items: ["Concept Development", "Scriptwriting", "Storyboarding", "Project Planning"],
  },
  {
    step: "02",
    icon: Video,
    title: "Production",
    description: "Our expert team brings the plan to life through professional filming, 3D modeling, and content creation.",
    items: ["Video Shooting", "3D Modeling", "Motion Capture", "Asset Creation"],
  },
  {
    step: "03",
    icon: Wand2,
    title: "Post-Production",
    description: "We polish every frame with expert editing, visual effects, color grading, and sound design.",
    items: ["Video Editing", "VFX & Compositing", "Color Grading", "Sound Design"],
  },
]

export function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            How We Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-background"
          >
            Our Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-background/70"
          >
            A streamlined workflow designed to bring your vision to life efficiently and effectively.
          </motion.p>
        </div>

        {/* Process Steps */}
        <div className="grid lg:grid-cols-3 gap-8">
          {process.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line for desktop */}
              {index < process.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2 z-0" />
              )}

              <div className="relative bg-background/5 rounded-2xl p-8 border border-background/10 hover:border-primary/30 transition-colors group">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="text-5xl font-bold text-background/20 group-hover:text-primary/30 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-background mb-3">
                  {item.title}
                </h3>
                <p className="text-background/70 leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Items list */}
                <ul className="space-y-2">
                  {item.items.map((listItem) => (
                    <li key={listItem} className="flex items-center gap-2 text-sm text-background/60">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {listItem}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
