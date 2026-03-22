import crypto from "crypto"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { normalizePhoneToE164 } from "@/lib/auth/phone"
import { getAuthSecret } from "@/lib/auth/server"
import { sendOtpSms, sendTwoFactorCustomOtp, sendTwoFactorOtp } from "@/lib/sms"
import { getOtpExpiresMinutes, getOtpLength, TWO_FACTOR_HASH_PREFIX } from "@/lib/auth/otp-config"

function generateOtp(length: number) {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return String(Math.floor(min + Math.random() * (max - min + 1)))
}

function hashOtp(otp: string, salt: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(`${salt}:${otp}`).digest("hex")
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const phone = normalizePhoneToE164(String(body?.phone || ""))
  if (!phone.startsWith("+") || phone.length < 10) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 })
  }

  const admin = createAdminClient()

  await admin.from("app_otp_requests").update({ consumed_at: new Date().toISOString() }).eq("phone", phone).is("consumed_at", null)

  const provider = (process.env.APP_SMS_PROVIDER || "none").toLowerCase()
  const devMode = process.env.APP_OTP_DEV_MODE === "true"
  const otpLength = getOtpLength()
  const expiresMinutes = getOtpExpiresMinutes()
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000).toISOString()

  let otp = ""
  let otpHash = ""

  if (provider === "2factor" && !devMode) {
    const mode = (process.env.TWOFACTOR_MODE || "autogen").toLowerCase()
    if (mode === "custom") {
      otp = generateOtp(otpLength)
      const salt = crypto.randomBytes(8).toString("hex")
      otpHash = `${salt}$${hashOtp(otp, salt)}`
    } else {
      const result = await sendTwoFactorOtp(phone)
      otpHash = `${TWO_FACTOR_HASH_PREFIX}${result.sessionId}`
    }
  } else {
    otp = generateOtp(otpLength)
    const salt = crypto.randomBytes(8).toString("hex")
    otpHash = `${salt}$${hashOtp(otp, salt)}`
  }

  const { data: inserted, error } = await admin
    .from("app_otp_requests")
    .insert({
      phone,
      otp_hash: otpHash,
      expires_at: expiresAt,
    })
    .select("id")
    .single()

  if (error || !inserted?.id) return NextResponse.json({ error: error?.message || "Failed to create OTP" }, { status: 500 })

  if (!devMode) {
    try {
      if (provider === "2factor") {
        const mode = (process.env.TWOFACTOR_MODE || "autogen").toLowerCase()
        if (mode === "custom") {
          await sendTwoFactorCustomOtp(phone, otp)
        }
      } else {
        await sendOtpSms({ toE164: phone, otp, expiresMinutes })
      }
    } catch (e: any) {
      console.error("OTP SMS send failed:", e)
      await admin.from("app_otp_requests").update({ consumed_at: new Date().toISOString() }).eq("id", inserted.id)
      return NextResponse.json({ error: "Failed to deliver OTP. Please try again later." }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, dev_otp: devMode ? otp : undefined })
}
