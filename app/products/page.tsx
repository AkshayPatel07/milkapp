"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"

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

export default function ProductsPage() {
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, getItemQuantity, updateQuantity } = useCart()

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient()
      const { data, error } = await supabase.from("products").select("*").eq("in_stock", true).order("name")

      if (error) {
        console.error("Error loading products:", error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    loadProducts()
  }, [])

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-lg text-foreground max-w-2xl mx-auto mb-8">
            Choose from our range of fresh, pure milk products delivered daily to your doorstep
          </p>

          {/* City Selection */}
          <div className="max-w-md mx-auto">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your city for delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="surat">Surat</SelectItem>
                <SelectItem value="navsari">Navsari</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : selectedCity ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const quantity = getItemQuantity(product.id)
              return (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <div className="text-xs bg-secondary text-white rounded-3xl px-2">{product.category}</div>
                    </div>
                    <p className="text-foreground text-sm mb-4">{product.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">₹{product.price}</span>
                      <span className="text-foreground">/ {product.unit}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    {quantity === 0 ? (
                      <Button
                        className="w-full"
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
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        <button className="bg-white w-7 h-7 flex items-center justify-center rounded-full shadow cursor-pointer" onClick={() => updateQuantity(product.id, quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="flex-1 text-center font-semibold">{quantity}</span>
                        <button className="bg-white w-7 h-7 flex items-center justify-center rounded-full shadow cursor-pointer" onClick={() => updateQuantity(product.id, quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-foreground">Please select your city to view available products</p>
          </div>
        )}
      </div>
    </div>
  )
}
