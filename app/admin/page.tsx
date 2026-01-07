"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Users, TrendingUp, IndianRupee, Clock } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  city: string
  total_amount: number
  status: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      const { data: orders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4)

      if (orders) {
        setRecentOrders(orders)

        const { data: allOrders } = await supabase.from("orders").select("*")

        if (allOrders) {
          const today = new Date().toDateString()
          const todayOrders = allOrders.filter((order) => new Date(order.created_at).toDateString() === today)
          const totalRevenue = allOrders.reduce((sum, order) => sum + order.total_amount, 0)
          const pendingOrders = allOrders.filter((order) => order.status === "Pending")
          const completedOrders = allOrders.filter(
            (order) => order.status === "Delivered" || order.status === "Completed",
          )

          const uniqueCustomers = new Set(allOrders.map((order) => order.customer_email))

          setStats({
            totalOrders: allOrders.length,
            todayOrders: todayOrders.length,
            totalRevenue: Math.round(totalRevenue),
            totalCustomers: uniqueCustomers.size,
            pendingOrders: pendingOrders.length,
            completedOrders: completedOrders.length,
          })
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pt-4">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-foreground">
                <span className="text-green-600 font-medium">+{stats.todayOrders}</span> today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pt-4">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-foreground">Lifetime revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pt-4">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-foreground">Unique customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pt-4">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{stats.pendingOrders}</div>
              <p className="text-xs text-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Button hideIcon className="h-auto py-4 flex-col gap-2" asChild>
            <Link href="/admin/orders">
              <ShoppingBag className="h-5 w-5" />
              <span>Manage Orders</span>
            </Link>
          </Button>
          <Button hideIcon className="h-auto py-4 flex-col gap-2 bg-transparent" variant="outline" asChild>
            <Link href="/admin/products">
              <Package className="h-5 w-5" />
              <span>Manage Products</span>
            </Link>
          </Button>
          <Button hideIcon className="h-auto py-4 flex-col gap-2 bg-transparent" variant="outline" asChild>
            <Link href="/admin/customers">
              <Users className="h-5 w-5" />
              <span>View Customers</span>
            </Link>
          </Button>
          <Button hideIcon className="h-auto py-4 flex-col gap-2 bg-transparent" variant="outline" asChild>
            <Link href="/admin/analytics">
              <TrendingUp className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between pt-4">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your customers</CardDescription>
              </div>
              <Button hideIcon asChild variant="outline" className="pr-4 text-sm">
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-foreground">No orders yet</div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">#{order.id.slice(0, 8)}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-sm text-foreground">{order.city}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold">₹{order.total_amount}</p>
                      <p className="text-xs text-foreground">{getTimeAgo(order.created_at)}</p>
                    </div>
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
