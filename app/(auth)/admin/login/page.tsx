"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BUSINESS_PHONE_DISPLAY } from "@/lib/config"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.role === "admin") {
          router.replace("/admin")
        }
      })
      .catch(() => {
        // ignore, allow login form to show
      })
  }, [router])

  async function submitLogin() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Login failed")
      router.push("/admin")
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Help: {BUSINESS_PHONE_DISPLAY}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? <div className="text-sm text-destructive">{error}</div> : null}
          <div className="space-y-2">
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="username"
              placeholder="admin@freshmilk.com"
            />
          </div>
          <div className="space-y-2">
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <Button className="w-full" onClick={submitLogin} disabled={loading || !email.trim() || !password}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
            disabled={loading}
          >
            User Login
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
