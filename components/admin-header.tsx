"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Milk } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminEmail")
    router.push("/admin/login")
  }

  const adminEmail = typeof window !== "undefined" ? localStorage.getItem("adminEmail") : null

  return (
    <div className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Milk className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">FreshMilk Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {adminEmail && <span className="text-sm text-muted-foreground hidden sm:inline">{adminEmail}</span>}
            <Button asChild variant="outline" size="sm">
              <Link href="/">View Website</Link>
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
