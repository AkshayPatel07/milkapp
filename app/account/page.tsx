"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BUSINESS_PHONE_DISPLAY, SERVICE_CITY } from "@/lib/config"
import { clearSubscriptionRequest, loadSubscriptionRequest, type SubscriptionRequest } from "@/lib/subscription-request"

type MeResponse = {
  user: null | { id: string; username: string; phone: string; role: "user" | "admin" }
  profile: null | { full_name: string; address_full: string; pincode: string; city: string }
  subscription: null | { liters_per_day: number; status: "active" | "paused"; pause_until: string | null }
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [me, setMe] = useState<MeResponse | null>(null)

  const [fullName, setFullName] = useState("")
  const [addressFull, setAddressFull] = useState("")
  const [pincode, setPincode] = useState("")
  const [litersPerDay, setLitersPerDay] = useState("1")
  const [pauseUntil, setPauseUntil] = useState<string>("")
  const [subscriptionRequest, setSubscriptionRequest] = useState<SubscriptionRequest | null>(null)

  const hasAddress = Boolean(fullName.trim() && addressFull.trim() && pincode.trim())

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/auth/me", { cache: "no-store" })
      const data = (await res.json().catch(() => null)) as MeResponse | null

      if (!mounted) return
      if (!data?.user) {
        router.replace("/login?redirect=/account")
        return
      }

      setMe(data)
      setFullName(data.profile?.full_name || "")
      setAddressFull(data.profile?.address_full || "")
      setPincode(data.profile?.pincode || "")
      setLitersPerDay(String(data.subscription?.liters_per_day ?? 1))
      setPauseUntil(data.subscription?.pause_until || "")
      setSubscriptionRequest(loadSubscriptionRequest())
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [router])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  async function saveAddress() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ full_name: fullName, address_full: addressFull, pincode }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to save address")
      setMe((prev) => (prev ? { ...prev, profile: data.profile } : prev))
    } catch (e: any) {
      setError(e?.message || "Failed to save address")
    } finally {
      setSaving(false)
    }
  }

  async function updateSubscription(status: "active" | "paused") {
    if (!hasAddress) {
      setError("Please add your full address before starting a subscription.")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/account/subscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          liters_per_day: litersPerDay,
          status,
          pause_until: status === "paused" ? pauseUntil || null : null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to update subscription")
      setMe((prev) => (prev ? { ...prev, subscription: data.subscription } : prev))
    } catch (e: any) {
      setError(e?.message || "Failed to update subscription")
    } finally {
      setSaving(false)
    }
  }

  async function deleteAccount() {
    if (!confirm("Delete your account permanently?")) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/account/delete", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to delete account")
      router.push("/")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Failed to delete account")
    } finally {
      setSaving(false)
    }
  }

  function clearPendingSubscription() {
    clearSubscriptionRequest()
    setSubscriptionRequest(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4">Loading...</div>
      </div>
    )
  }

  const user = me?.user
  const isAdmin = user?.role === "admin"

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-sm text-foreground">
              {SERVICE_CITY} subscription portal • Help: {BUSINESS_PHONE_DISPLAY}
            </p>
            {user ? (
              <p className="text-sm text-foreground mt-1">
                Logged in as <span className="font-medium">{user.username}</span> • {user.phone}
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            {isAdmin ? (
              <Button variant="outline" onClick={() => router.push("/admin")}>
                Admin
              </Button>
            ) : null}
            <Button variant="outline" onClick={logout} disabled={saving}>
              Logout
            </Button>
          </div>
        </div>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}

        <Card className="py-4">
          <CardHeader>
            <CardTitle>Delivery Address (Required)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label>Full Name *</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <label>Full Address *</label>
              <Textarea
                value={addressFull}
                onChange={(e) => setAddressFull(e.target.value)}
                disabled={saving}
                placeholder="House/Flat No., Society, Street, Area, Landmark"
                rows={4}
              />
              <p className="text-xs text-foreground">City is fixed to {SERVICE_CITY}.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Pincode *</label>
                <Input value={pincode} onChange={(e) => setPincode(e.target.value)} disabled={saving} />
              </div>
              <div className="space-y-2">
                <label>City</label>
                <Input value={SERVICE_CITY} disabled />
              </div>
            </div>
            <Button onClick={saveAddress} disabled={saving || !hasAddress}>
              {saving ? "Saving..." : "Save Address"}
            </Button>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader>
            <CardTitle>Daily Milk Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasAddress ? <p className="text-sm text-foreground">Add your address first to start/continue your subscription.</p> : null}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label>Liters per day *</label>
                <Input value={litersPerDay} onChange={(e) => setLitersPerDay(e.target.value)} inputMode="decimal" disabled={saving || !hasAddress} />
              </div>
              <div className="space-y-2">
                <label>Pause until (optional)</label>
                <Input type="date" value={pauseUntil} onChange={(e) => setPauseUntil(e.target.value)} disabled={saving || !hasAddress} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => updateSubscription("active")} disabled={saving || !hasAddress}>
                {me?.subscription?.status === "active" ? "Update (Active)" : "Start / Resume"}
              </Button>
              <Button variant="outline" onClick={() => updateSubscription("paused")} disabled={saving || !hasAddress}>
                Pause
              </Button>
            </div>
            {me?.subscription ? (
              <p className="text-sm text-foreground">
                Status: <span className="font-medium">{me.subscription.status}</span>
                {me.subscription.status === "paused" && me.subscription.pause_until ? ` (until ${me.subscription.pause_until})` : ""}
              </p>
            ) : (
              <p className="text-sm text-foreground">No subscription yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader>
            <CardTitle>Subscription Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriptionRequest ? (
              <>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Daily Milk Subscription</span> for {subscriptionRequest.productName}
                </p>
                <p className="text-sm text-foreground">
                  Quantity: <span className="font-medium">{subscriptionRequest.quantity} {subscriptionRequest.unit} per day</span>
                </p>
                <p className="text-sm text-foreground">
                  City: <span className="font-medium">{subscriptionRequest.city}</span>
                </p>
                <p className="text-xs text-foreground">
                  Requested on {new Date(subscriptionRequest.requestedAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={clearPendingSubscription}>
                    Clear Request
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-foreground">No pending subscription request from this device.</p>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground">Deleting your account removes your subscription and address.</p>
            <Button variant="destructive" onClick={deleteAccount} disabled={saving}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
