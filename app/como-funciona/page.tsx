import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Brush, HandCoins, MessageSquare, Rocket, Shirt, ShoppingCart, Truck, Pen, CreditCard } from "lucide-react"
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
      icon: <Pen className="h-8 w-8 text-primary" />,
      imageUrl: "/placeholder.svg?height=300&width=500",
      imageAlt: "Editor de camisetas",
    },
    {
      title: "Encontre uma gráfica",
      description: "Navegue por gráficas parceiras em sua região, compare preços e avaliações para escolher a melhor opção.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona a Unitees</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Transforme suas ideias em camisetas universitárias de forma simples, conectando-se
              diretamente com gráficas locais.
            </p>
          </div>
        </section>
        
        {/* Steps Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-card rounded-lg p-8 shadow-md border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Pen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Passo 1: Crie seu design</h3>
                <p className="text-muted-foreground">
                  Use nosso editor intuitivo para criar sua camiseta ou escolha entre designs
                  prontos. Adicione textos, imagens e personalize cores.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-card rounded-lg p-8 shadow-md border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Passo 2: Escolha uma gráfica</h3>
                <p className="text-muted-foreground">
                  Compare orçamentos de gráficas próximas, converse diretamente e selecione a melhor
                  opção para sua necessidade e orçamento.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-card rounded-lg p-8 shadow-md border flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Passo 3: Receba seu pedido</h3>
                <p className="text-muted-foreground">
                  Finalize seu pedido, acompanhe o status e receba suas camisetas personalizadas
                  diretamente no local combinado.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefícios da Unitees</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Para Estudantes</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Preços diretos da gráfica sem intermediários</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Compare orçamentos de diversas gráficas</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Acompanhe todo o processo de produção</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Editor simples e intuitivo</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Para Gráficas</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Acesse clientes universitários diretamente</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Receba pedidos com especificações claras</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Gestão simplificada de orçamentos e pedidos</p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">✓</div>
                    <p>Crescimento do seu negócio no mercado universitário</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
            <div className="max-w-3xl mx-auto divide-y divide-border">
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">Quanto tempo leva para receber minhas camisetas?</h3>
                <p className="text-muted-foreground">
                  O tempo de entrega depende da gráfica escolhida e da quantidade de camisetas. Em geral, pedidos
                  são entregues entre 7 a 14 dias úteis após a confirmação.
                </p>
              </div>
              
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">Posso pedir amostras antes do pedido final?</h3>
                <p className="text-muted-foreground">
                  Sim, algumas gráficas oferecem a possibilidade de enviar uma amostra. Você pode
                  negociar diretamente com a gráfica pelo nosso chat.
                </p>
              </div>
              
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">Como funciona o pagamento?</h3>
                <p className="text-muted-foreground">
                  O pagamento é feito diretamente pela plataforma, usando cartão de crédito, débito, PIX
                  ou boleto bancário. Garantimos a segurança da transação.
                </p>
              </div>
              
              <div className="py-6">
                <h3 className="text-xl font-medium mb-2">Como me torno uma gráfica parceira?</h3>
                <p className="text-muted-foreground">
                  Registre-se como uma gráfica e preencha todas as informações necessárias. Nossa equipe
                  fará uma verificação e, após aprovada, sua gráfica estará disponível para os estudantes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
