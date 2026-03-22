import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyOtpToken } from "@/lib/auth/session"
import { getAuthSecret, SESSION_COOKIE_NAME, createSessionToken } from "@/lib/auth/server"
import { hashPassword } from "@/lib/auth/password"
import { ADMIN_PHONE_E164, SERVICE_CITY } from "@/lib/config"

function validUsername(username: string) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username)
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const otpToken = String(body?.otp_token || "")
  const username = String(body?.username || "").trim()
  const password = String(body?.password || "")

  const fullName = String(body?.full_name || "").trim()
  const addressFull = String(body?.address_full || "").trim()
  const pincode = String(body?.pincode || "").trim()

  if (!otpToken) return NextResponse.json({ error: "Missing otp_token" }, { status: 400 })
  if (!validUsername(username)) return NextResponse.json({ error: "Username must be 3-20 chars (letters/numbers/_)" }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
  if (!fullName || !addressFull || !pincode) return NextResponse.json({ error: "Full address is required" }, { status: 400 })

  const payload = verifyOtpToken(otpToken, getAuthSecret())
  if (!payload || payload.purpose !== "register" || !payload.phone) {
    return NextResponse.json({ error: "OTP token expired" }, { status: 400 })
  }

  const phone = String(payload.phone)
  const role = phone === ADMIN_PHONE_E164 ? "admin" : "user"

  const admin = createAdminClient()

  const passwordHash = hashPassword(password)
  const { data: user, error: userError } = await admin
    .from("app_users")
    .insert({ username, phone, password_hash: passwordHash, role })
    .select("id,username,role")
    .single()

  if (userError) return NextResponse.json({ error: userError.message }, { status: 400 })

  const { error: profileError } = await admin.from("app_profiles").insert({
    user_id: user.id,
    full_name: fullName,
    address_full: addressFull,
    pincode,
    city: SERVICE_CITY,
  })
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

  await admin.from("app_activity_events").insert({
    user_id: user.id,
    event_type: "registered",
    meta: { via: "otp" },
  })

  const sessionToken = createSessionToken({
    sub: user.id,
    username: user.username,
    role: user.role,
    ttlSeconds: 60 * 60 * 24 * 30,
  })

  const res = NextResponse.json({ ok: true, role: user.role })
  res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}

