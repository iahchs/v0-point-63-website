"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
]

type AuthState = {
  user: { id: string; email?: string } | null
  role: "customer" | "supervisor" | "admin" | null
}

export function Navigation() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [auth, setAuth] = useState<AuthState>({ user: null, role: null })
  const [loggingOut, setLoggingOut] = useState(false)

  const loadAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" })
      if (!response.ok) {
        setAuth({ user: null, role: null })
        return
      }
      const data = await response.json()
      setAuth({
        user: data.user || null,
        role: data.role || null,
      })
    } catch {
      setAuth({ user: null, role: null })
    } finally {
      setAuthLoading(false)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    const handleAuthChange = () => {
      setAuthLoading(true)
      void loadAuth()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("p63-auth-changed", handleAuthChange)

    void loadAuth()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("p63-auth-changed", handleAuthChange)
    }
  }, [loadAuth])

  async function logout() {
    if (loggingOut) return
    setLoggingOut(true)
    await fetch("/api/auth/logout", { method: "POST" })
    setAuth({ user: null, role: null })
    setIsMobileMenuOpen(false)
    window.dispatchEvent(new Event("p63-auth-changed"))
    router.push("/")
    router.refresh()
  }

  const actionButton = authLoading ? (
    <Button disabled className="bg-primary text-primary-foreground">
      <span className="opacity-0">Sign In / Book</span>
    </Button>
  ) : auth.user ? (
    <Button
      type="button"
      onClick={logout}
      disabled={loggingOut}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {loggingOut ? "Logging out..." : "Logout"}
    </Button>
  ) : (
    <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
      <Link href="/login">Sign In / Book</Link>
    </Button>
  )

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", isScrolled ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border" : "bg-transparent")}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/point_63_logo.png" alt="Point 63 Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold tracking-tight">Point <span className="text-primary">63</span></span>
          </Link>
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>)}
            {!authLoading && auth.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Admin</Link>
            )}
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            {actionButton}
          </div>
          <button className="lg:hidden p-2 text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => <Link key={link.href} href={link.href} className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{link.label}</Link>)}
              {!authLoading && auth.role === "admin" && (
                <Link href="/admin" className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
              )}
              <div className="pt-1">
                {authLoading ? (
                  <Button disabled className="w-full mt-4 bg-primary text-primary-foreground">
                    <span className="opacity-0">Sign In / Book</span>
                  </Button>
                ) : auth.user ? (
                  <Button type="button" onClick={logout} disabled={loggingOut} className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    {loggingOut ? "Logging out..." : "Logout"}
                  </Button>
                ) : (
                  <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/login">Sign In / Book</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
