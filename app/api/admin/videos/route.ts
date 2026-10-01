import { NextResponse } from "next/server"
import { supabaseAdminDb, isAdminAuthenticated } from "@/lib/supabase-admin"

const select = "id,slot,title,video_url,thumbnail_url,updated_at"

async function guard(request: Request) {
  return (await isAdminAuthenticated(request))
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: Request) {
  const denied = await guard(request)
  if (denied) return denied

  const response = await supabaseAdminDb(`/site_videos?select=${select}&order=slot.asc`)

  // site_videos is optional until its migration has been applied. Keep the
  // admin page usable and let public services continue using services.video_url.
  if (response.status === 404) return NextResponse.json([])

  return NextResponse.json(await response.json(), { status: response.status })
}

export async function PATCH(request: Request) {
  const denied = await guard(request)
  if (denied) return denied

  const body = await request.json()
  if (
    typeof body.id !== "string" ||
    typeof body.slot !== "string" ||
    typeof body.title !== "string" ||
    typeof body.video_url !== "string" ||
    !body.title.trim() ||
    !/^https?:\/\//i.test(body.video_url)
  ) {
    return NextResponse.json({ error: "Invalid video details" }, { status: 400 })
  }

  const thumbnail = body.thumbnail_url === null || body.thumbnail_url === "" ? null : body.thumbnail_url
  if (thumbnail !== null && (typeof thumbnail !== "string" || !/^https?:\/\//i.test(thumbnail))) {
    return NextResponse.json({ error: "Thumbnail URL must be valid" }, { status: 400 })
  }

  const response = await supabaseAdminDb(`/site_videos?id=eq.${encodeURIComponent(body.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      slot: body.slot,
      title: body.title.trim(),
      video_url: body.video_url,
      thumbnail_url: thumbnail,
    }),
  })

  if (response.status === 404) {
    return NextResponse.json({ error: "Site videos are not configured yet" }, { status: 503 })
  }

  return NextResponse.json(await response.json(), { status: response.status })
}
