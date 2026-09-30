import { NextResponse } from "next/server"

export async function POST() {
  const result = NextResponse.json({ success: true })
  result.cookies.delete("p63_access_token")
  result.cookies.delete("p63_refresh_token")
  return result
}
