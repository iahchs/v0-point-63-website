import { NextResponse } from "next/server"
import { supabaseAuth } from "@/lib/supabase-rest"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const response = await supabaseAuth("/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_description || data.msg || "Invalid email or password" },
        { status: response.status }
      )
    }

    const result = NextResponse.json({ user: data.user })
    result.cookies.set("p63_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in || 3600,
    })
    result.cookies.set("p63_refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })

    return result
  } catch {
    return NextResponse.json({ error: "Unable to sign in" }, { status: 500 })
  }
}
