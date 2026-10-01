import { NextResponse } from "next/server"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  try {
    const [requests, bookings] = await Promise.all([
      supabaseAdminDb("/requests?select=id,type,status,created_at&order=created_at.desc&limit=1000"),
      supabaseAdminDb("/bookings?select=id,status,scheduled_start&order=scheduled_start.asc&limit=1000"),
    ])
    const [requestRows, bookingRows] = await Promise.all([requests.json(), bookings.json()])
    // The unified requests schema is the source of truth. Bookings is optional for
    // older projects, so do not make the whole dashboard fail if it is absent.
    if (!requests.ok) return NextResponse.json({ error: "Unable to load requests" }, { status: 502 })

    const rows = Array.isArray(requestRows) ? requestRows : []
    const appointments = bookings.ok && Array.isArray(bookingRows) ? bookingRows : rows.filter((row: { type?: string }) => row.type === "booking")
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const uniqueCustomers = new Set(rows.map((row: { email?: string }) => row.email?.toLowerCase()).filter(Boolean))

    return NextResponse.json({
      totalRequests: rows.length,
      newInquiries: rows.filter((row: { type?: string; status?: string }) => row.type === "inquiry" && row.status === "new").length,
      pendingBookings: appointments.filter((row: { status?: string }) => row.status === "pending").length,
      confirmedBookings: appointments.filter((row: { status?: string }) => row.status === "confirmed").length,
      todaysAppointments: appointments.filter((row: { scheduled_start?: string }) => {
        if (!row.scheduled_start) return false
        const start = new Date(row.scheduled_start)
        return start >= today && start < tomorrow
      }).length,
      totalCustomers: uniqueCustomers.size,
      recentActivity: rows.slice(0, 8),
    })
  } catch (error) {
    console.error("[admin/overview] failed:", error)
    return NextResponse.json({ error: "Unable to load overview" }, { status: 502 })
  }
}

export const dynamic = "force-dynamic"
