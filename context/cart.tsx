"use client"

import { createContext, useContext, useEffect, useCallback, useState } from "react"

export type CartProgram = {
  id: string
  name: string
  price: number
  priceDisplay: string
  program: unknown
}

type CartContextValue = {
  items: CartProgram[]
  addItem: (program: CartProgram) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalCents: number
  totalDisplay: string
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "ascendiq-enroll-cart"

function persistItems(items: CartProgram[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(({ id, name, price, priceDisplay }) => ({ id, name, price, priceDisplay }))))
    } catch {
      // ignore
    }
  }
}

function loadItems(): CartProgram[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{ id: string; name: string; price: number; priceDisplay: string }>
        return parsed.map((p) => ({ ...p, program: undefined }))
      }
    } catch {
      // ignore
    }
  }
  return []
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartProgram[]>([])

  useEffect(() => {
    setItems(loadItems())
  }, [])

  useEffect(() => {
    persistItems(items)
  }, [items])

  const addItem = useCallback((program: CartProgram) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === program.id)) return prev
      return [...prev, program]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalCents = items.reduce((sum, p) => sum + p.price, 0)
  const totalDisplay = `$${(totalCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalCents, totalDisplay }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
