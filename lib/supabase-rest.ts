const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function assertSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are not configured")
  }
}

export async function supabaseAuth(path: string, options: RequestInit = {}) {
  assertSupabaseConfig()
  return fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  })
}

export async function supabaseDb(path: string, options: RequestInit = {}, accessToken?: string) {
  assertSupabaseConfig()
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY!,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  })
}

export async function getSupabaseUser(accessToken: string) {
  const response = await supabaseAuth("/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) return null
  return response.json()
}
