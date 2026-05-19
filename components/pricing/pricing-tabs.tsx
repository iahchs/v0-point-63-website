"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

const packages = [
  {
    name: "Basic",
    description: "Perfect for small projects and startups",
    price: "Starting at PHP 75,000",
    features: [
      "Single video production (up to 2 min)",
      "Basic 3D graphics package",
      "2 rounds of revisions",
      "HD delivery format",
      "5 business days turnaround",
      "Email support",
    ],
    popular: false,
    color: "border-border",
  },
  {
    name: "Professional",
    description: "Ideal for growing brands and campaigns",
    price: "Starting at PHP 200,000",
    features: [
      "Multi-video production (up to 5 min each)",
      "Advanced 3D/CGI package",
      "Motion graphics included",
      "3 rounds of revisions",
      "4K delivery format",
      "Priority support",
      "10 business days turnaround",
      "Raw footage included",
    ],
    popular: true,
    color: "border-primary",
  },
  {
    name: "Premium",
    description: "Full-scale production for enterprise",
    price: "Custom Quote",
    features: [
      "Unlimited video production",
      "Full 3D/CGI & VFX suite",
      "Complete motion graphics",
      "Unlimited revisions",
      "All delivery formats",
      "Dedicated project manager",
      "Priority turnaround",
      "Source files included",
      "On-site production available",
    ],
    popular: false,
    color: "border-border",
  },
]

const alaCarteServices = [
  {
    category: "Video Production",
    services: [
      { name: "Commercial/Ad Production", price: "From PHP 90,000" },
      { name: "Corporate Video", price: "From PHP 60,000" },
      { name: "Music Video", price: "From PHP 75,000" },
      { name: "Event Coverage", price: "From PHP 45,000" },
      { name: "Drone Footage", price: "From PHP 24,000" },
    ],
  },
  {
    category: "3D & CGI",
    services: [
      { name: "Product Visualization", price: "From PHP 45,000" },
      { name: "3D Environment", price: "From PHP 90,000" },
      { name: "Character Design", price: "From PHP 75,000" },
      { name: "Architectural Render", price: "From PHP 60,000" },
      { name: "VFX Integration", price: "From PHP 30,000" },
    ],
  },
  {
    category: "Motion & Editing",
    services: [
      { name: "Logo Animation", price: "From PHP 15,000" },
      { name: "Explainer Video", price: "From PHP 45,000" },
      { name: "Video Editing (per min)", price: "From PHP 6,000" },
      { name: "Color Grading", price: "From PHP 9,000" },
      { name: "Sound Design", price: "From PHP 12,000" },
    ],
  },
]

export function PricingTabs() {
  const [activeTab, setActiveTab] = useState<"packages" | "alacarte">("packages")

  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 rounded-full bg-muted border border-border">
            <button
              onClick={() => setActiveTab("packages")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "packages"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Package Plans
            </button>
            <button
              onClick={() => setActiveTab("alacarte")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                activeTab === "alacarte"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              À La Carte
            </button>
          </div>
        </div>

        {/* Package Plans */}
        {activeTab === "packages" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {packages.map((pkg, index) => (
              <Card
                key={pkg.name}
                className={cn(
                  "relative h-full transition-all duration-300 hover:shadow-xl",
                  pkg.popular ? "border-2 border-primary shadow-lg scale-105 lg:scale-110 z-10" : "border-border"
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      <Star className="w-3 h-3 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">{pkg.price}</div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={cn(
                      "w-full",
                      pkg.popular
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* À La Carte Services */}
        {activeTab === "alacarte" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {alaCarteServices.map((category) => (
              <Card key={category.category} className="h-full border-border">
                <CardHeader>
                  <h3 className="text-xl font-bold text-primary">{category.category}</h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4">
                    {category.services.map((service) => (
                      <li key={service.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <span className="text-sm text-foreground">{service.name}</span>
                        <span className="text-sm font-semibold text-primary">{service.price}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          All prices are starting rates. Final pricing depends on project scope and requirements.{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact us
          </Link>{" "}
          for a custom quote.
        </p>
      </div>
    </section>
  )
}
