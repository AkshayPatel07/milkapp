/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Minus, Loader2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useCart } from "@/hooks/use-cart"
import { SERVICE_CITY } from "@/lib/config"
import { saveSubscriptionRequest } from "@/lib/subscription-request"
import { openWhatsApp } from "@/lib/whatsapp"

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  image_url: string
  category: string
  in_stock: boolean
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionProduct, setSubscriptionProduct] = useState<Product | null>(null)
  const [subscriptionQuantity, setSubscriptionQuantity] = useState("1")
  const { addToCart, getItemQuantity, updateQuantity } = useCart()

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      setError(null)

      const supabase = createClient()
      const { data, error } = await supabase.from("products").select("*").eq("in_stock", true).order("name")

      if (error) {
        console.error("Error loading products:", error)
        setError(error.message || "Failed to load products")
        setProducts([])
      } else {
        setProducts((data || []) as Product[])
      }

      setLoading(false)
    }

    loadProducts()
  }, [])

  const inStockProducts = useMemo(() => products.filter((p) => p.in_stock), [products])

  function openSubscription(product: Product) {
    setSubscriptionProduct(product)
    setSubscriptionQuantity(String(getItemQuantity(product.id) || 1))
  }

  function sendSubscriptionWhatsApp(product: Product) {
    const quantity = Number(subscriptionQuantity)
    if (!Number.isFinite(quantity) || quantity <= 0) return

    saveSubscriptionRequest({
      productName: product.name,
      quantity,
      unit: product.unit,
      city: SERVICE_CITY,
      requestedAt: new Date().toISOString(),
    })
    const message = `Hello FreshMilk,\n\nI want to start a Daily Milk Subscription.\n- Product: ${product.name}\n- Quantity: ${quantity} ${product.unit} per day\n\nDelivery city: ${SERVICE_CITY}\nPlease confirm the subscription and delivery schedule.`
    openWhatsApp(message)
    setSubscriptionProduct(null)
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Products</h2>
          <p className="text-foreground max-w-2xl mx-auto">
            Choose from our range of fresh, pure milk products delivered daily to your doorstep.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-destructive mb-2">Products not available right now</p>
            <p className="text-sm text-foreground">{error}</p>
          </div>
        ) : inStockProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-foreground">No products found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inStockProducts.map((product) => {
              const quantity = getItemQuantity(product.id)
              const sendWhatsApp = (qty: number) => {
                const message = `Hello FreshMilk,\n\nI want to order:\n- ${product.name} x ${qty} (${product.unit})\n\nDelivery city: ${SERVICE_CITY}\nPlease confirm price and delivery time.`
                openWhatsApp(message)
              }

              return (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0 pt-4">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <div className="text-xs bg-muted-foreground text-white rounded-3xl px-2 shrink-0">
                        {product.category}
                      </div>
                    </div>

                    <p className="text-foreground text-sm mb-4">{product.description}</p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">₹{product.price}</span>
                      <span className="text-foreground">/ {product.unit}</span>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    {quantity === 0 ? (
                      <div className="flex flex-col gap-3 w-full">
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            className="w-full bg-[#143d59] text-white hover:bg-[#0f3149]"
                            hideIcon
                            onClick={() =>
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                quantity: 1,
                                image: product.image_url,
                              })
                            }
                          >
                            Buy Once
                          </Button>
                          <Button
                            className="w-full bg-emerald-400 text-black hover:bg-emerald-500"
                            hideIcon
                            onClick={() => openSubscription(product)}
                          >
                            Subscribe
                          </Button>
                        </div>
                        <Button className="w-full" hideIcon variant="outline" onClick={() => sendWhatsApp(1)}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp Order
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 w-full">
                        <div className="flex items-center gap-2 w-full border rounded-md">
                          <button
                            className="bg-secondary-foreground text-white rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="flex-1 text-center font-semibold">{quantity}</span>
                          <button
                            className="bg-secondary-foreground text-white rounded-md w-7 h-7 flex items-center justify-center cursor-pointer"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            className="w-full bg-[#143d59] text-white hover:bg-[#0f3149]"
                            hideIcon
                            onClick={() =>
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                quantity: 1,
                                image: product.image_url,
                              })
                            }
                          >
                            Add One More
                          </Button>
                          <Button
                            className="w-full bg-emerald-400 text-black hover:bg-emerald-500"
                            hideIcon
                            onClick={() => openSubscription(product)}
                          >
                            Subscribe
                          </Button>
                        </div>
                        <Button className="w-full" hideIcon variant="destructive" onClick={() => sendWhatsApp(quantity)}>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          WhatsApp this order
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={Boolean(subscriptionProduct)} onOpenChange={(open) => !open && setSubscriptionProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Milk Subscription</DialogTitle>
            <DialogDescription>
              Enter how much milk you want delivered every day to your home.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity per day</label>
            <Input
              type="number"
              min="1"
              step="0.5"
              value={subscriptionQuantity}
              onChange={(e) => setSubscriptionQuantity(e.target.value)}
              placeholder="1"
            />
            {subscriptionProduct ? (
              <p className="text-xs text-foreground">
                {subscriptionProduct.name} will be delivered daily in {SERVICE_CITY}.
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscriptionProduct(null)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-400 text-black hover:bg-emerald-500"
              onClick={() => subscriptionProduct && sendSubscriptionWhatsApp(subscriptionProduct)}
              disabled={!subscriptionProduct || !Number.isFinite(Number(subscriptionQuantity)) || Number(subscriptionQuantity) <= 0}
            >
              Send Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
