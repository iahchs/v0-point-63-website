"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pencil, Save, X } from "lucide-react"
import { toast } from "sonner"

type Video = { id: string; slot: string; title: string; video_url: string; thumbnail_url: string | null; updated_at: string }
type Form = Omit<Video, "id" | "updated_at">

export function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]); const [editing, setEditing] = useState<Video | null>(null); const [form, setForm] = useState<Form>({ slot: "", title: "", video_url: "", thumbnail_url: null }); const [loading, setLoading] = useState(true)
  async function load() { const response = await fetch("/api/admin/videos", { cache: "no-store" }); if (response.status === 401) return void (window.location.href = "/login?next=/admin"); if (!response.ok) return toast.error("Unable to load videos"); setVideos(await response.json()); setLoading(false) }
  useEffect(() => { void load() }, [])
  function start(video: Video) { setEditing(video); setForm({ slot: video.slot, title: video.title, video_url: video.video_url, thumbnail_url: video.thumbnail_url }) }
  async function save() { if (!editing) return; const response = await fetch("/api/admin/videos", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, ...form }) }); if (!response.ok) return toast.error("Could not save video"); await load(); setEditing(null); toast.success("Video updated") }
  if (loading) return <Card className="mt-8"><CardContent className="p-6 text-sm text-muted-foreground">Loading videos...</CardContent></Card>
  return <Card className="mt-8"><CardHeader><CardTitle>Site videos</CardTitle><CardDescription>Manage the public videos without changing the existing fallback URLs. Slots match service IDs such as video-photo.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
    {editing && <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4"><div className="flex items-center justify-between"><h3 className="font-semibold">Edit video</h3><Button variant="ghost" size="icon" onClick={() => setEditing(null)} aria-label="Close editor"><X /></Button></div><Input aria-label="Video slot" placeholder="Slot, e.g. video-photo" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} /><Input aria-label="Video title" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Input aria-label="Video URL" placeholder="Video URL" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} /><Input aria-label="Thumbnail URL" placeholder="Thumbnail URL (optional)" value={form.thumbnail_url ?? ""} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value || null })} /><Button onClick={save} disabled={!form.slot.trim() || !form.title.trim() || !/^https?:\/\//i.test(form.video_url)}><Save data-icon="inline-start" /> Save video</Button></div>}
    {videos.length === 0 ? <p className="text-sm text-muted-foreground">No database videos configured. Public pages are using their hardcoded fallbacks.</p> : videos.map((video) => <div key={video.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center"><video src={video.video_url} poster={video.thumbnail_url ?? undefined} muted loop autoPlay playsInline className="h-24 w-full rounded-md object-cover sm:w-40" /><div className="min-w-0 flex-1"><p className="font-semibold">{video.title}</p><p className="truncate text-sm text-muted-foreground">{video.slot}</p><Badge variant="secondary">Configured</Badge></div><Button variant="outline" size="sm" onClick={() => start(video)}><Pencil data-icon="inline-start" /> Edit</Button></div>)}
  </CardContent></Card>
}
