"use client"

import { motion } from "framer-motion"
import { Award, Heart, Users, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for the highest quality in everything we create, pushing boundaries and exceeding expectations.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We love what we do. Our passion for visual storytelling drives us to create work that truly resonates.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We believe the best work comes from working together, both within our team and with our clients.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly explore new techniques, technologies, and creative approaches to stay ahead of the curve.",
    color: "bg-primary/10 text-primary",
  },
]

export function CoreValues() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            What Drives Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
          >
            Our Core Values
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            These principles guide everything we do, from how we approach projects to how we treat our clients and each other.
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full text-center group hover:shadow-lg transition-all duration-300 border-border/50 bg-card hover:border-primary/30">
                <CardContent className="p-6 lg:p-8">
                  <div className={`w-16 h-16 rounded-2xl ${value.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
