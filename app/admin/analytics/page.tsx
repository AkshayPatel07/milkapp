"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { AdminHeader } from "@/components/admin-header"

export default function AnalyticsPage() {
  const revenueData = [
    { month: "Jul", revenue: 18500 },
    { month: "Aug", revenue: 22000 },
    { month: "Sep", revenue: 25600 },
    { month: "Oct", revenue: 28900 },
    { month: "Nov", revenue: 32100 },
    { month: "Dec", revenue: 35400 },
    { month: "Jan", revenue: 42800 },
  ]

  const ordersData = [
    { month: "Jul", orders: 32 },
    { month: "Aug", orders: 38 },
    { month: "Sep", orders: 42 },
    { month: "Oct", orders: 48 },
    { month: "Nov", orders: 53 },
    { month: "Dec", orders: 58 },
    { month: "Jan", orders: 67 },
  ]

  const productData = [
    { name: "Full Cream Milk", sales: 145 },
    { name: "Toned Milk", sales: 98 },
    { name: "Buffalo Milk", sales: 76 },
    { name: "Curd", sales: 54 },
  ]

  const cityData = [
    { city: "Surat", orders: 152, revenue: 24800 },
    { city: "Navsari", orders: 95, revenue: 18000 },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-foreground">Track your business performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">+21%</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-foreground mt-1">vs last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="text-sm font-medium">Order Growth</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">+15%</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-foreground mt-1">vs last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">₹173</div>
              <p className="text-xs text-foreground mt-1">+5% vs last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4 pb-2">
              <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-foreground mt-1">+2% vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue for the last 7 months</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>Monthly orders for the last 7 months</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Total sales by product</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>City Performance</CardTitle>
              <CardDescription>Orders and revenue by city</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-6">
                {cityData.map((city) => (
                  <div key={city.city} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{city.city}</h4>
                      <span className="text-sm text-foreground">{city.orders} orders</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Revenue</span>
                        <span className="font-semibold">₹{city.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(city.revenue / 42800) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
