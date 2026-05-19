import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

// PUT - Update a review (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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
      .update({
        client_name,
        client_company: client_company || null,
        client_role: client_role || null,
        content,
        rating,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating review:", error)
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

// DELETE - Delete a review (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await isAdminAuthenticated()
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = await createClient()
    
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting review:", error)
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
