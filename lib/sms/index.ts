type SendOtpSmsParams = {
  toE164: string
  otp: string
  expiresMinutes: number
}

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var: ${name}`)
  return value
}

function formatOtpMessage(otp: string, expiresMinutes: number) {
  const template =
    process.env.APP_OTP_SMS_TEMPLATE || "Your OTP is {otp}. It expires in {minutes} minutes."
  return template.replaceAll("{otp}", otp).replaceAll("{minutes}", String(expiresMinutes))
}

async function sendTwilioSms(toE164: string, body: string) {
  const accountSid = requireEnv("TWILIO_ACCOUNT_SID")
  const authToken = requireEnv("TWILIO_AUTH_TOKEN")
  const from = process.env.TWILIO_FROM || process.env.TWILIO_WHATSAPP_FROM || ""
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID || ""

  if (!from && !messagingServiceSid) {
    throw new Error("Missing env var: TWILIO_FROM (or TWILIO_MESSAGING_SERVICE_SID)")
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const params = new URLSearchParams()
  params.set("To", toE164)
  params.set("Body", body)
  if (messagingServiceSid) params.set("MessagingServiceSid", messagingServiceSid)
  else params.set("From", from)

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64")
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Twilio send failed (${res.status}): ${text || res.statusText}`)
  }
}

type TwoFactorSendResult = {
  sessionId: string
}

function getTwoFactorBaseUrl() {
  return process.env.TWOFACTOR_BASE_URL || "https://2factor.in/API/V1"
}

function buildTwoFactorAutogenUrl(toE164: string) {
  const apiKey = requireEnv("TWOFACTOR_API_KEY")
  const template = process.env.TWOFACTOR_OTP_TEMPLATE || ""
  const baseUrl = getTwoFactorBaseUrl()

  const safePhone = encodeURIComponent(toE164)
  if (template) {
    const safeTemplate = encodeURIComponent(template)
    return `${baseUrl}/${apiKey}/SMS/${safePhone}/AUTOGEN/${safeTemplate}`
  }
  return `${baseUrl}/${apiKey}/SMS/${safePhone}/AUTOGEN`
}

function buildTwoFactorCustomOtpUrl(toE164: string, otp: string) {
  const apiKey = requireEnv("TWOFACTOR_API_KEY")
  const baseUrl = getTwoFactorBaseUrl()
  const safePhone = encodeURIComponent(toE164)
  const safeOtp = encodeURIComponent(otp)
  return `${baseUrl}/${apiKey}/SMS/${safePhone}/${safeOtp}`
}

export async function sendTwoFactorOtp(toE164: string): Promise<TwoFactorSendResult> {
  const url = buildTwoFactorAutogenUrl(toE164)
  const res = await fetch(url, { method: "GET" })
  const data = await res.json().catch(() => null)

  if (!res.ok || !data || data.Status !== "Success" || !data.Details) {
    const details = data?.Details || res.statusText
    throw new Error(`2Factor send failed (${res.status}): ${details}`)
  }

  return { sessionId: String(data.Details) }
}

export async function sendTwoFactorCustomOtp(toE164: string, otp: string): Promise<void> {
  const url = buildTwoFactorCustomOtpUrl(toE164, otp)
  const res = await fetch(url, { method: "POST" })
  const data = await res.json().catch(() => null)

  if (!res.ok || !data || data.Status !== "Success") {
    const details = data?.Details || res.statusText
    throw new Error(`2Factor custom OTP send failed (${res.status}): ${details}`)
  }
}

export async function verifyTwoFactorOtp(sessionId: string, otp: string): Promise<boolean> {
  const apiKey = requireEnv("TWOFACTOR_API_KEY")
  const baseUrl = getTwoFactorBaseUrl()
  const safeSession = encodeURIComponent(sessionId)
  const safeOtp = encodeURIComponent(otp)
  const url = `${baseUrl}/${apiKey}/SMS/VERIFY/${safeSession}/${safeOtp}`

  const res = await fetch(url, { method: "GET" })
  const data = await res.json().catch(() => null)

  if (!res.ok || !data) return false
  return data.Status === "Success"
}

export async function sendOtpSms(params: SendOtpSmsParams) {
  const provider = (process.env.APP_SMS_PROVIDER || "none").toLowerCase()
  const body = formatOtpMessage(params.otp, params.expiresMinutes)

  if (provider === "console") {
    console.log(`[OTP] to=${params.toE164} otp=${params.otp} expires=${params.expiresMinutes}m`)
    return
  }

  if (provider === "twilio" || provider === "whatsapp") {
    await sendTwilioSms(params.toE164, body)
    return
  }

  throw new Error(
    "SMS provider not configured. Set APP_SMS_PROVIDER=twilio, whatsapp, or console and required credentials.",
  )
}
