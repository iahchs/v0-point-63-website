import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Admin credentials - in production, use environment variables and proper hashing
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@point63.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "point63admin"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a simple session token
      const sessionToken = Buffer.from(`${email}:${Date.now()}`).toString("base64")
      
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  return NextResponse.json({ success: true })
}
