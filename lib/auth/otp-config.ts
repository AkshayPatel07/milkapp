const DEFAULT_OTP_LENGTH = 6
const DEFAULT_OTP_EXPIRES_MINUTES = 5

export const TWO_FACTOR_HASH_PREFIX = "2factor$"

export function getOtpLength() {
  const raw = Number(process.env.APP_OTP_LENGTH || String(DEFAULT_OTP_LENGTH))
  if (!Number.isFinite(raw)) return DEFAULT_OTP_LENGTH
  if (raw < 4) return 4
  if (raw > 8) return 8
  return Math.floor(raw)
}

export function getOtpExpiresMinutes() {
  const raw = Number(process.env.APP_OTP_EXPIRES_MINUTES || String(DEFAULT_OTP_EXPIRES_MINUTES))
  if (!Number.isFinite(raw)) return DEFAULT_OTP_EXPIRES_MINUTES
  if (raw < 1) return 1
  if (raw > 30) return 30
  return Math.floor(raw)
}
