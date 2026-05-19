import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

// GET - Fetch all reviews (public)
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// POST - Create a new review (admin only)
export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { client_name, client_company, client_role, content, rating } = body

    if (!client_name || !content || !rating) {
      return NextResponse.json(
        { error: "Missing required fields: client_name, content, rating" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        client_name,
        client_company: client_company || null,
        client_role: client_role || null,
        content,
        rating,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
