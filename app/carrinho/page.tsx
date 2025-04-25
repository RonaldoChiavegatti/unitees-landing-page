"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CarrinhoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleQuantityChange = (id: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, size, color, newQuantity)
    }
  }
  
  const handleRemoveItem = (id: string, size: string, color: string) => {
    removeItem(id, size, color)
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho",
    })
  }
  
  const proceedToCheckout = () => {
    router.push("/checkout")
  }

  // Evitar erro de hidratação
  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>
          <p>Carregando carrinho...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 p-8 rounded-lg max-w-md w-full flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
            <p className="text-gray-600 mb-6">
              Parece que você ainda não adicionou nenhum item ao seu carrinho.
            </p>
            <Button asChild className="w-full">
              <Link href="/explorar">
                Explorar Produtos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Itens do carrinho */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Produto</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={`${item.id}-${item.size}-${item.color}`}>
                      <TableCell>
                        <div className="relative h-20 w-16 rounded overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=80&width=64"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Tamanho: {item.size} | Cor: {item.color}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Diminuir quantidade</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Aumentar quantidade</span>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)} cada</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id, item.size, item.color)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover item</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Resumo do pedido */}
          <div>
            <div className="bg-white rounded-lg border p-6 sticky top-20">
              <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">R$ {getTotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Entrega</span>
                  <span className="font-medium">Calculado no checkout</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="font-semibold">Total Estimado</span>
                  <span className="font-bold text-lg">R$ {getTotal().toFixed(2)}</span>
                </div>
                
                <Button className="w-full mt-4" size="lg" onClick={proceedToCheckout}>
                  Finalizar Compra
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  Frete e descontos serão calculados no checkout
                </p>
              </div>
              
              <div className="mt-6">
                <Link 
                  href="/explorar" 
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                >
                  <ArrowRight className="h-3 w-3 mr-1 rotate-180" />
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
