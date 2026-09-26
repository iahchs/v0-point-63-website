import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import { ServiceBlock } from "@/components/services/service-block"
import { CTASection } from "@/components/home/cta-section"
import { getAllServices } from "@/lib/services-store"

export const metadata = {
  title: "Our Services | Point 63",
  description: "Explore Point 63's comprehensive multimedia production services including video production, 3D graphics, motion graphics, and post-production.",
}

export default async function ServicesPage() {
  const services = (await getAllServices()).map((service, index) => ({ ...service, image: service.videoUrl, reverse: index % 2 === 1 }))
  return (
    <>
      <Navigation />
      <main>
        <ServicesHero />
        <div className="py-12 lg:py-20 bg-card">
          {services.map((service, index) => (
            <ServiceBlock key={service.id} {...service} index={index} />
          ))}
        </div>
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
