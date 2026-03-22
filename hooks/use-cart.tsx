"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: string) => number
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addToCart: (item) =>
        set((state) => {
          const nextItem: CartItem = { ...item, id: String(item.id) }
          const existingItem = state.items.find((i) => String(i.id) === nextItem.id)
          const newItems = existingItem
            ? state.items.map((i) =>
                String(i.id) === nextItem.id ? { ...i, quantity: i.quantity + nextItem.quantity } : i,
              )
            : [...state.items, nextItem]

          return {
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          }
        }),

      removeFromCart: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => String(item.id) !== String(id))
          return {
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((item) => String(item.id) !== String(id))
            return {
              items: newItems,
              total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
            }
          }

          const newItems = state.items.map((item) =>
            String(item.id) === String(id) ? { ...item, quantity } : item,
          )
          return {
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          }
        }),

      clearCart: () => set({ items: [], total: 0 }),

      getItemQuantity: (id) => {
        const item = get().items.find((i) => String(i.id) === String(id))
        return item ? item.quantity : 0
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
