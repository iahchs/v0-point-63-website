import fs from "fs"
import path from "path"

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  videoUrl: string
  sortOrder: number
}

const DATA_PATH = process.env.DATA_PATH || path.join(process.cwd(), "data", "services.json")

const defaultServices: Service[] = [
  { id: "video-photo", title: "Video & Photo Shoot", description: "Professional video production and photography services for commercials, corporate videos, music videos, and creative content. We handle everything from concept to final delivery.", features: ["Commercial & Advertisement Production", "Corporate Video Production", "Music Video Production", "Product Photography", "Event Coverage", "Drone Videography"], videoUrl: "/Video-Shoot.mp4", sortOrder: 0 },
  { id: "3d-graphics", title: "3D Graphics", description: "Stunning 3D modeling, CGI, and visual effects that transform imagination into reality. From product visualization to full CGI environments, we create visuals that captivate.", features: ["3D Product Visualization", "CGI Environments", "Character Design & Animation", "Architectural Visualization", "Product Rendering", "VFX Integration"], videoUrl: "/3d graphics.mp4", sortOrder: 1 },
  { id: "motion-graphics", title: "Motion Graphics", description: "Dynamic motion design and animation that brings static content to life. We create engaging visual content that communicates your message with impact.", features: ["Logo Animation", "Explainer Videos", "Title Sequences", "Social Media Content", "Infographic Animation", "Broadcast Graphics"], videoUrl: "/motion.mp4", sortOrder: 2 },
  { id: "video-editing", title: "Video & Commercial Editing", description: "Expert post-production services that transform raw footage into polished, professional content. We handle editing, color grading, sound design, and final delivery.", features: ["Video Editing & Assembly", "Color Grading & Correction", "Sound Design & Mixing", "Visual Effects Compositing", "Format Conversion & Export", "Revision Management"], videoUrl: "/Commercial-editing.mp4", sortOrder: 3 },
]

let cache: Service[] | null = null
function load(): Service[] {
  if (cache) return cache
  try {
    if (fs.existsSync(DATA_PATH)) cache = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"))
  } catch (error) { console.error("Error loading services:", error) }
  if (!cache) { cache = defaultServices; save(cache) }
  return cache
}
function save(services: Service[]) {
  try { fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true }); fs.writeFileSync(DATA_PATH, JSON.stringify(services, null, 2)); cache = services } catch (error) { console.error("Error saving services:", error) }
}
export function getAllServices() { return [...load()].sort((a, b) => a.sortOrder - b.sortOrder) }
export function createService(data: Omit<Service, "id">) { const service = { ...data, id: crypto.randomUUID() }; save([...load(), service]); return service }
export function updateService(id: string, data: Partial<Omit<Service, "id">>) { const services = load(); const index = services.findIndex((service) => service.id === id); if (index < 0) return null; services[index] = { ...services[index], ...data }; save(services); return services[index] }
export function deleteService(id: string) { const next = load().filter((service) => service.id !== id); if (next.length === load().length) return false; save(next); return true }
export function getService(id: string) { return load().find((service) => service.id === id) }
const isAdmin = (request: Request) => Boolean(request.headers.get("cookie")?.includes("admin_session="))
export { isAdmin }
