import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export async function GET(request: Request) {
  const claims = await getSessionClaims()
  if (!claims || claims.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const day = searchParams.get("day") || todayISO()

  const admin = createAdminClient()
  const { data: inv } = await admin.from("app_inventory_days").select("day,total_liters").eq("day", day).maybeSingle()

  const { data: subs } = await admin
    .from("app_subscriptions")
    .select("user_id,liters_per_day,status,pause_until")
    .order("updated_at", { ascending: false })

  const activeSubs = (subs || []).filter((s: any) => s.status === "active")
  const demandLiters = activeSubs.reduce((sum: number, s: any) => sum + Number(s.liters_per_day || 0), 0)

  const userIds = activeSubs.map((s: any) => s.user_id)
  const { data: profiles } = userIds.length
    ? await admin.from("app_profiles").select("user_id,full_name,address_full,pincode,city").in("user_id", userIds)
    : { data: [] as any[] }
  const { data: users } = userIds.length
    ? await admin.from("app_users").select("id,phone").in("id", userIds)
    : { data: [] as any[] }

  const phoneMap: Record<string, string> = {}
  ;(users || []).forEach((u: any) => (phoneMap[u.id] = u.phone))

  const profilesWithPhone = (profiles || []).map((p: any) => ({ ...p, phone: phoneMap[p.user_id] || "" }))

  return NextResponse.json({
    day,
    inventory: inv || null,
    demand_liters: demandLiters,
    active_subscriptions: activeSubs,
    profiles: profilesWithPhone,
  })
}

export async function POST(request: Request) {
  const claims = await getSessionClaims()
  if (!claims || claims.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await request.json().catch(() => null)
  const day = String(body?.day || todayISO())
  const totalLiters = Math.max(0, Number(body?.total_liters) || 0)

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("app_inventory_days")
    .upsert({ day, total_liters: totalLiters }, { onConflict: "day" })
    .select("day,total_liters")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, inventory: data })
}
