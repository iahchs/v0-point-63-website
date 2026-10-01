"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function getSafeNextPath() {
  const value = new URLSearchParams(window.location.search).get("next")
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/contact"
}

export default function LoginForm() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    const response = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (!response.ok) {
      setMessage(data.error || "Something went wrong")
      setLoading(false)
      return
    }
    if (mode === "signup" && !data.user) {
      setMessage(data.message)
      setLoading(false)
      return
    }
    const requestedPath = getSafeNextPath()
    const nextPath =
      mode === "login" && data.role === "admin"
        ? "/admin"
        : requestedPath === "/admin"
          ? "/contact"
          : requestedPath
    router.push(nextPath)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Sign in to Point 63" : "Create your Point 63 account"}</CardTitle>
          <CardDescription>{mode === "login" ? "Sign in to select a service and book a schedule." : "Create an account before making a booking."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <Button className="w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 w-full text-sm text-primary hover:underline"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login")
              setMessage("")
            }}
          >
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
          <Link href="/" className="mt-4 block text-center text-sm text-muted-foreground hover:text-foreground">
            Back to website
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
