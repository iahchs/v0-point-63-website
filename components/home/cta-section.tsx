"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Ready to Start?</span>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-6">
            {"Let's Create Something Amazing Together"}
          </h2>

          <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
            Whether you have a clear vision or need help shaping your idea, our team is ready to bring your project to life with creativity and precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl transition-all">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="border-2 text-white hover:opacity-90 transition-all"
              style={{ borderColor: '#8E5BBE', backgroundColor: '#8E5BBE' }}
            >
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
