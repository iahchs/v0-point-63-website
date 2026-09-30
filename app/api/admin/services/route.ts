import { NextResponse } from "next/server"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

const serviceIds = new Set(["video-photo", "3d-graphics", "motion-graphics", "video-editing"])
const select = "id,title,description,features,video_url,price_note,sort_order,duration_minutes,active"

async function requireAdmin(request: Request) {
  return (await isAdminAuthenticated(request)) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: Request) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const response = await supabaseAdminDb(`/services?select=${select}&order=sort_order.asc`)
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PATCH(request: Request) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const body = await request.json()
  if (typeof body.id !== "string" || !serviceIds.has(body.id)) {
    return NextResponse.json({ error: "Service cannot be changed" }, { status: 400 })
  }

  const update = Object.fromEntries(
    Object.entries({
      title: body.title,
      description: body.description,
      features: body.features,
      price_note: body.price_note,
      video_url: body.video_url,
      sort_order: body.sort_order,
      active: body.active,
    }).filter(([, value]) => value !== undefined),
  )
  if (typeof update.title !== "string" || !update.title.trim() || typeof update.description !== "string") {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
  }
  if (!Array.isArray(update.features) || !update.features.every((item) => typeof item === "string")) {
    return NextResponse.json({ error: "Features must be a list" }, { status: 400 })
  }
  if (typeof update.sort_order !== "number" || !Number.isInteger(update.sort_order) || typeof update.active !== "boolean") {
    return NextResponse.json({ error: "Sort order and active status are required" }, { status: 400 })
  }

  const response = await supabaseAdminDb(`/services?id=eq.${encodeURIComponent(body.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(update),
  })
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
