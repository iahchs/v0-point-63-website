import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSupabaseUser, supabaseDb } from "@/lib/supabase-rest"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("p63_access_token")?.value

  if (!accessToken) redirect("/login?next=/admin")

  const user = await getSupabaseUser(accessToken)
  if (!user) redirect("/login?next=/admin")

  const roleResponse = await supabaseDb(
    `/user_roles?select=role&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
    {},
    accessToken,
  )

  if (!roleResponse.ok) redirect("/")

  const rows = await roleResponse.json()
  if (rows[0]?.role !== "admin") redirect("/")

  return children
}
