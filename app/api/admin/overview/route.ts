import { NextResponse } from "next/server"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const [requests, bookings, customers] = await Promise.all([
    supabaseAdminDb("/requests?select=id,type,status,created_at&order=created_at.desc&limit=1000"),
    supabaseAdminDb("/request_services?select=request_id,service_id,scheduled_start,scheduled_end,status&order=scheduled_start.asc&limit=1000"),
    supabaseAdminDb("/requests?select=email&order=created_at.desc&limit=1000"),
  ])
  const [requestRows, bookingRows, customerRows] = await Promise.all([requests.json(), bookings.json(), customers.json()])
  if (!requests.ok || !bookings.ok || !customers.ok) return NextResponse.json({ error: "Unable to load overview" }, { status: 502 })
  const rows = Array.isArray(requestRows) ? requestRows : []
  const appointments = Array.isArray(bookingRows) ? bookingRows : []
  const uniqueCustomers = new Set((Array.isArray(customerRows) ? customerRows : []).map((row: { email?: string }) => row.email?.toLowerCase()).filter(Boolean))
  return NextResponse.json({
    totalRequests: rows.length,
    newInquiries: rows.filter((row: { type: string; status: string }) => row.type === "inquiry" && row.status === "new").length,
    pendingBookings: appointments.filter((row: { status: string }) => row.status === "pending").length,
    confirmedBookings: appointments.filter((row: { status: string }) => row.status === "confirmed").length,
    todaysAppointments: appointments.filter((row: { scheduled_start?: string }) => row.scheduled_start && new Date(row.scheduled_start) >= today && new Date(row.scheduled_start) < new Date(today.getTime() + 86400000)).length,
    totalCustomers: uniqueCustomers.size,
    recentActivity: rows.slice(0, 8),
  })
}

export const dynamic = "force-dynamic"
