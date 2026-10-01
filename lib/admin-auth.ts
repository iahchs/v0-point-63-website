import { getAuthenticatedUser, supabaseAdminDb } from "@/lib/supabase-admin"

export type AppRole = "customer" | "supervisor" | "admin"

export async function getUserRole(request: Request) {
  const auth = await getAuthenticatedUser(request)
  if (!auth) return null
  const response = await supabaseAdminDb(`/user_roles?select=role&user_id=eq.${encodeURIComponent(auth.user.id)}&limit=1`)
  if (!response.ok) return null
  const rows = await response.json()
  return rows[0]?.role as AppRole | undefined || "customer"
}

export async function requireRole(request: Request, role: AppRole) {
  const auth = await getAuthenticatedUser(request)
  if (!auth) return null
  const current = await getUserRole(request)
  const allowed = role === "supervisor" ? current === "supervisor" || current === "admin" : current === role
  return allowed ? { ...auth, role: current } : null
}

export async function isAdminAuthenticated(request: Request) {
  return requireRole(request, "admin")
}

export async function isSupervisorAuthenticated(request: Request) {
  return requireRole(request, "supervisor")
}
