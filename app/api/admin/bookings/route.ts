import { NextResponse } from "next/server"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  const response = await supabaseAdminDb("/bookings?select=id,user_id,service_id,scheduled_start,scheduled_end,status,notes,created_at,services(title)&order=scheduled_start.asc")
  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
