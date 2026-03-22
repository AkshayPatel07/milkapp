import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"

export async function GET() {
  const claims = await getSessionClaims()
  if (!claims || claims.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const admin = createAdminClient()
  const { data: profiles, error } = await admin
    .from("app_profiles")
    .select("user_id,full_name,address_full,pincode,city,created_at")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const userIds = (profiles || []).map((p: any) => p.user_id)
  const { data: users } = userIds.length
    ? await admin.from("app_users").select("id,username,phone,role").in("id", userIds)
    : { data: [] as any[] }
  const { data: subs } = userIds.length
    ? await admin.from("app_subscriptions").select("user_id,status,liters_per_day,pause_until").in("user_id", userIds)
    : { data: [] as any[] }

  const userMap: Record<string, any> = {}
  ;(users || []).forEach((u: any) => (userMap[u.id] = u))
  const subMap: Record<string, any> = {}
  ;(subs || []).forEach((s: any) => (subMap[s.user_id] = s))

  const rows = (profiles || []).map((p: any) => ({
    user_id: p.user_id,
    username: userMap[p.user_id]?.username || null,
    phone: userMap[p.user_id]?.phone || null,
    role: userMap[p.user_id]?.role || "user",
    full_name: p.full_name,
    address_full: p.address_full,
    pincode: p.pincode,
    city: p.city,
    created_at: p.created_at,
    subscription: subMap[p.user_id] || null,
  }))

  return NextResponse.json({ customers: rows })
}

