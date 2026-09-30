"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServiceManager } from "@/components/admin/service-manager"

type Inquiry={id:string;name:string;email:string;phone:string|null;service:string;budget:string|null;message:string;status:string;admin_reply:string|null;replied_at:string|null;created_at:string}
type Booking={id:string;user_id:string;service_id:string;scheduled_start:string;scheduled_end:string;status:string;notes:string|null;created_at:string;services?:{title:string}|{title:string}[]|null}

export default function AdminPage(){
 const [inquiries,setInquiries]=useState<Inquiry[]>([]),[bookings,setBookings]=useState<Booking[]>([]),[selected,setSelected]=useState<Inquiry|null>(null),[reply,setReply]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState("")
 async function load(){
  const [i,b]=await Promise.all([fetch("/api/admin/inquiries"),fetch("/api/admin/bookings")])
  if(i.status===403||b.status===403){window.location.href="/login?next=/admin";return}
  const id=await i.json(),bd=await b.json()
  if(!i.ok||!b.ok){setError("Unable to load the admin dashboard.");return}
  setInquiries(id);setBookings(bd)
 }
 useEffect(()=>{load().finally(()=>setLoading(false))},[])
 async function updateStatus(id:string,status:string){
  const r=await fetch("/api/admin/inquiries",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})})
  if(r.ok) await load(); else setError("Unable to update inquiry.")
 }
 async function sendReply(){
  if(!selected||!reply.trim())return
  const r=await fetch("/api/admin/inquiries",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:selected.id,reply})})
  const d=await r.json(); if(!r.ok){setError(d.error||"Unable to send reply.");return}
  setReply("");setSelected(null);await load()
 }
 if(loading)return <div className="min-h-screen flex items-center justify-center">Loading...</div>
 return <><Navigation/><main className="min-h-screen bg-background pt-28 pb-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
  <div><p className="text-sm font-semibold text-primary uppercase tracking-wider">Administration</p><h1 className="text-4xl font-bold mt-2">Point 63 Dashboard</h1><p className="text-muted-foreground mt-2">Manage project inquiries and customer bookings.</p></div>
  {error&&<p className="rounded-md border p-4 text-sm text-destructive">{error}</p>}
  <section className="grid lg:grid-cols-2 gap-8">
   <Card><CardHeader><CardTitle>Inquiries ({inquiries.length})</CardTitle></CardHeader><CardContent className="space-y-3">
    {inquiries.length===0&&<p className="text-sm text-muted-foreground">No inquiries yet.</p>}
    {inquiries.map(x=><button key={x.id} onClick={()=>{setSelected(x);setReply(x.admin_reply||"")}} className="w-full text-left rounded-lg border p-4 hover:bg-muted/40"><div className="flex justify-between gap-3"><span className="font-medium">{x.name}</span><span className="text-xs capitalize text-muted-foreground">{x.status}</span></div><p className="text-sm text-muted-foreground mt-1">{x.service} · {x.email}</p><p className="text-sm mt-2 line-clamp-2">{x.message}</p></button>)}
   </CardContent></Card>
   <Card><CardHeader><CardTitle>Bookings ({bookings.length})</CardTitle></CardHeader><CardContent className="space-y-3">
    {bookings.length===0&&<p className="text-sm text-muted-foreground">No bookings yet.</p>}
    {bookings.map(x=>{const service=Array.isArray(x.services)?x.services[0]?.title:x.services?.title;return <div key={x.id} className="rounded-lg border p-4"><div className="flex justify-between gap-3"><span className="font-medium">{service||x.service_id}</span><span className="text-xs capitalize text-muted-foreground">{x.status}</span></div><p className="text-sm text-muted-foreground mt-1">{new Date(x.scheduled_start).toLocaleString()}</p><p className="text-xs text-muted-foreground mt-1">Customer: {x.user_id}</p></div>})}
   </CardContent></Card>
  </section>
  <ServiceManager />
  {selected&&<Card><CardHeader><CardTitle>Inquiry from {selected.name}</CardTitle></CardHeader><CardContent className="space-y-4">
   <div className="grid sm:grid-cols-2 gap-3 text-sm"><p><strong>Email:</strong> {selected.email}</p><p><strong>Phone:</strong> {selected.phone||"Not provided"}</p><p><strong>Service:</strong> {selected.service}</p><p><strong>Budget:</strong> {selected.budget||"Not provided"}</p></div>
   <div className="rounded-lg border p-4 whitespace-pre-wrap text-sm">{selected.message}</div>
   <Select value={selected.status} onValueChange={v=>updateStatus(selected.id,v)}><SelectTrigger className="sm:w-48"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="new">New</SelectItem><SelectItem value="read">Read</SelectItem><SelectItem value="replied">Replied</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select>
   <Textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write a reply to the client..." rows={6}/><Button onClick={sendReply} disabled={!reply.trim()}>Send Reply</Button>
  </CardContent></Card>}
 </div></main><Footer/></>
}
