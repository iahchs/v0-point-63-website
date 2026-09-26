import { createClient } from "@supabase/supabase-js"

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  videoUrl: string
  sortOrder: number
}

const supabase = createClient(
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const defaults: Service[] = [
  { id: "video-photo", title: "Video & Photo Shoot", description: "Professional video production and photography services for commercials, corporate videos, music videos, and creative content. We handle everything from concept to final delivery.", features: ["Commercial & Advertisement Production", "Corporate Video Production", "Music Video Production", "Product Photography", "Event Coverage", "Drone Videography"], videoUrl: "/Video-Shoot.mp4", sortOrder: 0 },
  { id: "3d-graphics", title: "3D Graphics", description: "Stunning 3D modeling, CGI, and visual effects that transform imagination into reality. From product visualization to full CGI environments, we create visuals that captivate.", features: ["3D Product Visualization", "CGI Environments", "Character Design & Animation", "Architectural Visualization", "Product Rendering", "VFX Integration"], videoUrl: "/3d graphics.mp4", sortOrder: 1 },
  { id: "motion-graphics", title: "Motion Graphics", description: "Dynamic motion design and animation that brings static content to life. We create engaging visual content that communicates your message with impact.", features: ["Logo Animation", "Explainer Videos", "Title Sequences", "Social Media Content", "Infographic Animation", "Broadcast Graphics"], videoUrl: "/motion.mp4", sortOrder: 2 },
  { id: "video-editing", title: "Video & Commercial Editing", description: "Expert post-production services that transform raw footage into polished, professional content. We handle editing, color grading, sound design, and final delivery.", features: ["Video Editing & Assembly", "Color Grading & Correction", "Sound Design & Mixing", "Visual Effects Compositing", "Format Conversion & Export", "Revision Management"], videoUrl: "/Commercial-editing.mp4", sortOrder: 3 },
]

function fromRow(row: Record<string, unknown>): Service {
  return { id: String(row.id), title: String(row.title), description: String(row.description), features: Array.isArray(row.features) ? row.features.map(String) : [], videoUrl: String(row.video_url), sortOrder: Number(row.sort_order) }
}

export async function getAllServices(): Promise<Service[]> {
  const { data, error } = await supabase.from("services").select("id,title,description,features,video_url,sort_order").order("sort_order", { ascending: true })
  if (error) throw new Error("Unable to load services")
  if (!data?.length) {
    const { data: seeded, error: seedError } = await supabase.from("services").upsert(defaults.map((service) => ({ id: service.id, title: service.title, description: service.description, features: service.features, video_url: service.videoUrl, sort_order: service.sortOrder }))).select("id,title,description,features,video_url,sort_order")
    if (seedError) throw new Error("Unable to seed services")
    return (seeded ?? []).map(fromRow).sort((a, b) => a.sortOrder - b.sortOrder)
  }
  return data.map(fromRow)
}

export async function createService(data: Omit<Service, "id">) {
  const service = { id: crypto.randomUUID(), ...data }
  const { data: row, error } = await supabase.from("services").insert({ id: service.id, title: service.title, description: service.description, features: service.features, video_url: service.videoUrl, sort_order: service.sortOrder }).select("id,title,description,features,video_url,sort_order").single()
  if (error) throw new Error("Unable to create service")
  return fromRow(row)
}

export async function updateService(id: string, data: Partial<Omit<Service, "id">>) {
  const update = { ...(data.title !== undefined ? { title: data.title } : {}), ...(data.description !== undefined ? { description: data.description } : {}), ...(data.features !== undefined ? { features: data.features } : {}), ...(data.videoUrl !== undefined ? { video_url: data.videoUrl } : {}), ...(data.sortOrder !== undefined ? { sort_order: data.sortOrder } : {}), updated_at: new Date().toISOString() }
  const { data: row, error } = await supabase.from("services").update(update).eq("id", id).select("id,title,description,features,video_url,sort_order").maybeSingle()
  if (error) throw new Error("Unable to update service")
  return row ? fromRow(row) : null
}

export async function deleteService(id: string) {
  const { data, error } = await supabase.from("services").delete().eq("id", id).select("id")
  if (error) throw new Error("Unable to delete service")
  return Boolean(data?.length)
}

export const isAdmin = (request: Request) => Boolean(request.headers.get("cookie")?.includes("admin_session="))

export async function getService(id: string) {
  const services = await getAllServices()
  return services.find((service) => service.id === id)
}
