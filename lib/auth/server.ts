import { cookies } from "next/headers"
import { signSession, verifySession, type SessionClaims } from "@/lib/auth/session"

export const SESSION_COOKIE_NAME = "milk_session"

export function getAuthSecret() {
  const secret = process.env.APP_AUTH_SECRET
  if (!secret) {
    // For development, use a default secret
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] WARNING: Using default dev secret for APP_AUTH_SECRET. Set APP_AUTH_SECRET in production!")
      return "dev-secret-do-not-use-in-production-key-32-chars-long-ok"
    }
    throw new Error("Missing APP_AUTH_SECRET. This must be set as an environment variable in production.")
  }
  return secret
}

export async function getSessionClaims(): Promise<SessionClaims | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token, getAuthSecret())
}

export function createSessionToken(claims: Omit<SessionClaims, "exp"> & { ttlSeconds: number }) {
  const exp = Math.floor(Date.now() / 1000) + claims.ttlSeconds
  return signSession({ sub: claims.sub, username: claims.username, role: claims.role, exp }, getAuthSecret())
}

