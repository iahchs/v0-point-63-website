import { getSupabaseUser, supabaseDb } from "@/lib/supabase-rest"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY

function getCookie(request: Request, name: string) {
  return request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))?.[1]
}

export async function getAuthenticatedUser(request: Request) {
  const accessToken = getCookie(request, "p63_access_token")
  if (!accessToken) return null

  const user = await getSupabaseUser(accessToken)
  if (!user) return null

  return { user, accessToken }
}

export async function isAdminAuthenticated(request: Request) {
  const auth = await getAuthenticatedUser(request)
  if (!auth || !SUPABASE_URL || !SUPABASE_SECRET_KEY) return null

  const response = await supabaseDb(
    `/admin_users?select=user_id&user_id=eq.${encodeURIComponent(auth.user.id)}&limit=1`,
    {},
    auth.accessToken,
  )

  if (!response.ok) return null
  const rows = await response.json()
  return rows[0] ? auth : null
}

export async function supabaseAdminDb(path: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error("Supabase admin configuration is not configured")
  }

  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  })
}
