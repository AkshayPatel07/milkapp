"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, MapPin } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const customers = [
    {
      id: 1,
      name: "Rajesh Patel",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      city: "Surat",
      address: "123, Gandhi Road, Adajan",
      totalOrders: 45,
      totalSpent: 5400,
      status: "Active",
      joinDate: "2023-06-15",
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya@example.com",
      phone: "+91 98765 43211",
      city: "Navsari",
      address: "456, Station Road, Navsari",
      totalOrders: 32,
      totalSpent: 3840,
      status: "Active",
      joinDate: "2023-07-20",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 98765 43212",
      city: "Surat",
      address: "789, Ring Road, Vesu",
      totalOrders: 28,
      totalSpent: 3360,
      status: "Active",
      joinDate: "2023-08-10",
    },
    {
      id: 4,
      name: "Sneha Desai",
      email: "sneha@example.com",
      phone: "+91 98765 43213",
      city: "Navsari",
      address: "321, College Road, Navsari",
      totalOrders: 52,
      totalSpent: 6240,
      status: "Active",
      joinDate: "2023-05-05",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-foreground">View and manage your customers</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
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
              <CardTitle className="text-sm font-medium">Surat</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{customers.filter((c) => c.city === "Surat").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium">Navsari</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{customers.filter((c) => c.city === "Navsari").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pt-4">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">
                ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <div className="grid gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{customer.name}</CardTitle>
                      <div className="bg-green-100 text-green-800 rounded-full text-sm px-2 shrink-0">{customer.status}</div>
                    </div>
                    <CardDescription>Customer since {customer.joinDate}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">Total Spent</p>
                    <p className="text-2xl font-bold">₹{customer.totalSpent.toLocaleString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-foreground" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-foreground" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-foreground" />
                      <span>
                        {customer.address}, {customer.city}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-foreground">Total Orders</p>
                      <p className="text-xl font-semibold">{customer.totalOrders}</p>
                    </div>
                    {/* <div className="flex gap-2">
                      <Button className="text-sm py-2">
                        View Orders
                      </Button>
                      <Button className="text-sm py-2">
                        Contact
                      </Button>
                    </div> */}
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
