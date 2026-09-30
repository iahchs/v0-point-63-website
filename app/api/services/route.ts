import { NextResponse } from "next/server"
import { supabaseDb } from "@/lib/supabase-rest"

const fallbackSelect = "id,title,description,features,video_url,price_note,sort_order,duration_minutes,active"

const fallbackServices = [
  {
    id: "video-photo",
    title: "Video & Photo Shoot",
    description: "Professional video production and photography services for commercials, corporate videos, music videos, and creative content. We handle everything from concept to final delivery.",
    features: ["Commercial & Advertisement Production", "Corporate Video Production", "Music Video Production", "Product Photography", "Event Coverage", "Drone Videography"],
    video_url: "/Video-Shoot.mp4",
    price_note: null,
    sort_order: 0,
    duration_minutes: 120,
    active: true,
  },
  {
    id: "3d-graphics",
    title: "3D Graphics",
    description: "Stunning 3D modeling, CGI, and visual effects that transform imagination into reality. From product visualization to full CGI environments, we create visuals that captivate.",
    features: ["3D Product Visualization", "CGI Environments", "Character Design & Animation", "Architectural Visualization", "Product Rendering", "VFX Integration"],
    video_url: "/3d graphics.mp4",
    price_note: null,
    sort_order: 1,
    duration_minutes: 180,
    active: true,
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    description: "Dynamic motion design and animation that brings static content to life. We create engaging visual content that communicates your message with impact.",
    features: ["Logo Animation", "Explainer Videos", "Title Sequences", "Social Media Content", "Infographic Animation", "Broadcast Graphics"],
    video_url: "/motion.mp4",
    price_note: null,
    sort_order: 2,
    duration_minutes: 120,
    active: true,
  },
  {
    id: "video-editing",
    title: "Video & Commercial Editing",
    description: "Expert post-production services that transform raw footage into polished, professional content. We handle editing, color grading, sound design, and final delivery.",
    features: ["Video Editing & Assembly", "Color Grading & Correction", "Sound Design & Mixing", "Visual Effects Compositing", "Format Conversion & Export", "Revision Management"],
    video_url: "/Commercial-editing.mp4",
    price_note: null,
    sort_order: 3,
    duration_minutes: 180,
    active: true,
  },
]

export async function GET() {
  const [servicesResponse, videosResponse] = await Promise.all([
    supabaseDb(`/services?select=${fallbackSelect}&active=eq.true&order=sort_order.asc`),
    supabaseDb("/site_videos?select=slot,title,video_url,thumbnail_url&order=slot.asc"),
  ])
  const services = servicesResponse.ok
    ? (await servicesResponse.json()) as Array<Record<string, unknown>>
    : fallbackServices

  const videos = videosResponse.ok
    ? (await videosResponse.json()) as Array<{ slot: string; title: string; video_url: string; thumbnail_url: string | null }>
    : []
  const configured = new Map(videos.map((video) => [video.slot, video]))
  return NextResponse.json(services.map((service) => {
    const video = configured.get(String(service.id))
    return video ? { ...service, title: video.title || service.title, video_url: video.video_url, thumbnail_url: video.thumbnail_url } : { ...service, thumbnail_url: null }
  }))
}
