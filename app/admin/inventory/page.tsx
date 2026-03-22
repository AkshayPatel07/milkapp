"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type InventoryRow = {
  day: string
  total_liters: number
}

type SubscriptionRow = {
  user_id: string
  liters_per_day: number
  status: "active" | "paused"
  pause_until: string | null
}

type ProfileRow = {
  user_id: string
  full_name: string
  phone: string
  address_full: string
  pincode: string
  city: string
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function InventoryPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [day] = useState(todayISO())
  const [totalLiters, setTotalLiters] = useState<string>("")
  const [inventory, setInventory] = useState<InventoryRow | null>(null)

  const [subs, setSubs] = useState<SubscriptionRow[]>([])
  const [profiles, setProfiles] = useState<Record<string, ProfileRow>>({})

  const demandLiters = subs.reduce((sum, s) => sum + Number(s.liters_per_day || 0), 0)

  const remainingLiters = (Number(inventory?.total_liters ?? 0) || 0) - demandLiters

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/admin/inventory?day=${encodeURIComponent(day)}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || "Failed to load inventory")
        if (!mounted) return

        setInventory(data.inventory || null)
        setTotalLiters(data.inventory?.total_liters != null ? String(data.inventory.total_liters) : "")

        const activeSubs = ((data.active_subscriptions as any) || []) as SubscriptionRow[]
        setSubs(activeSubs)

        const map: Record<string, ProfileRow> = {}
        ;(((data.profiles as any) || []) as ProfileRow[]).forEach((p) => (map[p.user_id] = p))
        setProfiles(map)
      } catch (e: any) {
        setError(e?.message || "Failed to load inventory")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [day])

  async function saveInventory() {
    setSaving(true)
    setError(null)
    try {
      const liters = Math.max(0, Number(totalLiters) || 0)
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ day, total_liters: liters }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to save")
      setInventory(data.inventory || null)
    } catch (e: any) {
      setError(e?.message || "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-foreground">Today: {day}</p>
        </div>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}
        {loading ? <div>Loading...</div> : null}

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="pt-4">
              <CardTitle className="text-base">Set Today’s Milk (Liters)</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 space-y-3">
              <Input value={totalLiters} onChange={(e) => setTotalLiters(e.target.value)} inputMode="decimal" />
              <Button onClick={saveInventory} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <div className="text-sm text-foreground">
                <div>Expected demand: <span className="font-medium">{demandLiters.toFixed(2)} L</span></div>
                <div>
                  Remaining:{" "}
                  <span className={`font-medium ${remainingLiters < 0 ? "text-destructive" : ""}`}>
                    {remainingLiters.toFixed(2)} L
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pt-4">
              <CardTitle className="text-base">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {subs.filter((s) => s.status === "active").length === 0 ? (
                <div className="text-sm text-foreground">No active subscriptions.</div>
              ) : (
                <div className="space-y-3">
                  {subs
                    .filter((s) => s.status === "active")
                    .map((s) => {
                      const p = profiles[s.user_id]
                      return (
                        <div key={s.user_id} className="border rounded-lg p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="font-semibold">{p?.full_name || "Customer"}</div>
                            <div className="text-sm">
                              <span className="font-medium">{Number(s.liters_per_day).toFixed(2)} L/day</span>
                            </div>
                          </div>
                          <div className="text-sm text-foreground mt-1">{p?.phone || ""}</div>
                          <div className="text-sm text-foreground mt-1">
                            {p?.address_full ? `${p.address_full}, ${p.city} - ${p.pincode}` : "Address not added"}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
