export type SubscriptionRequest = {
  productName: string
  quantity: number
  unit: string
  city: string
  requestedAt: string
}

const STORAGE_KEY = "milk-daily-subscription-request"

export function saveSubscriptionRequest(request: SubscriptionRequest) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(request))
}

export function loadSubscriptionRequest(): SubscriptionRequest | null {
  if (typeof window === "undefined") return null
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as SubscriptionRequest
  } catch {
    return null
  }
}

export function clearSubscriptionRequest() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}
