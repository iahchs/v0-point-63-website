import { NextResponse } from "next/server"
import { isAdminAuthenticated, supabaseAdminDb } from "@/lib/supabase-admin"

export async function GET(request: Request) {
  if (!await isAdminAuthenticated(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const url = new URL(request.url)
  const search = url.searchParams.get("search")?.trim().toLowerCase()
  const response = await supabaseAdminDb("/requests?select=id,user_id,name,email,phone,type,status,service,created_at,scheduled_start,scheduled_end&order=created_at.desc&limit=1000")
  const rows = await response.json()
  if (!response.ok) return NextResponse.json(rows, { status: response.status })
  const customers = new Map<string, { name: string; email: string; phone: string | null; bookings: number; inquiries: number; lastActivity: string; history: unknown[] }>()
  for (const row of Array.isArray(rows) ? rows : []) {
    const key = String(row.user_id || row.email).toLowerCase()
    if (search && !`${row.name} ${row.email} ${row.phone || ""}`.toLowerCase().includes(search)) continue
    const current = customers.get(key) || { name: row.name, email: row.email, phone: row.phone, bookings: 0, inquiries: 0, lastActivity: row.created_at, history: [] }
    current.bookings += row.type === "booking" ? 1 : 0
    current.inquiries += row.type === "inquiry" ? 1 : 0
    current.history.push(row)
    if (new Date(row.created_at) > new Date(current.lastActivity)) current.lastActivity = row.created_at
    customers.set(key, current)
  }
  return NextResponse.json([...customers.values()])
}

export const dynamic = "force-dynamic"
