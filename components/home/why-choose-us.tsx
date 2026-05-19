"use client"

import { motion } from "framer-motion"
import { Award, Zap, Users, Lightbulb } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Exceptional Quality",
    description: "We deliver production-ready content that meets the highest industry standards and exceeds expectations.",
  },
  {
    icon: Zap,
    title: "Efficient Workflow",
    description: "Our streamlined processes ensure timely delivery without compromising on quality or creativity.",
  },
  {
    icon: Users,
    title: "Collaborative Approach",
    description: "We work closely with you throughout the process, ensuring your vision is perfectly realized.",
  },
  {
    icon: Lightbulb,
    title: "Creative Innovation",
    description: "Our team stays ahead of trends, bringing fresh ideas and cutting-edge techniques to every project.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
            >
              Why Choose Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-bold tracking-tight mb-6"
            >
              We Create Stories That <span className="text-gradient">Captivate</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              With a passion for visual storytelling and technical expertise in multimedia production, Point 63 transforms your ideas into compelling content that resonates with your audience.
            </motion.p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10" />
              
              {/* Grid overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                  backgroundSize: "40px 40px"
                }}
              />

              {/* Content cards */}
              <div className="absolute top-8 left-8 bg-card rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">50+ Projects</p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 bg-card rounded-xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">20+ Clients</p>
                    <p className="text-xs text-muted-foreground">Worldwide</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full w-24 h-24 flex items-center justify-center shadow-xl animate-pulse-glow">
                <span className="text-primary-foreground font-bold text-2xl">P63</span>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
