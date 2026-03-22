"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user || data.user.role !== "admin") {
          router.replace("/admin/login")
          return
        }
        setReady(true)
      })
      .catch(() => router.replace("/admin/login"))
  }, [router])

  if (!ready) return null
  return <>{children}</>
}
