import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

async function requireAdmin() {
  const claims = await getSessionClaims()
  if (!claims) return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  if (claims.role !== "admin") return { ok: false as const, response: forbidden() }
  return { ok: true as const }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => null)
  const name = String(body?.name || "").trim()
  const description = String(body?.description || "").trim()
  const unit = String(body?.unit || "").trim()
  const category = String(body?.category || "").trim()
  const image_url = String(body?.image_url || "/placeholder.svg?height=200&width=200")
  const in_stock = body?.in_stock !== false
  const price = Number(body?.price)

  if (!name || !unit || !Number.isFinite(price)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("products")
    .insert({ name, description, price, unit, category, image_url, in_stock })
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => null)
  const id = String(body?.id || "").trim()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const update: Record<string, any> = {}
  if (body?.name != null) update.name = String(body.name).trim()
  if (body?.description != null) update.description = String(body.description).trim()
  if (body?.unit != null) update.unit = String(body.unit).trim()
  if (body?.category != null) update.category = String(body.category).trim()
  if (body?.image_url != null) update.image_url = String(body.image_url).trim()
  if (body?.in_stock != null) update.in_stock = Boolean(body.in_stock)
  if (body?.price != null) update.price = Number(body.price)

  const admin = createAdminClient()
  const { data, error } = await admin.from("products").update(update).eq("id", id).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.response

  const { searchParams } = new URL(request.url)
  const id = String(searchParams.get("id") || "").trim()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from("products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
