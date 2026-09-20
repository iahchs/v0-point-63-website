"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import type { Service } from "@/lib/services-store"

const empty = { title: "", description: "", features: "", videoUrl: "" }
export function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]); const [editing, setEditing] = useState<Service | null>(null); const [form, setForm] = useState(empty); const [uploading, setUploading] = useState(false)
  const load = async () => { const response = await fetch("/api/services"); if (response.ok) setServices(await response.json()) }
  useEffect(() => { load() }, [])
  const start = (service?: Service) => { setEditing(service ?? null); setForm(service ? { title: service.title, description: service.description, features: service.features.join("\n"), videoUrl: service.videoUrl } : empty) }
  const upload = async (file: File) => { setUploading(true); const body = new FormData(); body.append("file", file); const response = await fetch("/api/services/upload", { method: "POST", body }); setUploading(false); if (!response.ok) return toast.error("Video upload failed"); const data = await response.json(); setForm((current) => ({ ...current, videoUrl: data.url })); toast.success("Video uploaded") }
  const save = async () => { const payload = { ...(editing ? { id: editing.id } : {}), title: form.title, description: form.description, videoUrl: form.videoUrl, features: form.features.split("\n").map((item) => item.trim()).filter(Boolean), ...(editing ? {} : { sortOrder: services.length }) }; const response = await fetch("/api/services", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); if (!response.ok) return toast.error("Could not save service"); await load(); setEditing(null); setForm(empty); toast.success(editing ? "Service updated" : "Service added") }
  const remove = async (id: string) => { if (!confirm("Delete this service?")) return; const response = await fetch("/api/services", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); if (response.ok) { await load(); toast.success("Service deleted") } }
  return <Card className="mt-8"><CardHeader className="flex flex-row items-center justify-between gap-4"><div><CardTitle>Services & videos</CardTitle><CardDescription>Edit service content or upload a new service video.</CardDescription></div><Button onClick={() => start()}><Plus data-icon="inline-start" /> Add service</Button></CardHeader><CardContent className="flex flex-col gap-4">
    {(editing || form.title) && <div className="rounded-lg border bg-muted/30 p-4 flex flex-col gap-4"><div className="flex items-center justify-between"><h3 className="font-semibold">{editing ? "Edit service" : "New service"}</h3><Button variant="ghost" size="icon" onClick={() => { setEditing(null); setForm(empty) }}><X /></Button></div><Input placeholder="Service title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /><Textarea placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><Textarea placeholder="Features, one per line" value={form.features} onChange={(event) => setForm({ ...form, features: event.target.value })} /><div className="flex flex-wrap items-center gap-3"><Input type="file" accept="video/*" className="max-w-sm" disabled={uploading} onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />{uploading && <Badge variant="secondary">Uploading...</Badge>}{form.videoUrl && <Badge variant="outline">Video ready</Badge>}</div><Button onClick={save} disabled={!form.title || !form.description || !form.videoUrl}><Save data-icon="inline-start" /> Save service</Button></div>}
    {services.map((service) => <div key={service.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"><video src={service.videoUrl} muted loop autoPlay playsInline className="h-24 w-full rounded-md object-cover sm:w-40" /><div className="min-w-0 flex-1"><p className="font-semibold">{service.title}</p><p className="truncate text-sm text-muted-foreground">{service.description}</p><Badge variant="secondary" className="mt-2">{service.features.length} features</Badge></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => start(service)}><Pencil data-icon="inline-start" /> Edit</Button><Button variant="ghost" size="icon" onClick={() => remove(service.id)} aria-label={`Delete ${service.title}`}><Trash2 /></Button></div></div>)}
  </CardContent></Card>
}
