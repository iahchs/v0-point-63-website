import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/services-store"

export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const formData = await request.formData(); const file = formData.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "Video file is required" }, { status: 400 })
  if (!file.type.startsWith("video/")) return NextResponse.json({ error: "Please upload a video file" }, { status: 400 })
  const blob = await put(`services/${crypto.randomUUID()}-${file.name}`, file, { access: "public", addRandomSuffix: false })
  return NextResponse.json({ url: blob.url })
}
