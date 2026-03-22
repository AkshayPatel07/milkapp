import { WHATSAPP_NUMBER } from "@/lib/config"

export function buildWhatsAppUrl(message: string) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export function openWhatsApp(message: string) {
  if (typeof window === "undefined") return
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer")
}

