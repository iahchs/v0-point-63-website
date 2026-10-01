import { NextResponse } from "next/server"
import { supabaseAuth, supabaseDb, getSupabaseUser } from "@/lib/supabase-rest"

async function getRole(userId: string, accessToken: string) {
  const response = await supabaseDb(
    `/user_roles?select=role&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    {},
    accessToken,
  )
  if (!response.ok) return null
  const rows = await response.json()
  return rows[0]?.role || null
}

export async function GET(request: Request) {
  const cookies = request.headers.get("cookie") || ""
  const accessToken = cookies.match(/(?:^|;\s*)p63_access_token=([^;]+)/)?.[1]
  const refreshToken = cookies.match(/(?:^|;\s*)p63_refresh_token=([^;]+)/)?.[1]

  if (accessToken) {
    const user = await getSupabaseUser(accessToken)
    if (user) {
      const role = await getRole(user.id, accessToken)
      return NextResponse.json({ user, role })
    }
  }

  if (!refreshToken) return NextResponse.json({ user: null, role: null }, { status: 401 })

  const response = await supabaseAuth("/token?grant_type=refresh_token", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  const data = await response.json()

  if (!response.ok) return NextResponse.json({ user: null, role: null }, { status: 401 })

  const role = await getRole(data.user.id, data.access_token)
  const userResponse = NextResponse.json({ user: data.user, role })
  userResponse.cookies.set("p63_access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: data.expires_in || 3600,
  })
  if (data.refresh_token) {
    userResponse.cookies.set("p63_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  }
  return userResponse
}
