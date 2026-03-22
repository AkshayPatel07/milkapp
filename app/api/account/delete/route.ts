import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims, SESSION_COOKIE_NAME } from "@/lib/auth/server"

export async function POST() {
  const claims = await getSessionClaims()
  if (!claims) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createAdminClient()

  await admin.from("app_activity_events").insert({
    user_id: claims.sub,
    event_type: "account_deleted",
    meta: {},
  })

  const { error } = await admin.from("app_users").delete().eq("id", claims.sub)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return res
}

