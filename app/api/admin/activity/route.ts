import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"

export async function GET() {
  const claims = await getSessionClaims()
  if (!claims || claims.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const admin = createAdminClient()
  const { data: events, error } = await admin
    .from("app_activity_events")
    .select("id,user_id,event_type,meta,created_at")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const userIds = Array.from(new Set((events || []).map((e: any) => e.user_id).filter(Boolean)))
  const { data: users } = userIds.length ? await admin.from("app_users").select("id,username,phone").in("id", userIds) : { data: [] as any[] }
  const map: Record<string, any> = {}
  ;(users || []).forEach((u: any) => (map[u.id] = u))

  const rows = (events || []).map((e: any) => ({
    ...e,
    user: e.user_id ? map[e.user_id] || null : null,
  }))

  return NextResponse.json({ events: rows })
}

