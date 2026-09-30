import { NextResponse } from "next/server"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

const MAX_VIDEO = 100 * 1024 * 1024
const MAX_THUMBNAIL = 10 * 1024 * 1024
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"])
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"])

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const data = await request.formData(); const file = data.get("file"); const kind = data.get("kind")
  if (!(file instanceof File) || (kind !== "video" && kind !== "thumbnail")) return NextResponse.json({ error: "A supported file is required" }, { status: 400 })
  const allowed = kind === "video" ? videoTypes : imageTypes; const max = kind === "video" ? MAX_VIDEO : MAX_THUMBNAIL
  if (!allowed.has(file.type) || file.size > max) return NextResponse.json({ error: kind === "video" ? "Video must be MP4, WebM, or MOV under 100 MB" : "Thumbnail must be JPG, PNG, or WebP under 10 MB" }, { status: 400 })
  const path = `${kind}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
  const response = await supabaseAdminDb(`/storage/v1/object/site-videos/${path}`, { method: "POST", headers: { "Content-Type": file.type, "x-upsert": "false" }, body: file })
  if (!response.ok) return NextResponse.json({ error: "Upload failed" }, { status: response.status })
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return NextResponse.json({ url: `${base}/storage/v1/object/public/site-videos/${path}` })
}
