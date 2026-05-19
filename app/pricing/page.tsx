import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PricingHero } from "@/components/pricing/pricing-hero"
import { PricingTabs } from "@/components/pricing/pricing-tabs"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { CTASection } from "@/components/home/cta-section"

export const metadata = {
  title: "Pricing | Point 63",
  description: "Transparent pricing for Point 63's multimedia production services. Choose from package plans or à la carte services tailored to your needs.",
}

export default function PricingPage() {
  return (
    <>
      <Navigation />
      <main>
        <PricingHero />
        <PricingTabs />
        <PricingFAQ />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
