import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyPassword } from "@/lib/auth/password"
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const username = String(body?.username || "").trim()
  const password = String(body?.password || "")

  if (!username || !password) {
    return NextResponse.json({ error: "Missing username or password" }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: adminUser, error: adminError } = await admin
    .from("admins")
    .select("id,email,password_hash,name")
    .eq("email", username)
    .maybeSingle()

  if (adminError) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  if (adminUser) {
    if (!verifyPassword(password, adminUser.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = createSessionToken({
      sub: adminUser.id,
      username: adminUser.email,
      role: "admin",
      ttlSeconds: 60 * 60 * 24 * 30, // 30 days
    })

    const res = NextResponse.json({ ok: true, role: "admin" })
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  }

  const { data: user, error } = await admin
    .from("app_users")
    .select("id,username,password_hash,role")
    .eq("username", username)
    .single()

  if (error || !user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  if (!verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = createSessionToken({
    sub: user.id,
    username: user.username,
    role: user.role,
    ttlSeconds: 60 * 60 * 24 * 30, // 30 days
  })

  await admin.from("app_activity_events").insert({
    user_id: user.id,
    event_type: "login",
    meta: { via: "username_password" },
  })

  const res = NextResponse.json({ ok: true, role: user.role })
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
