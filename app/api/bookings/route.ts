import { NextResponse } from "next/server"
import { getSupabaseUser, supabaseDb } from "@/lib/supabase-rest"

function getCookie(request: Request, name: string) {
  return request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1]
}

async function authenticatedUser(request: Request) {
  const token = getCookie(request, "p63_access_token")
  if (!token) return null
  const user = await getSupabaseUser(token)
  return user ? { user, token } : null
}

export async function GET(request: Request) {
  const auth = await authenticatedUser(request)
  if (!auth) return NextResponse.json({ error: "Please sign in first" }, { status: 401 })

  const response = await supabaseDb(
    `/bookings?select=id,service_id,scheduled_start,scheduled_end,status,notes,created_at&user_id=eq.${auth.user.id}&order=scheduled_start.asc`,
    {},
    auth.token
  )
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function POST(request: Request) {
  const auth = await authenticatedUser(request)
  if (!auth) return NextResponse.json({ error: "Please sign in first" }, { status: 401 })

  const body = await request.json()
  const { serviceId, scheduledStart, notes } = body

  if (!serviceId || !scheduledStart) {
    return NextResponse.json({ error: "Service and schedule are required" }, { status: 400 })
  }

  const serviceResponse = await supabaseDb(
    `/services?select=id,title,duration_minutes&id=eq.${encodeURIComponent(serviceId)}&active=eq.true&limit=1`,
    {},
    auth.token
  )
  const services = await serviceResponse.json()
  if (!serviceResponse.ok || !services[0]) {
    return NextResponse.json({ error: "Selected service was not found" }, { status: 404 })
  }

  const start = new Date(scheduledStart)
  if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Choose a future date and time" }, { status: 400 })
  }

  const end = new Date(start.getTime() + Number(services[0].duration_minutes) * 60_000)

  const insertResponse = await supabaseDb("/bookings", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: auth.user.id,
      service_id: serviceId,
      scheduled_start: start.toISOString(),
      scheduled_end: end.toISOString(),
      notes: notes || null,
    }),
  }, auth.token)

  const data = await insertResponse.json()

  if (!insertResponse.ok) {
    const conflict = insertResponse.status === 409
    return NextResponse.json(
      { error: conflict ? "That time slot is already booked. Please choose another schedule." : "Unable to create booking", details: data },
      { status: conflict ? 409 : insertResponse.status }
    )
  }

  return NextResponse.json(data[0] || data, { status: 201 })
}
