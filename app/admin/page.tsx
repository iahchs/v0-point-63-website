import { redirect } from "next/navigation"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated()
  
  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return <AdminDashboard />
}
