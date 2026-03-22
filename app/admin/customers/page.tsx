"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Phone, MapPin } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { SERVICE_CITY } from "@/lib/config"
import { Button } from "@/components/ui/button"

type CustomerRow = {
  user_id: string
  username: string | null
  phone: string | null
  role: "user" | "admin"
  full_name: string
  address_full: string
  pincode: string
  city: string
  created_at: string
  subscription: null | {
    status: "active" | "paused"
    liters_per_day: number
    pause_until: string | null
  }
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<CustomerRow[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/customers", { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || "Failed to load customers")
        if (!mounted) return
        setCustomers((data.customers || []) as CustomerRow[])
      } catch (e: any) {
        setError(e?.message || "Failed to load customers")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = customers.filter((c) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return (
      c.full_name.toLowerCase().includes(q) ||
      (c.username || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      c.address_full.toLowerCase().includes(q) ||
      c.pincode.toLowerCase().includes(q)
    )
  })

  const activeCount = customers.filter((c) => c.subscription?.status === "active").length
  const pausedCount = customers.filter((c) => c.subscription?.status === "paused").length

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-foreground">Addresses and subscriptions ({SERVICE_CITY} only)</p>
        </div>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <Input
                placeholder="Search by name, username, phone, address, or pincode..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {error ? <div className="text-sm text-destructive mb-4">{error}</div> : null}
        {loading ? <div className="text-sm text-foreground mb-4">Loading...</div> : null}

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{activeCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium">Paused Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{pausedCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {filtered.map((c) => (
            <Card key={c.user_id}>
              <CardHeader className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{c.full_name}</CardTitle>
                      {c.subscription ? (
                        <div
                          className={`rounded-full text-sm px-2 shrink-0 ${
                            c.subscription.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {c.subscription.status}
                        </div>
                      ) : (
                        <div className="bg-muted text-foreground rounded-full text-sm px-2 shrink-0">no subscription</div>
                      )}
                    </div>
                    <CardDescription>
                      @{c.username || "-"} • Customer since {new Date(c.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">Daily</p>
                    <p className="text-2xl font-bold">{c.subscription ? `${Number(c.subscription.liters_per_day).toFixed(2)} L` : "-"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-foreground" />
                      <span>{c.phone || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-foreground" />
                      <span>
                        {c.address_full}, {c.city} - {c.pincode}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-foreground">Subscription</p>
                      <p className="text-sm font-semibold">
                        {c.subscription ? `${c.subscription.status}${c.subscription.pause_until ? ` (until ${c.subscription.pause_until})` : ""}` : "Not started"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {c.phone ? (
                        <Button className="text-sm py-2" variant="outline" asChild>
                          <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}>Call</a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

