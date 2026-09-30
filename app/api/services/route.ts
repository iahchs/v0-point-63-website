import { NextResponse } from "next/server"
import { supabaseDb } from "@/lib/supabase-rest"

export async function GET() {
  try {
    const response = await supabaseDb(
      "/services?select=id,title,description,features,video_url,sort_order,duration_minutes&active=eq.true&order=sort_order.asc"
    )
    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: "Unable to load services", details: data }, { status: response.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 })
  }
}
