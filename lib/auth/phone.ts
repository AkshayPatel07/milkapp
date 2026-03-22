export function normalizePhoneToE164(phone: string) {
  const digits = phone.replace(/[^\d]/g, "")
  if (digits.length === 10) return `+91${digits}`
  if (digits.startsWith("91") && digits.length === 12) return `+${digits}`
  if (phone.startsWith("+") && digits.length >= 10) return `+${digits}`
  return phone.trim()
}

