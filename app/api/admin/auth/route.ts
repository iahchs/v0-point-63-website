import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Use Supabase Auth at /login, then assign an admin role." }, { status: 410 })
}

export async function DELETE() {
  return NextResponse.json({ success: true })
}
