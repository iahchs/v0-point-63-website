import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServicesHero } from "@/components/services/services-hero"
import { ServiceBlock } from "@/components/services/service-block"
import { CTASection } from "@/components/home/cta-section"

export const metadata = {
  title: "Our Services | Point 63",
  description: "Explore Point 63's comprehensive multimedia production services including video production, 3D graphics, motion graphics, and post-production.",
}

const services = [
  {
    id: "video-photo",
    title: "Video & Photo Shoot",
    description: "Professional video production and photography services for commercials, corporate videos, music videos, and creative content. We handle everything from concept to final delivery.",
    features: [
      "Commercial & Advertisement Production",
      "Corporate Video Production",
      "Music Video Production",
      "Product Photography",
      "Event Coverage",
      "Drone Videography",
    ],
    image: "/Video-Shoot.mp4",
    reverse: false,
  },
  {
    id: "3d-graphics",
    title: "3D Graphics",
    description: "Stunning 3D modeling, CGI, and visual effects that transform imagination into reality. From product visualization to full CGI environments, we create visuals that captivate.",
    features: [
      "3D Product Visualization",
      "CGI Environments",
      "Character Design & Animation",
      "Architectural Visualization",
      "Product Rendering",
      "VFX Integration",
    ],
    image: "/3d graphics.mp4",
    reverse: true,
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    description: "Dynamic motion design and animation that brings static content to life. We create engaging visual content that communicates your message with impact.",
    features: [
      "Logo Animation",
      "Explainer Videos",
      "Title Sequences",
      "Social Media Content",
      "Infographic Animation",
      "Broadcast Graphics",
    ],
    image: "/motion.mp4",
    reverse: false,
  },
  {
    id: "video-editing",
    title: "Video & Commercial Editing",
    description: "Expert post-production services that transform raw footage into polished, professional content. We handle editing, color grading, sound design, and final delivery.",
    features: [
      "Video Editing & Assembly",
      "Color Grading & Correction",
      "Sound Design & Mixing",
      "Visual Effects Compositing",
      "Format Conversion & Export",
      "Revision Management",
    ],
    image: "/Commercial-editing.mp4",
    reverse: true,
  },
]

export default function ServicesPage() {
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
