import { NextResponse } from "next/server"
import { isSupervisorAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

const statuses = new Set(["pending", "confirmed", "completed", "cancelled"])

export async function GET(request: Request) {
  if (!await isSupervisorAuthenticated(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const url = new URL(request.url)
  const query = new URLSearchParams({ select: "id,user_id,service_id,scheduled_start,scheduled_end,status,notes,created_at,services(title)", order: "scheduled_start.asc", limit: "250" })
  const service = url.searchParams.get("service")
  const status = url.searchParams.get("status")
  if (service && service !== "all") query.set("service_id", `eq.${service}`)
  if (status && status !== "all" && statuses.has(status)) query.set("status", `eq.${status}`)
  const response = await supabaseAdminDb(`/bookings?${query}`)
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PATCH(request: Request) {
  if (!await isSupervisorAuthenticated(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const body = await request.json().catch(() => ({}))
  if (typeof body.id !== "string" || !statuses.has(body.status)) return NextResponse.json({ error: "Invalid booking status" }, { status: 400 })
  const response = await supabaseAdminDb(`/bookings?id=eq.${encodeURIComponent(body.id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ status: body.status }) })
  return NextResponse.json(await response.json(), { status: response.status })
}

export const dynamic = "force-dynamic"
