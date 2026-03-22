export const SERVICE_CITY = "Navsari"

export const BUSINESS_PHONE_RAW = "9537781635"
export const BUSINESS_PHONE_E164 = `+91${BUSINESS_PHONE_RAW}`
export const BUSINESS_PHONE_DISPLAY = "+91 95377 81635"

// WhatsApp "wa.me" requires country code + number without "+" or spaces
export const WHATSAPP_NUMBER = `91${BUSINESS_PHONE_RAW}`

// Admin access is granted to this phone number (Supabase phone auth, E.164 format).
export const ADMIN_PHONE_E164 = BUSINESS_PHONE_E164

