import crypto from "crypto"

const KEY_LENGTH = 64

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16)
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH)
  return `scrypt$${salt.toString("base64")}$${derivedKey.toString("base64")}`
}

export function verifyPassword(password: string, stored: string) {
  const [algo, saltB64, hashB64] = stored.split("$")
  if (algo !== "scrypt" || !saltB64 || !hashB64) return false

  const salt = Buffer.from(saltB64, "base64")
  const expected = Buffer.from(hashB64, "base64")
  const actual = crypto.scryptSync(password, salt, expected.length)
  return crypto.timingSafeEqual(expected, actual)
}

