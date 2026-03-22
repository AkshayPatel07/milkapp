import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"
import { SERVICE_CITY } from "@/lib/config"

export async function POST(request: Request) {
  const claims = await getSessionClaims()
  if (!claims) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => null)
  const fullName = String(body?.full_name || "").trim()
  const addressFull = String(body?.address_full || "").trim()
  const pincode = String(body?.pincode || "").trim()

  if (!fullName || !addressFull || !pincode) {
    return NextResponse.json({ error: "Full address is required" }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from("app_profiles")
    .upsert(
      { user_id: claims.sub, full_name: fullName, address_full: addressFull, pincode, city: SERVICE_CITY },
      { onConflict: "user_id" },
    )
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await admin.from("app_activity_events").insert({
    user_id: claims.sub,
    event_type: "profile_updated",
    meta: { city: SERVICE_CITY },
  })

  return NextResponse.json({ ok: true, profile: data })
}

