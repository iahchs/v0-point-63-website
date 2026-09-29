"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import { ServiceBlock } from "@/components/services/service-block"
import { CTASection } from "@/components/home/cta-section"

type Service = {
  id: string
  title: string
  description: string
  features: string[]
  video_url: string
  sort_order: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/services")
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Unable to load services")
        return data
      })
      .then(setServices)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load services"))
  }, [])

  return (
    <>
      <Navigation />
      <main>
        <ServicesHero />
        <div className="py-12 lg:py-20 bg-card">
          {error ? (
            <p className="mx-auto max-w-7xl px-4 text-center text-destructive">{error}</p>
          ) : services.length === 0 ? (
            <p className="mx-auto max-w-7xl px-4 text-center text-muted-foreground">Loading services...</p>
          ) : (
            services.map((service, index) => (
              <ServiceBlock
                key={service.id}
                {...service}
                image={service.video_url}
                reverse={index % 2 === 1}
                index={index}
              />
            ))
          )}
        </div>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
