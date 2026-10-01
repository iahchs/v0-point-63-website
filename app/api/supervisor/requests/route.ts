import { NextResponse } from "next/server"
import { isSupervisorAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  const auth = await isSupervisorAuthenticated(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const url = new URL(request.url)
  const params = new URLSearchParams({ select: "*,request_services(*),crm_notes(*),request_replies(*),request_activity(*)", order: "created_at.desc" })
  const search = url.searchParams.get("search")?.trim()
  const status = url.searchParams.get("status")
  if (status) params.set("status", `eq.${status}`)
  if (search) params.set("or", `(name.ilike.*${search}*,email.ilike.*${search}*)`)
  const response = await supabaseAdminDb(`/requests?${params}`)
  if (!response.ok) return NextResponse.json({ error: "Unable to load requests" }, { status: 500 })
  return NextResponse.json(await response.json())
}

export async function PATCH(request: Request) {
  const auth = await isSupervisorAuthenticated(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const body = await request.json()
  if (!body.id || !body.status) return NextResponse.json({ error: "id and status are required" }, { status: 400 })
  const response = await supabaseAdminDb(`/requests?id=eq.${encodeURIComponent(body.id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ status: body.status, updated_at: new Date().toISOString() }) })
  if (!response.ok) return NextResponse.json({ error: "Unable to update request" }, { status: 500 })
  return NextResponse.json((await response.json())[0] || null)
}

export async function POST(request: Request) {
  const auth = await isSupervisorAuthenticated(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const body = await request.json()
  if (!body.request_id || !body.note?.trim()) return NextResponse.json({ error: "request_id and note are required" }, { status: 400 })
  const response = await supabaseAdminDb("/crm_notes", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ request_id: body.request_id, author_id: auth.user.id, note: body.note.trim() }) })
  if (!response.ok) return NextResponse.json({ error: "Unable to save note" }, { status: 500 })
  return NextResponse.json((await response.json())[0])
}
