"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { BUSINESS_PHONE_DISPLAY, SERVICE_CITY } from "@/lib/config"

type RegisterField =
  | "phone"
  | "otp"
  | "regUsername"
  | "regPassword"
  | "fullName"
  | "addressFull"
  | "pincode"

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
  const [touchedFields, setTouchedFields] = useState<Record<RegisterField, boolean>>({
    phone: false,
    otp: false,
    regUsername: false,
    regPassword: false,
    fullName: false,
    addressFull: false,
    pincode: false,
  })

  // Register details
  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [addressFull, setAddressFull] = useState("")
  const [pincode, setPincode] = useState("")

  const registerErrors = useMemo(() => {
    const phoneValue = phone.trim()
    const otpValue = otp.trim()
    const usernameValue = regUsername.trim()
    const passwordValue = regPassword
    const fullNameValue = fullName.trim()
    const addressValue = addressFull.trim()
    const pincodeValue = pincode.trim()

    return {
      phone:
        !phoneValue
          ? "Phone number is required."
          : phoneValue.length < 10
            ? "Enter a valid phone number."
            : "",
      otp:
        step === "otp" && (!otpValue || otpValue.length !== otpLength)
          ? `Enter the ${otpLength}-digit OTP.`
          : "",
      regUsername:
        !usernameValue
          ? "Username is required."
          : usernameValue.length < 3 || usernameValue.length > 20
            ? "Username must be 3 to 20 characters."
            : !/^[a-zA-Z0-9_]+$/.test(usernameValue)
              ? "Use only letters, numbers, and underscore."
              : "",
      regPassword:
        !passwordValue
          ? "Password is required."
          : passwordValue.length < 6
            ? "Password must be at least 6 characters."
            : "",
      fullName: !fullNameValue ? "Full name is required." : "",
      addressFull: !addressValue ? "Full address is required." : "",
      pincode:
        !pincodeValue
          ? "Pincode is required."
          : !/^[1-9][0-9]{5}$/.test(pincodeValue)
            ? "Enter a valid 6-digit pincode."
            : "",
    }
  }, [addressFull, fullName, otp, otpLength, pincode, phone, regPassword, regUsername, step])

  const hasRegistrationErrors = useMemo(
    () =>
      Boolean(
        registerErrors.phone ||
          registerErrors.otp ||
          registerErrors.regUsername ||
          registerErrors.regPassword ||
          registerErrors.fullName ||
          registerErrors.addressFull ||
          registerErrors.pincode,
      ),
    [registerErrors],
  )

  function markTouched(fields: RegisterField[]) {
    setTouchedFields((current) => {
      const next = { ...current }
      for (const field of fields) next[field] = true
      return next
    })
  }

  function showFieldError(field: RegisterField) {
    return touchedFields[field] && registerErrors[field]
  }

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

  async function verifyOtpValue(otpValue: string) {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
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

  async function requestOtp() {
    markTouched(["phone"])
    if (registerErrors.phone) {
      setError(registerErrors.phone)
      return
    }
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
      const sentOtp = String(data.dev_otp || "")
      setOtp(sentOtp)
      setDevOtp(sentOtp || null)
      if (data.dev_bypass && sentOtp) {
        await verifyOtpValue(sentOtp)
      } else {
        setStep("otp")
      }
    } catch (e: any) {
      setError(e?.message || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  async function verifyOtp() {
    markTouched(["otp"])
    if (registerErrors.otp) {
      setError(registerErrors.otp)
      return
    }
    await verifyOtpValue(otp)
  }

  async function completeRegistration() {
    markTouched(["regUsername", "regPassword", "fullName", "addressFull", "pincode"])
    if (hasRegistrationErrors) {
      setError("Please fix the highlighted fields.")
      return
    }
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
    <div className="flex items-center justify-center bg-muted/30 p-7">
      <Card className="w-full max-w-md py-4">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            Help: {BUSINESS_PHONE_DISPLAY}
          </CardDescription>
          {hint ? <p className="text-sm text-foreground mt-2">{hint}</p> : null}
        </CardHeader>
        <CardContent className="space-y-4 mt-3">
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
                    <label className={showFieldError("phone") ? "text-destructive" : ""}>Phone (OTP)</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onBlur={() => markTouched(["phone"])}
                      disabled={loading}
                      inputMode="tel"
                      placeholder="+91 95377 81635"
                      aria-invalid={Boolean(showFieldError("phone"))}
                    />
                    {showFieldError("phone") ? (
                      <p className="text-xs text-destructive">{registerErrors.phone}</p>
                    ) : (
                      <p className="text-xs text-foreground">
                      OTP delivery is configurable on server. If `APP_OTP_DEV_MODE=true`, OTP is shown after sending (for testing).
                      </p>
                    )}
                  </div>
                  <Button className="w-full" onClick={requestOtp} disabled={loading}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                </>
              ) : null}

              {step === "otp" ? (
                <>
                  <div className="space-y-2">
                    <label className={showFieldError("otp") ? "text-destructive" : ""}>Enter OTP</label>
                    <InputOTP maxLength={otpLength} value={otp} onChange={setOtp} disabled={loading}>
                      <InputOTPGroup>
                        {Array.from({ length: otpLength }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                    {showFieldError("otp") ? (
                      <p className="text-xs text-destructive">{registerErrors.otp}</p>
                    ) : null}
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
                    <label className={showFieldError("regUsername") ? "text-destructive" : ""}>Username *</label>
                    <Input
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      onBlur={() => markTouched(["regUsername"])}
                      disabled={loading}
                      placeholder="eg. rajesh_123"
                      aria-invalid={Boolean(showFieldError("regUsername"))}
                    />
                    {showFieldError("regUsername") ? (
                      <p className="text-xs text-destructive">{registerErrors.regUsername}</p>
                    ) : (
                      <p className="text-xs text-foreground">3-20 chars: letters, numbers, underscore.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={showFieldError("regPassword") ? "text-destructive" : ""}>Password *</label>
                    <Input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      onBlur={() => markTouched(["regPassword"])}
                      disabled={loading}
                      aria-invalid={Boolean(showFieldError("regPassword"))}
                    />
                    {showFieldError("regPassword") ? (
                      <p className="text-xs text-destructive">{registerErrors.regPassword}</p>
                    ) : (
                      <p className="text-xs text-foreground">Use at least 6 characters.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={showFieldError("fullName") ? "text-destructive" : ""}>Full Name *</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => markTouched(["fullName"])}
                      disabled={loading}
                      aria-invalid={Boolean(showFieldError("fullName"))}
                    />
                    {showFieldError("fullName") ? (
                      <p className="text-xs text-destructive">{registerErrors.fullName}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <label className={showFieldError("addressFull") ? "text-destructive" : ""}>Full Address *</label>
                    <Textarea
                      value={addressFull}
                      onChange={(e) => setAddressFull(e.target.value)}
                      onBlur={() => markTouched(["addressFull"])}
                      disabled={loading}
                      rows={4}
                      placeholder="House/Flat No., Society, Street, Area, Landmark"
                      aria-invalid={Boolean(showFieldError("addressFull"))}
                    />
                    {showFieldError("addressFull") ? (
                      <p className="text-xs text-destructive">{registerErrors.addressFull}</p>
                    ) : (
                      <p className="text-xs text-foreground">City is fixed to {SERVICE_CITY}.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={showFieldError("pincode") ? "text-destructive" : ""}>Pincode *</label>
                    <Input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      onBlur={() => markTouched(["pincode"])}
                      disabled={loading}
                      inputMode="numeric"
                      aria-invalid={Boolean(showFieldError("pincode"))}
                    />
                    {showFieldError("pincode") ? (
                      <p className="text-xs text-destructive">{registerErrors.pincode}</p>
                    ) : null}
                  </div>

                  <Button
                    className="w-full"
                    onClick={completeRegistration}
                    disabled={loading}
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
