import { NextResponse } from "next/server"
import { Resend } from "resend"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

const inquirySelect = "id,name,email,phone,budget,message,status,created_at,updated_at"
const allowedStatuses = new Set(["new", "pending", "confirmed", "replied", "completed", "cancelled", "closed"])

export async function GET(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const url = new URL(request.url)
  const status = url.searchParams.get("status")
  const query = new URLSearchParams({ select: inquirySelect, type: "eq.inquiry", order: "created_at.desc", limit: "1000" })
  if (status && allowedStatuses.has(status)) query.set("status", `eq.${status}`)

  const response = await supabaseAdminDb(`/requests_decrypted?${query.toString()}`)
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PATCH(request: Request) {
  const admin = await isAdminAuthenticated(request)
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""
    const status = typeof body.status === "string" ? body.status : ""
    const reply = typeof body.reply === "string" ? body.reply.trim().slice(0, 10000) : ""
    if (!id) return NextResponse.json({ error: "Inquiry id is required." }, { status: 400 })

    const lookup = await supabaseAdminDb(`/requests?select=id,name,email,service_ids:request_services(service_id)&id=eq.${encodeURIComponent(id)}&type=eq.inquiry&limit=1`)
    const rows = await lookup.json()
    const inquiry = rows[0]
    if (!lookup.ok || !inquiry) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 })

    if (reply) {
      const key = process.env.RESEND_API_KEY
      if (!key) return NextResponse.json({ error: "Email service is not configured." }, { status: 503 })
      const sent = await new Resend(key).emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Point 63 <onboarding@resend.dev>",
        to: inquiry.email,
        replyTo: "contact.point63@gmail.com",
        subject: "Re: Your Point 63 Inquiry",
        text: reply,
      })
      if (sent.error) return NextResponse.json({ error: "Unable to send the reply email." }, { status: 502 })
      const update = await supabaseAdminDb(`/requests?id=eq.${encodeURIComponent(id)}&type=eq.inquiry`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ status: "replied", updated_at: new Date().toISOString() }),
      })
      const data = await update.json()
      return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: update.status })
    }

    if (!allowedStatuses.has(status)) return NextResponse.json({ error: "Provide a valid status or reply." }, { status: 400 })
    const update = await supabaseAdminDb(`/requests?id=eq.${encodeURIComponent(id)}&type=eq.inquiry`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    })
    const data = await update.json()
    return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: update.status })
  } catch (error) {
    console.error("[admin/inquiries] failed:", error)
    return NextResponse.json({ error: "Unable to update inquiry." }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
