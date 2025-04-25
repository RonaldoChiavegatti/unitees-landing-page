"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store'

const CartIndicator = () => {
  // Estado para evitar erro de hidratação
  const [mounted, setMounted] = useState(false)
  const { getItemCount } = useCartStore()
  const itemCount = useCartStore(state => state.getItemCount())

  // Montar componente apenas no cliente para evitar erro de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button 
      variant="ghost"
      size="icon"
      className="relative"
      asChild
    >
      <Link href="/carrinho">
        <ShoppingCart className="h-5 w-5" />
        {mounted && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
            {itemCount}
          </span>
        )}
        <span className="sr-only">Carrinho de compras</span>
      </Link>
    </Button>
  )
}

export default CartIndicator 