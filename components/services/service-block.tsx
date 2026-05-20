"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ServiceBlockProps {
  id: string
  title: string
  description: string
  features: string[]
  image: string
  reverse: boolean
  index: number
}

export function ServiceBlock({ id, title, description, features, reverse, index }: ServiceBlockProps) {
  return (
    <section id={id} className="py-12 lg:py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={reverse ? "lg:order-2" : ""}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-xs font-semibold text-primary">0{index + 1}</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              {title}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {description}
            </p>

            {/* Features list */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
                {"What's Included"}
              </h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button asChild className="group bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={reverse ? "lg:order-1" : ""}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-xl group">
              {/* Video element */}
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src={image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Gradient overlay */}
              <div className={`absolute inset-0 ${
                index === 0 ? "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" :
                index === 1 ? "bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent" :
                index === 2 ? "bg-gradient-to-br from-accent/20 via-accent/10 to-transparent" :
                "bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent"
              }`} />
              
              {/* Decorative frame */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
