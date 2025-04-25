"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size: string
  color: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (itemId: string, size: string, color: string) => void
  updateQuantity: (itemId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        // Verificar se o item já existe com mesmo id, tamanho e cor
        const existingItemIndex = state.items.findIndex(
          i => i.id === item.id && i.size === item.size && i.color === item.color
        )
        
        if (existingItemIndex >= 0) {
          // Se existir, só atualiza a quantidade
          const newItems = [...state.items]
          newItems[existingItemIndex].quantity += item.quantity
          return { items: newItems }
        }
        
        // Se não existir, adiciona como novo item
        return { items: [...state.items, item] }
      }),
      
      removeItem: (itemId, size, color) => set((state) => ({
        items: state.items.filter(
          i => !(i.id === itemId && i.size === size && i.color === color)
        )
      })),
      
      updateQuantity: (itemId, size, color, quantity) => set((state) => {
        const newItems = [...state.items]
        const index = newItems.findIndex(
          i => i.id === itemId && i.size === size && i.color === color
        )
        
        if (index >= 0) {
          newItems[index].quantity = quantity
        }
        
        return { items: newItems }
      }),
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: "unitees-cart-storage",
    },
  ),
)
