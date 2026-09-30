import { NextResponse } from "next/server"
import { Resend } from "resend"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const response = await supabaseAdminDb("/inquiries?select=id,name,email,phone,service,budget,message,status,admin_reply,replied_at,created_at&order=created_at.desc")
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function PATCH(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  try {
    const body = await request.json()
    const id = typeof body.id === "string" ? body.id : ""
    const status = typeof body.status === "string" ? body.status : ""
    const reply = typeof body.reply === "string" ? body.reply.trim().slice(0, 10000) : ""
    if (!id) return NextResponse.json({ error: "Inquiry id is required." }, { status: 400 })

    const lookup = await supabaseAdminDb(`/inquiries?select=id,name,email,service& id=eq.${encodeURIComponent(id)}&limit=1`.replace("?select=id,name,email,service& id","?select=id,name,email,service&id"))
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
        subject: `Re: Your Point 63 Inquiry - ${inquiry.service}`,
        text: reply,
      })
      if (sent.error) return NextResponse.json({ error: "Unable to send the reply email." }, { status: 502 })

      const update = await supabaseAdminDb(`/inquiries?id=eq.${encodeURIComponent(id)}`, {
        method:"PATCH", headers:{Prefer:"return=representation"},
        body:JSON.stringify({admin_reply:reply,status:"replied",replied_at:new Date().toISOString()})
      })
      const data=await update.json()
      return NextResponse.json(Array.isArray(data)?data[0]:data,{status:update.status})
    }

    if (!["new","read","replied","closed"].includes(status)) return NextResponse.json({error:"Provide a valid status or reply."},{status:400})
    const update=await supabaseAdminDb(`/inquiries?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({status})})
    const data=await update.json()
    return NextResponse.json(Array.isArray(data)?data[0]:data,{status:update.status})
  } catch {
    return NextResponse.json({error:"Unable to update inquiry."},{status:500})
  }
}
