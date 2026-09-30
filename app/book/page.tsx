"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Service = { id:string; title:string; description:string; duration_minutes:number }
type Booking = { id:string; service_id:string; scheduled_start:string; scheduled_end:string; status:string }

export default function BookPage() {
  const router = useRouter()
  const [services,setServices]=useState<Service[]>([]), [bookings,setBookings]=useState<Booking[]>([])
  const [serviceId,setServiceId]=useState(""), [date,setDate]=useState<Date>(), [time,setTime]=useState(""), [notes,setNotes]=useState(""), [message,setMessage]=useState(""), [loading,setLoading]=useState(true), [saving,setSaving]=useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then(r=>r.json()),
      fetch("/api/auth/me").then(async r=>{if(!r.ok) throw new Error("AUTH"); return r.json()}),
      fetch("/api/bookings").then(r=>r.json())
    ]).then(([serviceData,,bookingData])=>{
      if(!Array.isArray(serviceData)) throw new Error("SERVICES")
      setServices(serviceData); setBookings(Array.isArray(bookingData)?bookingData:[])
      if(serviceData[0]) setServiceId(serviceData[0].id)
    }).catch(()=>router.push("/login")).finally(()=>setLoading(false))
  },[router])

  const selectedService=useMemo(()=>services.find(s=>s.id===serviceId),[services,serviceId])
  const availableTimes=useMemo(()=>{
    if(!date||!selectedService) return []
    const times:string[]=[]; const cursor=new Date(date); cursor.setHours(9,0,0,0)
    while(cursor.getHours()<18 || (cursor.getHours()===18&&cursor.getMinutes()===0)){
      const end=new Date(cursor.getTime()+selectedService.duration_minutes*60000)
      if(end.getHours()<=18&&!bookings.some(b=>b.status!=="cancelled"&&new Date(b.scheduled_start)<end&&new Date(b.scheduled_end)>cursor)) times.push(cursor.toTimeString().slice(0,5))
      cursor.setMinutes(cursor.getMinutes()+30)
    }
    return times
  },[date,selectedService,bookings])

  async function submit(e:React.FormEvent){
    e.preventDefault()
    if(!date||!time||!serviceId){setMessage("Select a service, date, and time.");return}
    const start=new Date(date), [hours,minutes]=time.split(":").map(Number); start.setHours(hours,minutes,0,0)
    setSaving(true); setMessage("")
    const response=await fetch("/api/bookings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId,scheduledStart:start.toISOString(),notes})})
    const data=await response.json()
    if(!response.ok){setMessage(data.error||"Unable to create booking.");setSaving(false);return}
    setMessage("Booking request submitted."); setBookings(c=>[...c,data]); setTime(""); setNotes(""); setSaving(false)
  }

  if(loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  return <>
    <Navigation/>
    <main className="min-h-screen bg-background pt-28 pb-20"><div className="mx-auto max-w-5xl px-4">
      <div className="mb-10"><p className="text-sm font-semibold text-primary uppercase tracking-wider">Booking</p><h1 className="text-4xl font-bold mt-2">Choose a service and schedule</h1><p className="text-muted-foreground mt-3">Select a service, pick a date, then choose an available time.</p></div>
      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        <Card><CardHeader><CardTitle>1. Service</CardTitle></CardHeader><CardContent className="space-y-4">
          <Select value={serviceId} onValueChange={v=>{setServiceId(v);setTime("")}}><SelectTrigger><SelectValue placeholder="Select a service"/></SelectTrigger><SelectContent>{services.map(s=><SelectItem key={s.id} value={s.id}>{s.title} · {s.duration_minutes} min</SelectItem>)}</SelectContent></Select>
          {selectedService&&<p className="text-sm text-muted-foreground">{selectedService.description}</p>}
        </CardContent></Card>
        <Card><CardHeader><CardTitle>2. Date & time</CardTitle></CardHeader><CardContent className="space-y-6">
          <Calendar mode="single" selected={date} onSelect={v=>{setDate(v);setTime("")}} disabled={day=>day<new Date(new Date().setHours(0,0,0,0))} className="rounded-md border mx-auto"/>
          {date&&<div className="space-y-2"><Label>Available times</Label><Select value={time} onValueChange={setTime}><SelectTrigger><SelectValue placeholder="Select a time"/></SelectTrigger><SelectContent>{availableTimes.length?availableTimes.map(slot=><SelectItem key={slot} value={slot}>{slot}</SelectItem>):<SelectItem value="none" disabled>No available slots</SelectItem>}</SelectContent></Select></div>}
          <div className="space-y-2"><Label htmlFor="notes">Notes (optional)</Label><textarea id="notes" value={notes} onChange={e=>setNotes(e.target.value)} className="w-full min-h-24 rounded-md border bg-background p-3 text-sm" placeholder="Add project details or requirements"/></div>
          {message&&<p className="text-sm text-muted-foreground">{message}</p>}
          <Button type="submit" className="w-full" disabled={saving||!date||!time||time==="none"}>{saving?"Submitting...":"Request Booking"}</Button>
        </CardContent></Card>
      </form>
      {bookings.length>0&&<Card className="mt-8"><CardHeader><CardTitle>Your bookings</CardTitle></CardHeader><CardContent className="space-y-3">{bookings.map(b=>{const s=services.find(x=>x.id===b.service_id);return <div key={b.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border p-4"><div><p className="font-medium">{s?.title||b.service_id}</p><p className="text-sm text-muted-foreground">{new Date(b.scheduled_start).toLocaleString()}</p></div><span className="text-sm capitalize text-muted-foreground">{b.status}</span></div>})}</CardContent></Card>}
    </div></main><Footer/>
  </>
}
