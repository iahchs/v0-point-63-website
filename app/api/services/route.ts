import { NextResponse } from "next/server"
import { supabaseDb } from "@/lib/supabase-rest"

const fallbackSelect = "id,title,description,features,video_url,price_note,sort_order,duration_minutes,active"

export async function GET() {
  const [servicesResponse, videosResponse] = await Promise.all([
    supabaseDb(`/services?select=${fallbackSelect}&active=eq.true&order=sort_order.asc`),
    supabaseDb("/site_videos?select=slot,title,video_url,thumbnail_url&order=slot.asc"),
  ])
  if (!servicesResponse.ok) return NextResponse.json({ error: "Unable to load services" }, { status: servicesResponse.status })
  const services = await servicesResponse.json()
  const videos = videosResponse.ok ? await videosResponse.json() : []
  const configured = new Map(videos.map((video: { slot: string; title: string; video_url: string; thumbnail_url: string | null }) => [video.slot, video]))
  return NextResponse.json(services.map((service: Record<string, unknown>) => {
    const video = configured.get(String(service.id))
    return video ? { ...service, title: video.title || service.title, video_url: video.video_url, thumbnail_url: video.thumbnail_url } : { ...service, thumbnail_url: null }
  }))
}
