"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Send, Loader2 } from "lucide-react"

type Service = { id: string; title: string; duration_minutes?: number; active?: boolean }
type FormState = { type: "inquiry" | "booking"; serviceIds: string[]; date?: string; time: string; name: string; email: string; phone: string; budget: string; message: string }

const emptyForm: FormState = { type: "inquiry", serviceIds: [], time: "", name: "", email: "", phone: "", budget: "", message: "" }
const budgetRanges = ["Under PHP 75,000", "PHP 75,000 - PHP 150,000", "PHP 150,000 - PHP 300,000", "PHP 300,000 - PHP 750,000", "PHP 750,000+", "Not sure yet"]

export function ContactForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitted, setSubmitted] = useState<{ id: string; type: string; status: string } | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetch("/api/services").then(r => r.json()).then(data => setServices(Array.isArray(data) ? data : [])) }, [])
  useEffect(() => { const saved = sessionStorage.getItem("point63-request"); if (saved) try { setForm({ ...emptyForm, ...JSON.parse(saved) }) } catch {} }, [])
  useEffect(() => { sessionStorage.setItem("point63-request", JSON.stringify(form)) }, [form])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm(current => ({ ...current, [key]: value })) }
  function toggleService(id: string) { update("serviceIds", form.serviceIds.includes(id) ? form.serviceIds.filter(value => value !== id) : [...form.serviceIds, id]) }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("")
    if (!form.serviceIds.length) return setError("Select at least one service.")
    if (form.type === "booking" && (!form.date || !form.time)) return setError("Bookings require a preferred date and start time.")
    if (form.type === "booking") {
      const auth = await fetch("/api/auth/me")
      if (!auth.ok) { sessionStorage.setItem("point63-request", JSON.stringify(form)); router.push("/login?next=/book"); return }
    }
    setSaving(true)
    const scheduledStart = form.date && form.time ? new Date(`${form.date}T${form.time}`).toISOString() : null
    const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, scheduledStart }) })
    const data = await response.json()
    setSaving(false)
    if (!response.ok) return setError(data.error || "Unable to submit your request.")
    sessionStorage.removeItem("point63-request")
    setSubmitted(data.request)
  }

  if (submitted) return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-muted/30 p-8 text-center lg:p-12"><div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10"><Send className="size-8 text-primary" /></div><h3 className="mb-4 text-2xl font-bold">Your {submitted.type === "booking" ? "booking request" : "inquiry"} has been submitted.</h3><p className="mb-2 text-muted-foreground">Reference: {submitted.id}</p><p className="mb-6 text-muted-foreground">Current status: {submitted.status}</p><Button variant="outline" onClick={() => { setSubmitted(null); setForm(emptyForm) }}>Send Another Request</Button></motion.div>

  return <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
    <div className="mb-8"><h2 className="mb-2 text-2xl font-bold lg:text-3xl">Start Your Project</h2><p className="text-muted-foreground">Ask a question or request a booking. We&apos;ll get back to you within 24–48 hours.</p></div>
    <form onSubmit={submit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2"><legend className="text-sm font-medium">Request type</legend><div className="grid grid-cols-2 gap-3">{(["inquiry", "booking"] as const).map(type => <label key={type} className={`cursor-pointer rounded-lg border p-3 text-sm ${form.type === type ? "border-primary bg-primary/10" : "border-border"}`}><input type="radio" name="type" className="sr-only" checked={form.type === type} onChange={() => update("type", type)} />{type === "inquiry" ? "Inquiry" : "Booking"}<span className="mt-1 block text-xs text-muted-foreground">{type === "inquiry" ? "No account required" : "Sign in required"}</span></label>)}</div></fieldset>
      <div className="grid gap-6 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="name">Full Name *</Label><Input id="name" value={form.name} onChange={e => update("name", e.target.value)} required /></div><div className="flex flex-col gap-2"><Label htmlFor="email">Email Address *</Label><Input id="email" type="email" value={form.email} onChange={e => update("email", e.target.value)} required /></div></div>
      <div className="grid gap-6 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} /></div><div className="flex flex-col gap-2"><Label htmlFor="budget">Budget Range</Label><select id="budget" value={form.budget} onChange={e => update("budget", e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="">Select a budget range</option>{budgetRanges.map(range => <option key={range}>{range}</option>)}</select></div></div>
      <fieldset className="flex flex-col gap-3"><legend className="text-sm font-medium">Services * <span className="font-normal text-muted-foreground">(select all that apply)</span></legend><div className="grid gap-3 sm:grid-cols-2">{services.map(service => <label key={service.id} className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"><input type="checkbox" checked={form.serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} />{service.title}</label>)}</div></fieldset>
      {form.type === "booking" && <div className="grid gap-6 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label>Preferred date *</Label><Calendar mode="single" selected={form.date ? new Date(`${form.date}T12:00:00`) : undefined} onSelect={date => update("date", date?.toISOString().slice(0, 10))} disabled={day => day < new Date(new Date().setHours(0, 0, 0, 0))} className="rounded-md border" /></div><div className="flex flex-col gap-2"><Label htmlFor="time">Preferred start time *</Label><Input id="time" type="time" value={form.time} onChange={e => update("time", e.target.value)} required /></div></div>}
      <div className="flex flex-col gap-2"><Label htmlFor="message">Message / Notes *</Label><Textarea id="message" value={form.message} onChange={e => update("message", e.target.value)} rows={6} required placeholder="Tell us about your project, goals, timeline, and requirements..." /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" disabled={saving}>{saving ? <><Loader2 data-icon="inline-start" className="animate-spin" />Submitting...</> : <><Send data-icon="inline-start" />Submit {form.type === "booking" ? "Booking Request" : "Inquiry"}</>}</Button>
    </form>
  </motion.div>
}

export { emptyForm }
