import crypto from "crypto"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { normalizePhoneToE164 } from "@/lib/auth/phone"
import { getAuthSecret } from "@/lib/auth/server"
import { signOtpToken } from "@/lib/auth/session"
import { getOtpLength, TWO_FACTOR_HASH_PREFIX } from "@/lib/auth/otp-config"
import { verifyTwoFactorOtp } from "@/lib/sms"

function hashOtp(otp: string, salt: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(`${salt}:${otp}`).digest("hex")
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const phone = normalizePhoneToE164(String(body?.phone || ""))
  const otp = String(body?.otp || "").trim()
  const otpLength = getOtpLength()
  if (!phone || otp.length !== otpLength) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  if (process.env.APP_OTP_DEV_MODE === "true") {
    const otpToken = signOtpToken({ phone, purpose: "register" }, getAuthSecret(), 10 * 60)
    return NextResponse.json({ ok: true, otp_token: otpToken, dev_bypass: true })
  }

  const admin = createAdminClient()
  const { data: reqRow, error } = await admin
    .from("app_otp_requests")
    .select("id,otp_hash,expires_at,attempts,consumed_at")
    .eq("phone", phone)
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !reqRow) return NextResponse.json({ error: "OTP expired" }, { status: 400 })
  if (new Date(reqRow.expires_at).getTime() < Date.now()) return NextResponse.json({ error: "OTP expired" }, { status: 400 })
  if (reqRow.attempts >= 5) return NextResponse.json({ error: "Too many attempts" }, { status: 429 })

  const otpHash = String(reqRow.otp_hash || "")
  if (otpHash.startsWith(TWO_FACTOR_HASH_PREFIX)) {
    const sessionId = otpHash.slice(TWO_FACTOR_HASH_PREFIX.length)
    const ok = await verifyTwoFactorOtp(sessionId, otp)
    if (!ok) {
      await admin.from("app_otp_requests").update({ attempts: reqRow.attempts + 1 }).eq("id", reqRow.id)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }
  } else {
    const [salt, expected] = otpHash.split("$")
    const actual = hashOtp(otp, salt || "")
    const expectedBuf = expected ? Buffer.from(expected, "hex") : null
    const actualBuf = Buffer.from(actual, "hex")
    if (!expectedBuf || expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      await admin.from("app_otp_requests").update({ attempts: reqRow.attempts + 1 }).eq("id", reqRow.id)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }
  }

  await admin.from("app_otp_requests").update({ consumed_at: new Date().toISOString() }).eq("id", reqRow.id)

  const otpToken = signOtpToken({ phone, purpose: "register" }, getAuthSecret(), 10 * 60)
  return NextResponse.json({ ok: true, otp_token: otpToken })
}
