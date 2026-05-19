import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { ServicesPreview } from "@/components/home/services-preview"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { TrustedReviews } from "@/components/home/trusted-reviews"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesPreview />
        <WhyChooseUs />
        <TrustedReviews />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
