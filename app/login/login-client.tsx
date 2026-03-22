"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { BUSINESS_PHONE_DISPLAY, SERVICE_CITY } from "@/lib/config"

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || ""

  const [mode, setMode] = useState<"login" | "register">("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Register (OTP)
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [otpToken, setOtpToken] = useState<string>("")
  const otpLength = Math.max(4, Math.min(8, Number(process.env.NEXT_PUBLIC_OTP_LENGTH || "4") || 4))

  // Register details
  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [addressFull, setAddressFull] = useState("")
  const [pincode, setPincode] = useState("")

  const hint = useMemo(() => {
    if (!redirectTo) return null
    if (redirectTo.startsWith("/admin")) return "Admin access requires login"
    return "Please login to continue"
  }, [redirectTo])

  async function submitLogin() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Login failed")

      const destination = redirectTo || (data.role === "admin" ? "/admin" : "/account")
      router.push(destination)
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  async function requestOtp() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to send OTP")
      setOtp("")
      setDevOtp(data.dev_otp || null)
      setStep("otp")
    } catch (e: any) {
      setError(e?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Invalid OTP")
      setOtpToken(String(data.otp_token || ""))
      setStep("details")
    } catch (e: any) {
      setError(e?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  async function completeRegistration() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          otp_token: otpToken,
          username: regUsername,
          password: regPassword,
          full_name: fullName,
          address_full: addressFull,
          pincode,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Registration failed")

      const destination = redirectTo || (data.role === "admin" ? "/admin" : "/account")
      router.push(destination)
      router.refresh()
    } catch (e: any) {
      setError(e?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {SERVICE_CITY} portal • Help: {BUSINESS_PHONE_DISPLAY}
          </CardDescription>
          {hint ? <p className="text-sm text-foreground mt-2">{hint}</p> : null}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === "login" ? "default" : "outline"}
              className="flex-1"
              hideIcon
              onClick={() => {
                setMode("login")
                setError(null)
              }}
              disabled={loading}
            >
              Login
            </Button>
            <Button
              variant={mode === "register" ? "default" : "outline"}
              className="flex-1"
              hideIcon
              onClick={() => {
                setMode("register")
                setError(null)
              }}
              disabled={loading}
            >
              Register
            </Button>
          </div>

          {error ? <div className="text-sm text-destructive">{error}</div> : null}

          {mode === "login" ? (
            <>
              <div className="space-y-2">
                <label>Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} autoComplete="username" />
              </div>
              <div className="space-y-2">
                <label>Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} autoComplete="current-password" />
              </div>
              <Button className="w-full" onClick={submitLogin} disabled={loading || !username.trim() || !password}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </>
          ) : (
            <>
              {step === "phone" ? (
                <>
                  <div className="space-y-2">
                    <label>Phone (OTP)</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                      inputMode="tel"
                      placeholder="+91 95377 81635"
                    />
                    <p className="text-xs text-foreground">
                      OTP delivery is configurable on server. If `APP_OTP_DEV_MODE=true`, OTP is shown after sending (for testing).
                    </p>
                  </div>
                  <Button className="w-full" onClick={requestOtp} disabled={loading || phone.trim().length < 10}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </>
              ) : null}

              {step === "otp" ? (
                <>
                  <div className="space-y-2">
                    <label>Enter OTP</label>
                    <InputOTP maxLength={otpLength} value={otp} onChange={setOtp} disabled={loading}>
                      <InputOTPGroup>
                        {Array.from({ length: otpLength }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {devOtp ? <p className="text-xs text-foreground">DEV OTP: {devOtp}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setStep("phone")} disabled={loading}>
                      Change Phone
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={requestOtp} disabled={loading}>
                      Resend OTP
                    </Button>
                    <Button className="flex-1" onClick={verifyOtp} disabled={loading || otp.length !== otpLength}>
                      {loading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </>
              ) : null}

              {step === "details" ? (
                <>
                  <div className="space-y-2">
                    <label>Username *</label>
                    <Input value={regUsername} onChange={(e) => setRegUsername(e.target.value)} disabled={loading} placeholder="eg. rajesh_123" />
                    <p className="text-xs text-foreground">3-20 chars: letters, numbers, underscore.</p>
                  </div>
                  <div className="space-y-2">
                    <label>Password *</label>
                    <Input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <label>Full Name *</label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <label>Full Address *</label>
                    <Textarea
                      value={addressFull}
                      onChange={(e) => setAddressFull(e.target.value)}
                      disabled={loading}
                      rows={4}
                      placeholder="House/Flat No., Society, Street, Area, Landmark"
                    />
                    <p className="text-xs text-foreground">City is fixed to {SERVICE_CITY}.</p>
                  </div>
                  <div className="space-y-2">
                    <label>Pincode *</label>
                    <Input value={pincode} onChange={(e) => setPincode(e.target.value)} disabled={loading} />
                  </div>

                  <Button
                    className="w-full"
                    onClick={completeRegistration}
                    disabled={loading || !regUsername.trim() || regPassword.length < 6 || !fullName.trim() || !addressFull.trim() || !pincode.trim()}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
