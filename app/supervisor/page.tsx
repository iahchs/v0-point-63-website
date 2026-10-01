"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type RequestItem = { id: string; name?: string; email?: string; phone?: string | null; service?: string; status?: string; message?: string; created_at?: string }

export default function SupervisorPage() {
  const [items, setItems] = useState<RequestItem[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [selected, setSelected] = useState<RequestItem | null>(null)
  const [note, setNote] = useState("")
  const [error, setError] = useState("")

  async function load() {
    const query = new URLSearchParams()
    if (search.trim()) query.set("search", search.trim())
    if (status !== "all") query.set("status", status)
    const response = await fetch(`/api/supervisor/requests?${query}`)
    if (response.status === 403) { window.location.href = "/login?next=/supervisor"; return }
    if (!response.ok) { setError("Unable to load requests."); return }
    setItems(await response.json())
  }

  useEffect(() => { load() }, [])

  async function updateStatus(value: string) {
    if (!selected) return
    const response = await fetch("/api/supervisor/requests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, status: value }) })
    if (!response.ok) { setError("Unable to update status."); return }
    setSelected({ ...selected, status: value }); await load()
  }

  async function addNote() {
    if (!selected || !note.trim()) return
    const response = await fetch("/api/supervisor/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request_id: selected.id, note }) })
    if (!response.ok) { setError("Unable to save note."); return }
    setNote(""); setError("")
  }

  return <><Navigation /><main className="min-h-screen bg-background pt-28 pb-20"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
    <header><p className="text-sm font-semibold uppercase tracking-wider text-primary">Supervisor workspace</p><h1 className="mt-2 text-4xl font-bold">Client requests</h1><p className="mt-2 text-muted-foreground">Search, triage, and add internal context without exposing CRM notes to customers.</p></header>
    {error && <p className="rounded-md border p-4 text-sm text-destructive">{error}</p>}
    <Card><CardContent className="flex flex-col gap-3 pt-6 sm:flex-row"><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email" onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) load() }} /><Select value={status} onValueChange={setStatus}><SelectTrigger className="sm:w-48"><SelectValue placeholder="Filter status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select><Button onClick={load}>Apply filters</Button></CardContent></Card>
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]"><Card><CardHeader><CardTitle>Requests ({items.length})</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{items.length === 0 && <p className="text-sm text-muted-foreground">No matching requests.</p>}{items.map(item => <button key={item.id} onClick={() => setSelected(item)} className="rounded-lg border p-4 text-left hover:bg-muted/40"><div className="flex justify-between gap-3"><span className="font-medium">{item.name || item.email || "Unnamed client"}</span><span className="text-xs capitalize text-muted-foreground">{item.status || "new"}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.email} {item.service ? `· ${item.service}` : ""}</p><p className="mt-2 line-clamp-2 text-sm">{item.message || "No message"}</p></button>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>{selected ? "Request details" : "Select a request"}</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{selected ? <><div className="text-sm"><p className="font-medium">{selected.name || "Client"}</p><p className="text-muted-foreground">{selected.email}</p><p className="text-muted-foreground">{selected.phone || "No phone provided"}</p></div><Select value={selected.status || "new"} onValueChange={updateStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Internal CRM note" rows={5} /><Button onClick={addNote} disabled={!note.trim()}>Add internal note</Button></> : <p className="text-sm text-muted-foreground">Choose a request to inspect and update it.</p>}</CardContent></Card>
    </div>
  </div></main><Footer /></>
}
