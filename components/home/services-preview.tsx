"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Video, Box, Wand2, Film } from "lucide-react"
import { motion } from "framer-motion"

const services = [
  {
    icon: Video,
    title: "Video & Photo Shoot",
    description: "Professional video production and photography for commercials, corporate content, and creative projects.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Box,
    title: "3D Graphics",
    description: "Stunning 3D modeling, CGI, and visual effects that bring impossible concepts to reality.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Wand2,
    title: "Motion Graphics",
    description: "Dynamic animations and motion design that captivate audiences and communicate your message.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Film,
    title: "Video & Commercial Editing",
    description: "Expert post-production and editing services that transform raw footage into polished masterpieces.",
    color: "bg-primary/10 text-primary",
  },
]

export function ServicesPreview() {
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
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            From concept to final delivery, we provide comprehensive multimedia production services tailored to your vision.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-border/50 bg-card hover:border-primary/30">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="group">
            <Link href="/services">
              Explore All Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
