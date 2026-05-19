import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { OurStory } from "@/components/about/our-story"
import { CoreValues } from "@/components/about/core-values"
import { TeamSection } from "@/components/about/team-section"
import { ProcessSection } from "@/components/about/process-section"

export const metadata = {
  title: "About Us | Point 63",
  description: "Learn about Point 63, a Manila-based multimedia production studio specializing in 3D, CGI, and visual storytelling. Meet our team of creative professionals.",
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <AboutHero />
        <OurStory />
        <CoreValues />
        <TeamSection />
        <ProcessSection />
      </main>
      <Footer />
    </>
  )
}
