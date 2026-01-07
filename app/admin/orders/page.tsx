"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin-header";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_date: string;
  delivery_time: string;
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            product_name,
            quantity,
            price
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    const matchesCity =
      cityFilter === "all" ||
      order.delivery_city.toLowerCase() === cityFilter.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCity && matchesSearch;
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Reload orders
      await loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <AdminHeader />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-sm text-foreground">
            View and manage all customer orders
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
                <Input
                  placeholder="Search by order ID or customer name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="surat">Surat</SelectItem>
                  <SelectItem value="navsari">Navsari</SelectItem>
                </SelectContent>
              </Select>
              <Button hideIcon variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="py-4">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div
                        className={`rounded-full text-sm px-2 ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </div>
                    </div>
                    <CardDescription>
                      {new Date(order.created_at).toLocaleDateString()} •{" "}
                      {order.delivery_time}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{order.total_amount}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Customer Details
                      </h4>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-foreground">
                        {order.customer_email}
                      </p>
                      <p className="text-sm text-foreground">
                        {order.customer_phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">
                        Delivery Address
                      </h4>
                      <p className="text-sm">{order.delivery_address}</p>
                      <p className="text-sm text-foreground">
                        {order.delivery_city}
                      </p>
                      <p className="text-sm text-foreground">
                        Delivery Date: {order.delivery_date}
                      </p>
                    </div>
                    {order.notes && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Notes</h4>
                        <p className="text-sm text-foreground">{order.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.product_name} x{item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {order.status === "pending" && (
                        <Button
                          hideIcon
                          className="text-sm pr-4"
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(order.id, "processing")
                          }
                        >
                          Start Processing
                        </Button>
                      )}
                      {order.status === "processing" && (
                        <Button
                          hideIcon
                          className="text-sm pr-4"
                          size="sm"
                          onClick={() =>
                            updateOrderStatus(order.id, "delivered")
                          }
                        >
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-foreground">
                No orders found matching your filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
