"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Milk } from "lucide-react"
import Link from "next/link"
import { BUSINESS_PHONE_DISPLAY } from "@/lib/config"

export function AdminHeader() {
  const router = useRouter()
  const [adminLabel, setAdminLabel] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setAdminLabel(data?.user ? `${data.user.username} • ${data.user.phone}` : null))
      .catch(() => setAdminLabel(null))
  }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="border-b bg-background sticky top-[108px]">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
            
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Milk className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg">FreshMilk Admin</span>
            </Link>
            {/* <span className="text-xs text-foreground hidden md:inline">Help: {BUSINESS_PHONE_DISPLAY}</span> */}
          </div>
          <div className="flex items-center gap-4">
            {adminLabel && <span className="text-sm text-foreground hidden sm:inline">{adminLabel}</span>}
            <Button asChild variant="outline">
              <Link href="/">View Website</Link>
            </Button>
            <Button hideIcon onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
