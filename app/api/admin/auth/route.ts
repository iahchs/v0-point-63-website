import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ error: "Use /api/auth/login for authentication." }, { status: 410 })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("p63_access_token")
  response.cookies.delete("p63_refresh_token")
  return response
}
