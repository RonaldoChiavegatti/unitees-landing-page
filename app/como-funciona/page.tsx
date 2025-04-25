import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Brush, HandCoins, MessageSquare, Rocket, Shirt, ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata = {
  title: "Como Funciona | Unitees",
  description: "Entenda como funciona o processo de criação e compra de camisetas universitárias personalizadas na Unitees",
}

export default function ComoFunciona() {
  const steps = [
    {
      title: "Crie seu design",
      description: "Use nosso editor intuitivo para criar sua camiseta ou escolha entre designs prontos. Adicione textos, imagens e personalize cores.",
      icon: <Brush className="w-12 h-12 text-blue-600" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Editor de camisetas",
    },
    {
      title: "Encontre uma gráfica",
      description: "Navegue por gráficas parceiras em sua região, compare preços e avaliações para escolher a melhor opção.",
      icon: <Shirt className="w-12 h-12 text-blue-600" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Lista de gráficas",
    },
    {
      title: "Negocie diretamente",
      description: "Converse com a gráfica escolhida, tire dúvidas sobre materiais, ajuste detalhes do seu pedido e combine prazos.",
      icon: <MessageSquare className="w-12 h-12 text-blue-600" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Chat com gráfica",
    },
    {
      title: "Faça seu pedido",
      description: "Revise os detalhes, escolha a quantidade, tamanhos e finalize seu pedido de forma simples e segura.",
      icon: <ShoppingCart className="w-12 h-12 text-blue-600" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Finalização de pedido",
    },
    {
      title: "Acompanhe a produção",
      description: "Receba atualizações sobre o status do seu pedido e acompanhe todo o processo de produção.",
      icon: <Rocket className="w-12 h-12 text-blue-600" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Processo de produção",
    },
    {
      title: "Receba sua camiseta",
      description: "Sua camiseta personalizada será entregue diretamente no endereço escolhido, pronta para ser usada.",
      icon: <Truck className="w-12 h-12 text-blue-600" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Entrega da camiseta",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona a Unitees</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Transforme suas ideias em camisetas universitárias de forma simples, 
            conectando-se diretamente com gráficas locais.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}>
                <div className="md:w-1/2">
                  <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                    <Image 
                      src={step.imageUrl} 
                      alt={step.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center mb-4">
                    {step.icon}
                    <div className="ml-4 bg-blue-100 text-blue-600 font-semibold px-3 py-1 rounded-full text-sm">
                      Passo {index + 1}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-gray-600 text-lg mb-6">{step.description}</p>
                  {index === 0 && (
                    <Button asChild>
                      <Link href="/editor">Comece a criar agora</Link>
                    </Button>
                  )}
                  {index === 1 && (
                    <Button asChild>
                      <Link href="/explorar">Explorar gráficas</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Quanto custa criar uma camiseta?</h3>
              <p className="text-gray-600">
                Os preços variam de acordo com a gráfica escolhida, quantidade de camisetas e 
                especificações do design. Nossa plataforma permite que você compare preços e 
                negocie diretamente com as gráficas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Quanto tempo leva para receber?</h3>
              <p className="text-gray-600">
                O prazo de entrega depende da gráfica selecionada e da complexidade do pedido. 
                Em média, os pedidos são entregues em 7 a 14 dias após a confirmação.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Posso acompanhar o status do pedido?</h3>
              <p className="text-gray-600">
                Sim! Você receberá atualizações em cada etapa do processo, desde a confirmação 
                até a entrega, e pode acompanhar tudo pelo seu perfil na plataforma.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Como é feito o pagamento?</h3>
              <p className="text-gray-600">
                O pagamento é combinado diretamente com a gráfica escolhida. A maioria aceita 
                métodos como PIX, transferência bancária ou pagamento na entrega.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para criar sua camiseta?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Em poucos passos, você terá sua camiseta universitária personalizada exatamente como imaginou.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/editor">Criar Minha Camiseta</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/explorar">
                Ver Gráficas Parceiras
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
