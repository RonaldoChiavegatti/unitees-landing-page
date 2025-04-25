"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function OrderConfirmationPage() {
  const [orderInfo, setOrderInfo] = useState({
    orderNumber: "",
    date: "",
    estimatedDelivery: "",
    total: "",
    paymentMethod: "",
    shippingMethod: "",
    items: []
  })

  useEffect(() => {
    // Recuperar informações do pedido do localStorage
    const savedOrderInfo = localStorage.getItem("orderInfo")
    if (savedOrderInfo) {
      const parsedOrder = JSON.parse(savedOrderInfo)
      setOrderInfo(parsedOrder)
    }
  }, [])

  // Formatar o valor total
  const formattedTotal = typeof orderInfo.total === 'number' 
    ? orderInfo.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : orderInfo.total

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-2xl mx-auto text-center bg-white rounded-lg border shadow-sm p-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-6">
            Obrigado pela sua compra! Seu pedido foi recebido e está sendo processado.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Número do Pedido</h3>
                <p className="text-lg font-semibold">{orderInfo.orderNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Data do Pedido</h3>
                <p className="text-lg font-semibold">{orderInfo.date}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Previsão de Entrega</h3>
                <p className="text-lg font-semibold">{orderInfo.estimatedDelivery}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
                <p className="text-lg font-semibold">{formattedTotal}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Método de Pagamento</h3>
                <p className="text-lg font-semibold">{orderInfo.paymentMethod}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Método de Envio</h3>
                <p className="text-lg font-semibold">{orderInfo.shippingMethod}</p>
              </div>
            </div>

            {orderInfo.items && orderInfo.items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Itens do Pedido</h3>
                <div className="border-t pt-4">
                  {orderInfo.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-8">
            Você receberá um email com os detalhes do seu pedido e informações de rastreamento
            assim que o seu pacote for enviado.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/minha-conta/pedidos">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Acompanhar pedido
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/">
                Continuar comprando
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
} 