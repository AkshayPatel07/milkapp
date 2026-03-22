import crypto from "crypto"

type Json = Record<string, any>

function base64UrlEncode(input: Buffer | string) {
  const buf = typeof input === "string" ? Buffer.from(input) : input
  return buf.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function base64UrlDecode(input: string) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4))
  return Buffer.from(b64 + pad, "base64")
}

export type SessionClaims = {
  sub: string
  username: string
  role: "user" | "admin"
  exp: number // epoch seconds
}

export function signSession(claims: SessionClaims, secret: string) {
  const payload = base64UrlEncode(JSON.stringify(claims))
  const sig = crypto.createHmac("sha256", secret).update(payload).digest()
  return `${payload}.${base64UrlEncode(sig)}`
}

export function verifySession(token: string, secret: string) {
  const [payloadB64, sigB64] = token.split(".")
  if (!payloadB64 || !sigB64) return null

  const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest()
  const actual = base64UrlDecode(sigB64)
  if (expected.length !== actual.length) return null
  if (!crypto.timingSafeEqual(expected, actual)) return null

  let claims: SessionClaims
  try {
    claims = JSON.parse(base64UrlDecode(payloadB64).toString("utf8")) as SessionClaims
  } catch {
    return null
  }

  if (!claims?.sub || !claims?.exp || !claims?.username || !claims?.role) return null
  if (Date.now() / 1000 > claims.exp) return null
  return claims
}

export function signOtpToken(payload: Json, secret: string, ttlSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const body = { ...payload, exp }
  const encoded = base64UrlEncode(JSON.stringify(body))
  const sig = crypto.createHmac("sha256", secret).update(encoded).digest()
  return `${encoded}.${base64UrlEncode(sig)}`
}

export function verifyOtpToken(token: string, secret: string) {
  const [payloadB64, sigB64] = token.split(".")
  if (!payloadB64 || !sigB64) return null

  const expected = crypto.createHmac("sha256", secret).update(payloadB64).digest()
  const actual = base64UrlDecode(sigB64)
  if (expected.length !== actual.length) return null
  if (!crypto.timingSafeEqual(expected, actual)) return null

  let body: Json
  try {
    body = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"))
  } catch {
    return null
  }

  if (!body?.exp || Date.now() / 1000 > Number(body.exp)) return null
  return body
}

