"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ActivityRow = {
  id: string
  user_id: string | null
  event_type: string
  meta: any
  created_at: string
  user: null | { username: string; phone: string }
}

export default function ActivityPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<ActivityRow[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/admin/activity", { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || "Failed to load activity")
        const rows = ((data.events as any) || []) as ActivityRow[]
        if (!mounted) return
        setEvents(rows)
      } catch (e: any) {
        setError(e?.message || "Failed to load activity")
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Activity</h1>
          <p className="text-sm text-foreground">Latest 100 events</p>
        </div>

        {error ? <div className="text-sm text-destructive">{error}</div> : null}
        {loading ? <div>Loading...</div> : null}

        <Card>
          <CardHeader className="pt-4">
            <CardTitle className="text-base">Events</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            {events.length === 0 ? (
              <div className="text-sm text-foreground">No activity yet.</div>
            ) : (
              <div className="space-y-3">
                {events.map((e) => (
                  <div key={e.id} className="border rounded-lg p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-semibold">{e.event_type}</div>
                      <div className="text-xs text-foreground">{new Date(e.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-foreground mt-1">
                      {e.user ? `${e.user.username} • ${e.user.phone}` : e.user_id || "unknown user"}
                    </div>
                    {e.meta && Object.keys(e.meta).length ? (
                      <pre className="mt-2 text-xs bg-muted/50 rounded p-2 overflow-auto">{JSON.stringify(e.meta, null, 2)}</pre>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

