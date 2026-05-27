import { Suspense } from "react"
import ProductsClient from "./products-client"

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center items-center py-12">Loading...</div>
          </div>
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  )
}

