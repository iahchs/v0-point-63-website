"use client"

import { useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, CheckCircle2, Clock3, FileText, LayoutDashboard, Search, Users } from "lucide-react"

type RequestItem = { id: string; name?: string; email?: string; phone?: string | null; service?: string; status?: string; type?: string; message?: string; created_at?: string }
type Booking = { id: string; user_id: string; service_id: string; scheduled_start: string; scheduled_end: string; status: string; notes?: string | null; created_at: string; services?: { title: string } | { title: string }[] | null }
type Customer = { name: string; email: string; phone: string | null; bookings: number; inquiries: number; lastActivity: string; history: RequestItem[] }
type View = "overview" | "requests" | "appointments" | "customers"

const services = [["video-photo", "Video & Photo"], ["3d-graphics", "3D Graphics"], ["motion-graphics", "Motion Graphics"], ["video-editing", "Video Editing"]]
const statusOptions = ["new", "pending", "confirmed", "completed", "cancelled", "closed"]

export default function SupervisorPage() {
  const [view, setView] = useState<View>("overview")
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selected, setSelected] = useState<RequestItem | null>(null)
  const [note, setNote] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [service, setService] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    try {
      const qs = new URLSearchParams()
      if (search.trim()) qs.set("search", search.trim())
      if (status !== "all") qs.set("status", status)
      const bookingQs = new URLSearchParams({ service, status })
      const [requestResponse, bookingResponse, customerResponse] = await Promise.all([
        fetch(`/api/supervisor/requests?${qs}`),
        fetch(`/api/supervisor/bookings?${bookingQs}`),
        fetch(`/api/supervisor/customers?search=${encodeURIComponent(search)}`),
      ])
      if ([requestResponse, bookingResponse, customerResponse].some((response) => response.status === 401 || response.status === 403)) {
        window.location.href = "/login?next=/supervisor"
        return
      }
      if (![requestResponse, bookingResponse, customerResponse].every((response) => response.ok)) throw new Error("Unable to load supervisor workspace")
      setRequests(await requestResponse.json())
      setBookings(await bookingResponse.json())
      setCustomers(await customerResponse.json())
      setError("")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load supervisor workspace")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [status, service])

  async function updateRequest(nextStatus: string) {
    if (!selected) return
    const response = await fetch("/api/supervisor/requests", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, status: nextStatus }) })
    if (!response.ok) { setError("Unable to update request"); return }
    setSelected({ ...selected, status: nextStatus }); void load()
  }

  async function addNote() {
    if (!selected || !note.trim()) return
    const response = await fetch("/api/supervisor/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request_id: selected.id, note }) })
    if (!response.ok) { setError("Unable to save note"); return }
    setNote("")
  }

  async function updateBooking(id: string, nextStatus: string) {
    const response = await fetch("/api/supervisor/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: nextStatus }) })
    if (!response.ok) { setError("Unable to update appointment"); return }
    void load()
  }

  const metrics = useMemo(() => ({ newRequests: requests.filter((item) => item.status === "new").length, pending: bookings.filter((item) => item.status === "pending").length, today: bookings.filter((item) => new Date(item.scheduled_start).toDateString() === new Date().toDateString()).length }), [requests, bookings])
  const serviceTitle = (booking: Booking) => Array.isArray(booking.services) ? booking.services[0]?.title : booking.services?.title

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading supervisor workspace...</div>

  return <><Navigation /><main className="min-h-screen bg-muted/20 pt-24 pb-16"><div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
    <aside className="hidden w-56 shrink-0 lg:block"><div className="sticky top-24 rounded-2xl bg-sidebar p-3 text-sidebar-foreground"><p className="px-3 pb-5 text-lg font-bold">Point 63 <span className="text-sidebar-primary">Supervisor</span></p><nav className="flex flex-col gap-1">{([["overview", "Overview", LayoutDashboard], ["requests", "Requests", FileText], ["appointments", "Appointments", CalendarDays], ["customers", "Customers", Users]] as const).map(([id, label, Icon]) => <button key={id} onClick={() => setView(id)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${view === id ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent"}`}><Icon data-icon="inline-start" />{label}</button>)}</nav></div></aside>
    <div className="min-w-0 flex-1"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Operations</p><h1 className="mt-1 text-3xl font-bold">Supervisor workspace</h1><p className="mt-1 text-sm text-muted-foreground">Triage customer work, appointments, and internal context.</p></div><Select value={view} onValueChange={(value) => setView(value as View)}><SelectTrigger className="w-48 lg:hidden"><SelectValue /></SelectTrigger><SelectContent>{[["overview", "Overview"], ["requests", "Requests"], ["appointments", "Appointments"], ["customers", "Customers"]].map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}</SelectContent></Select></div>
      {error && <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      {view === "overview" && <><div className="grid gap-4 sm:grid-cols-3"><Card><CardContent className="p-5"><FileText className="mb-4 text-primary" /><p className="text-sm text-muted-foreground">New requests</p><p className="mt-1 text-3xl font-bold">{metrics.newRequests}</p></CardContent></Card><Card><CardContent className="p-5"><Clock3 className="mb-4 text-primary" /><p className="text-sm text-muted-foreground">Pending appointments</p><p className="mt-1 text-3xl font-bold">{metrics.pending}</p></CardContent></Card><Card><CardContent className="p-5"><CalendarDays className="mb-4 text-primary" /><p className="text-sm text-muted-foreground">Today&apos;s appointments</p><p className="mt-1 text-3xl font-bold">{metrics.today}</p></CardContent></Card></div><Card className="mt-6"><CardHeader><CardTitle>Priority queue</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{requests.slice(0, 6).map((item) => <button key={item.id} onClick={() => { setSelected(item); setView("requests") }} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 text-left hover:bg-muted/40"><span><span className="font-medium">{item.name || item.email}</span><span className="mt-1 block text-sm text-muted-foreground">{item.type === "booking" ? "Booking request" : "Inquiry"} · {item.service || "General"}</span></span><Badge variant="outline">{item.status || "new"}</Badge></button>)}{requests.length === 0 && <p className="text-sm text-muted-foreground">No requests need attention.</p>}</CardContent></Card></>}
      {view === "requests" && <div className="grid gap-6 xl:grid-cols-[1fr_360px]"><Card><CardHeader><CardTitle>Requests <span className="text-muted-foreground">({requests.length})</span></CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><div className="flex flex-wrap gap-2"><Input className="min-w-52 flex-1" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone" onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) void load() }} /><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{statusOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select><Button variant="outline" onClick={() => void load()}><Search data-icon="inline-start" />Search</Button></div>{requests.map((item) => <button key={item.id} onClick={() => setSelected(item)} className="rounded-lg border p-4 text-left hover:bg-muted/40"><div className="flex justify-between gap-3"><span className="font-medium">{item.name || item.email}</span><Badge variant="outline">{item.status || "new"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{item.email} {item.service ? `· ${item.service}` : ""}</p><p className="mt-2 line-clamp-2 text-sm">{item.message || "No message"}</p></button>)}{requests.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No matching requests.</p>}</CardContent></Card><Card><CardHeader><CardTitle>{selected ? "Request details" : "Select a request"}</CardTitle></CardHeader><CardContent className="flex flex-col gap-4">{selected ? <><div><p className="font-medium">{selected.name || "Client"}</p><p className="text-sm text-muted-foreground">{selected.email} · {selected.phone || "No phone"}</p></div><div className="rounded-lg border p-4 text-sm whitespace-pre-wrap">{selected.message || "No message provided."}</div><Select value={selected.status || "new"} onValueChange={updateRequest}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select><Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Internal note" rows={5} /><Button onClick={addNote} disabled={!note.trim()}>Add internal note</Button></> : <p className="text-sm text-muted-foreground">Choose a request to inspect it.</p>}</CardContent></Card></div>}
      {view === "appointments" && <Card><CardHeader><CardTitle>Appointments <span className="text-muted-foreground">({bookings.length})</span></CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><div className="flex flex-wrap gap-2"><Select value={service} onValueChange={setService}><SelectTrigger className="w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All services</SelectItem>{services.map(([id, label]) => <SelectItem key={id} value={id}>{label}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{["pending", "confirmed", "completed", "cancelled"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></div>{bookings.map((booking) => <div key={booking.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{serviceTitle(booking) || booking.service_id}</p><p className="text-sm text-muted-foreground">{new Date(booking.scheduled_start).toLocaleString()} · {booking.user_id}</p></div><div className="flex items-center gap-2"><Badge variant="outline">{booking.status}</Badge>{booking.status === "pending" && <Button size="sm" onClick={() => void updateBooking(booking.id, "confirmed")}><CheckCircle2 data-icon="inline-start" />Confirm</Button>}{booking.status === "confirmed" && <Button size="sm" variant="outline" onClick={() => void updateBooking(booking.id, "completed")}>Complete</Button>}</div></div>)}{bookings.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No matching appointments.</p>}</CardContent></Card>}
      {view === "customers" && <Card><CardHeader><CardTitle>Customers <span className="text-muted-foreground">({customers.length})</span></CardTitle></CardHeader><CardContent className="flex flex-col gap-3"><div className="flex gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customers" onKeyDown={(event) => { if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) void load() }} /><Button variant="outline" onClick={() => void load()}><Search data-icon="inline-start" />Search</Button></div>{customers.map((customer) => <div key={customer.email} className="rounded-lg border p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-medium">{customer.name}</p><p className="text-sm text-muted-foreground">{customer.email}{customer.phone ? ` · ${customer.phone}` : ""}</p></div><div className="flex gap-2"><Badge variant="secondary">{customer.bookings} bookings</Badge><Badge variant="outline">{customer.inquiries} inquiries</Badge></div></div><p className="mt-2 text-xs text-muted-foreground">Last activity {new Date(customer.lastActivity).toLocaleString()}</p></div>)}</CardContent></Card>}
    </div></div></main><Footer /></>
}
