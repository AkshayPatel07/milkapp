"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (id: number) => number
  total: number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          const newItems = existingItem
            ? state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
            : [...state.items, item]

          return {
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          }
        }),

      removeFromCart: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id)
          return {
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((item) => item.id !== id)
            return {
              items: newItems,
              total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
            }
          }

          const newItems = state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
          return {
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
          }
        }),

      clearCart: () => set({ items: [], total: 0 }),

      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id)
        return item ? item.quantity : 0
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
