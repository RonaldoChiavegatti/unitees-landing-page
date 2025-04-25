"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, MessageSquare, ShoppingBag } from "lucide-react"

export default function ConfirmacaoPage() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    // Generate a random order ID
    setOrderId(
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0"),
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Pedido Confirmado!</h1>
            <p className="text-xl mb-2">Obrigado por comprar com a Unitees</p>
            <p className="text-gray-600 mb-6">Seu pedido #{orderId} foi recebido e está sendo processado.</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Próximos Passos</h2>
              <ul className="space-y-4 text-left">
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Confirmação por E-mail</p>
                    <p className="text-gray-600 text-sm">
                      Você receberá um e-mail com os detalhes do seu pedido em breve.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Produção</p>
                    <p className="text-gray-600 text-sm">
                      Sua camiseta personalizada será produzida pela gráfica parceira.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Envio</p>
                    <p className="text-gray-600 text-sm">
                      Assim que estiver pronta, sua camiseta será enviada para o endereço informado.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/chat">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Conversar com a Gráfica
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continuar Comprando
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
