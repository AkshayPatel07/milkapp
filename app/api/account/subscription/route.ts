import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"

export async function POST(request: Request) {
  const claims = await getSessionClaims()
  if (!claims) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => null)
  const liters = Math.max(0.5, Number(body?.liters_per_day) || 1)
  const status = body?.status === "paused" ? "paused" : "active"
  const pauseUntil = body?.pause_until ? String(body.pause_until) : null

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("app_subscriptions")
    .upsert(
      { user_id: claims.sub, liters_per_day: liters, status, pause_until: status === "paused" ? pauseUntil : null },
      { onConflict: "user_id" },
    )
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from("app_activity_events").insert({
    user_id: claims.sub,
    event_type: status === "active" ? "subscription_resumed" : "subscription_paused",
    meta: { liters_per_day: liters, pause_until: pauseUntil },
  })

  return NextResponse.json({ ok: true, subscription: data })
}

