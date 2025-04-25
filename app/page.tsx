import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil, Store, Truck } from "lucide-react"
import FeaturedDesignsCarousel from "@/components/featured-designs-carousel"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Personalize sua camiseta universitária em minutos!
              </h1>
              <p className="text-xl md:text-2xl mb-8">Crie, compre e conecte-se com gráficas locais.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/editor">Comece a Criar</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/explorar">Ver Gráficas Parceiras</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-[300px] md:h-[400px]">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Camiseta personalizada"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Diferenciais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pencil className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Editor Fácil</h3>
              <p className="text-gray-600">
                Interface intuitiva estilo Canva para criar designs incríveis sem complicação.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conexão Direta com Gráficas</h3>
              <p className="text-gray-600">Encontre gráficas locais e negocie diretamente para obter o melhor preço.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Receba seus produtos personalizados em tempo recorde com nossas gráficas parceiras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Designs Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Designs em Destaque</h2>
          <FeaturedDesignsCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para criar sua camiseta?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes universitários que já estão personalizando suas camisetas com a Unitees.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
            <Link href="/editor">Comece a Criar Agora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
