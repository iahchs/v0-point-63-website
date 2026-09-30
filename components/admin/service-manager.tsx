"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X } from "lucide-react"
import { toast } from "sonner"

type Service = { id: string; title: string; description: string; features: string[]; video_url: string; price_note: string | null; sort_order: number; active: boolean }
type Form = Omit<Service, "id" | "features" | "sort_order"> & { features: string; sort_order: string }
const empty: Form = { title: "", description: "", features: "", video_url: "", price_note: "", active: true, sort_order: "0" }

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<Form>(empty)
  const [loading, setLoading] = useState(true)

  async function load() {
    const response = await fetch("/api/admin/services", { cache: "no-store" })
    if (response.status === 401) return (window.location.href = "/login?next=/admin")
    if (!response.ok) return toast.error("Unable to load services")
    setServices(await response.json())
    setLoading(false)
  }
  useEffect(() => { void load() }, [])
  function start(service: Service) {
    setEditing(service)
    setForm({ title: service.title, description: service.description, features: service.features.join("\n"), video_url: service.video_url, price_note: service.price_note ?? "", active: service.active, sort_order: String(service.sort_order) })
  }
  async function save() {
    if (!editing) return
    const response = await fetch("/api/admin/services", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form, features: form.features.split("\n").map((item) => item.trim()).filter(Boolean), sort_order: Number(form.sort_order) }) })
    if (!response.ok) return toast.error("Could not save service")
    await load(); setEditing(null); toast.success("Service updated")
  }
  if (loading) return <Card className="mt-8"><CardContent className="p-6 text-sm text-muted-foreground">Loading services...</CardContent></Card>
  return <Card className="mt-8"><CardHeader><CardTitle>Services</CardTitle><CardDescription>Manage the four services shown across the website. Services are deactivated instead of deleted.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
    {editing && <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4"><div className="flex items-center justify-between"><h3 className="font-semibold">Edit service</h3><Button variant="ghost" size="icon" onClick={() => setEditing(null)} aria-label="Close editor"><X /></Button></div><Input aria-label="Service title" placeholder="Service title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Textarea aria-label="Description" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><Textarea aria-label="Features" placeholder="Features, one per line" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /><Input aria-label="Price note" placeholder="Price note" value={form.price_note ?? ""} onChange={(e) => setForm({ ...form, price_note: e.target.value })} /><Input aria-label="Video URL" placeholder="Video URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /><div className="flex flex-wrap gap-3"><Input aria-label="Display order" type="number" min="0" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /><Button variant={form.active ? "default" : "outline"} onClick={() => setForm({ ...form, active: !form.active })}>{form.active ? "Active" : "Inactive"}</Button></div><Button onClick={save} disabled={!form.title.trim() || !form.description.trim()}><Save data-icon="inline-start" /> Save service</Button></div>}
    {services.map((service) => <div key={service.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"><video src={service.video_url} muted loop autoPlay playsInline className="h-24 w-full rounded-md object-cover sm:w-40" /><div className="min-w-0 flex-1"><p className="font-semibold">{service.title}</p><p className="truncate text-sm text-muted-foreground">{service.description}</p><div className="mt-2 flex gap-2"><Badge variant={service.active ? "secondary" : "outline"}>{service.active ? "Active" : "Inactive"}</Badge><Badge variant="outline">Order {service.sort_order}</Badge></div></div><Button variant="outline" size="sm" onClick={() => start(service)}><Pencil data-icon="inline-start" /> Edit</Button></div>)}
  </CardContent></Card>
}
