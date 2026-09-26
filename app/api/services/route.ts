import { NextResponse } from "next/server"
import { createService, getAllServices, isAdmin, updateService, deleteService } from "@/lib/services-store"

export async function GET() { return NextResponse.json(await getAllServices()) }
export async function POST(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await request.json()
  if (!body.title || !body.description || !body.videoUrl) return NextResponse.json({ error: "Title, description, and video are required" }, { status: 400 })
  return NextResponse.json(await createService({ title: body.title, description: body.description, features: body.features ?? [], videoUrl: body.videoUrl, sortOrder: body.sortOrder ?? (await getAllServices()).length }), { status: 201 })
}

export async function PUT(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, ...data } = await request.json()
  const service = await updateService(id, data)
  return service ? NextResponse.json(service) : NextResponse.json({ error: "Not found" }, { status: 404 })
}
export async function DELETE(request: Request) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await request.json()
  return (await deleteService(id)) ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 })
}
