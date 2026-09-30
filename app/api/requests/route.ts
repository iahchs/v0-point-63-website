import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getSupabaseUser, supabaseDb } from "@/lib/supabase-rest"
import { supabaseAdminDb } from "@/lib/supabase-admin"

const ADMIN_EMAIL = "contact.point63@gmail.com"
const SERVICE_IDS = new Set(["video-photo", "3d-graphics", "motion-graphics", "video-editing"])
const DURATIONS: Record<string, number> = { "video-photo": 120, "3d-graphics": 180, "motion-graphics": 120, "video-editing": 180 }

function text(value: unknown, max: number) { return typeof value === "string" ? value.trim().slice(0, max) : "" }
function email(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }
function cookie(request: Request, name: string) { return request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1] }
async function auth(request: Request) { const token = cookie(request, "p63_access_token"); if (!token) return null; const user = await getSupabaseUser(token); return user ? { token, user } : null }

export async function GET(request: Request) {
  const session = await auth(request)
  if (!session) return NextResponse.json({ error: "Please sign in first" }, { status: 401 })
  const response = await supabaseDb(`/requests?select=id,type,name,email,phone,status,scheduled_start,scheduled_end,budget,message,created_at,request_services(service_id)&type=eq.booking&user_id=eq.${encodeURIComponent(session.user.id)}&order=created_at.desc`, {}, session.token)
  return NextResponse.json(await response.json(), { status: response.status })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const type = body.type === "booking" ? "booking" : body.type === "inquiry" ? "inquiry" : ""
    const name = text(body.name, 120), emailAddress = text(body.email, 320), phone = text(body.phone, 40)
    const budget = text(body.budget, 120), message = text(body.message, 5000)
    const serviceIds = Array.isArray(body.serviceIds) ? [...new Set(body.serviceIds.filter((id: unknown): id is string => typeof id === "string"))] : []
    if (!type || !name || !emailAddress || !email(emailAddress) || !message || !serviceIds.length || serviceIds.some(id => !SERVICE_IDS.has(id))) return NextResponse.json({ error: "Complete the required fields and select at least one valid service." }, { status: 400 })
    const session = await auth(request)
    if (type === "booking" && !session) return NextResponse.json({ error: "Please sign in before booking." }, { status: 401 })
    const start = body.scheduledStart ? new Date(body.scheduledStart) : null
    if (type === "booking" && (!start || Number.isNaN(start.getTime()) || start.getTime() <= Date.now())) return NextResponse.json({ error: "Choose a future booking date and time." }, { status: 400 })
    const end = start ? new Date(start.getTime() + Math.max(...serviceIds.map(id => DURATIONS[id])) * 60000) : null
    const requestResponse = await supabaseAdminDb("/requests", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ user_id: session?.user.id ?? null, type, name, email: emailAddress, phone: phone || null, status: type === "booking" ? "pending" : "new", scheduled_start: start?.toISOString() ?? null, scheduled_end: end?.toISOString() ?? null, budget: budget || null, message }) })
    const saved = await requestResponse.json()
    if (!requestResponse.ok) return NextResponse.json({ error: requestResponse.status === 409 ? "One of those services is already booked for that time." : "Unable to save your request." }, { status: requestResponse.status >= 400 ? requestResponse.status : 500 })
    const savedRequest = Array.isArray(saved) ? saved[0] : saved
    const servicesResponse = await supabaseAdminDb(`/request_services`, { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(serviceIds.map(service_id => ({ request_id: savedRequest.id, service_id, scheduled_start: start?.toISOString() ?? null, scheduled_end: end?.toISOString() ?? null, status: type === "booking" ? "pending" : "new" }))) })
    if (!servicesResponse.ok) { await supabaseAdminDb(`/requests?id=eq.${savedRequest.id}`, { method: "DELETE" }); return NextResponse.json({ error: "Unable to save selected services." }, { status: 500 }) }
    if (process.env.RESEND_API_KEY) {
      try { await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.RESEND_FROM_EMAIL || "Point 63 <onboarding@resend.dev>", to: ADMIN_EMAIL, replyTo: emailAddress, subject: `New Point 63 ${type}: ${serviceIds.join(", ")}`, text: [`Type: ${type}`, `Name: ${name}`, `Email: ${emailAddress}`, `Phone: ${phone || "Not provided"}`, `Services: ${serviceIds.join(", ")}`, `Schedule: ${start?.toISOString() || "Not provided"}`, `Budget: ${budget || "Not provided"}`, "", message].join("\n") }) } catch (error) { console.error("[requests] Admin notification failed", error) }
    }
    return NextResponse.json({ success: true, request: { id: savedRequest.id, type, status: savedRequest.status, serviceIds, scheduledStart: start?.toISOString() ?? null, scheduledEnd: end?.toISOString() ?? null } }, { status: 201 })
  } catch { return NextResponse.json({ error: "Unable to submit your request." }, { status: 500 }) }
}

export async function PATCH(request: Request) {
  const session = await auth(request)
  if (!session) return NextResponse.json({ error: "Please sign in first" }, { status: 401 })
  const body = await request.json()
  const id = text(body.id, 80)
  const response = await supabaseDb(`/requests?id=eq.${encodeURIComponent(id)}&user_id=eq.${session.user.id}&type=eq.booking&status=eq.pending`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "cancelled" }) }, session.token)
  return NextResponse.json({ success: response.ok }, { status: response.ok ? 200 : response.status })
}
