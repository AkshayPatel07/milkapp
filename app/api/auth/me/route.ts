import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionClaims } from "@/lib/auth/server"

export async function GET() {
  const claims = await getSessionClaims()
  if (!claims) return NextResponse.json({ user: null }, { status: 200 })

  const admin = createAdminClient()
  if (claims.role === "admin") {
    const { data: adminUser } = await admin
      .from("admins")
      .select("id,email,name,created_at")
      .eq("id", claims.sub)
      .maybeSingle()

    return NextResponse.json({
      user: adminUser
        ? { id: adminUser.id, username: adminUser.email, phone: null, role: "admin", created_at: adminUser.created_at }
        : null,
      profile: null,
      subscription: null,
    })
  }

  const { data: user } = await admin
    .from("app_users")
    .select("id,username,phone,role,created_at")
    .eq("id", claims.sub)
    .maybeSingle()

  const { data: profile } = await admin.from("app_profiles").select("*").eq("user_id", claims.sub).maybeSingle()
  const { data: subscription } = await admin.from("app_subscriptions").select("*").eq("user_id", claims.sub).maybeSingle()

  return NextResponse.json({
    user: user
      ? { id: user.id, username: user.username, phone: user.phone, role: user.role, created_at: user.created_at }
      : null,
    profile: profile || null,
    subscription: subscription || null,
  })
}
