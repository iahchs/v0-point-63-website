import { NextResponse } from "next/server"
import { supabaseDb } from "@/lib/supabase-rest"
import { Resend } from "resend"

const ADMIN_EMAIL = "contact.point63@gmail.com"

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : ""
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = clean(body.name, 120)
    const email = clean(body.email, 320)
    const phone = clean(body.phone, 40)
    const service = clean(body.service, 120)
    const budget = clean(body.budget, 120)
    const message = clean(body.message, 5000)

    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: "Name, email, service, and message are required." }, { status: 400 })
    }
    if (!validEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
    }

    const insertResponse = await supabaseDb("/inquiries", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ name, email, phone: phone || null, service, budget: budget || null, message }),
    })
    const inquiry = await insertResponse.json()

    if (!insertResponse.ok) {
      return NextResponse.json({ error: "Unable to save your inquiry.", details: inquiry }, { status: 500 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      try {
        const resend = new Resend(apiKey)
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Point 63 <onboarding@resend.dev>",
          to: ADMIN_EMAIL,
          replyTo: email,
          subject: `New Point 63 Inquiry: ${service}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not provided"}`,
            `Service: ${service}`,
            `Budget: ${budget || "Not provided"}`,
            "",
            "Message:",
            message,
          ].join("\n"),
        })
      } catch (error) {
        console.error("[contact] Admin notification failed:", error)
      }
    }

    return NextResponse.json({ success: true, inquiry: Array.isArray(inquiry) ? inquiry[0] : inquiry })
  } catch {
    return NextResponse.json({ error: "Unable to submit your inquiry." }, { status: 500 })
  }
}
