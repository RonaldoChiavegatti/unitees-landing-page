import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Clock, Truck, MessageSquare } from "lucide-react"

// Mock data for printing shop
const printingShop = {
  id: 1,
  name: "Gráfica Universitária",
  description:
    "Especializada em camisetas personalizadas para turmas universitárias, eventos e formaturas. Oferecemos qualidade, preço justo e entrega rápida.",
  rating: 4.8,
  reviews: 124,
  location: "Belo Horizonte, MG",
  distance: "2.5 km",
  address: "Av. Antônio Carlos, 6627 - Pampulha",
  phone: "(31) 3333-4444",
  email: "contato@graficauniversitaria.com.br",
  deliveryTime: "5-7 dias úteis",
  image: "/placeholder.svg?height=300&width=600",
  products: [
    {
      id: 1,
      name: "Camiseta Básica",
      price: 29.9,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Camiseta Gola V",
      price: 34.9,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Camiseta Manga Longa",
      price: 39.9,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Moletom Canguru",
      price: 89.9,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Caneca Personalizada",
      price: 24.9,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      name: "Tirante Personalizado",
      price: 19.9,
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
  reviews: [
    {
      id: 1,
      name: "João Silva",
      rating: 5,
      date: "15/04/2023",
      comment: "Excelente qualidade e entrega rápida. Recomendo!",
    },
    {
      id: 2,
      name: "Maria Oliveira",
      rating: 4,
      date: "02/03/2023",
      comment: "Bom atendimento e produto de qualidade. Entrega demorou um pouco mais que o previsto.",
    },
    {
      id: 3,
      name: "Pedro Santos",
      rating: 5,
      date: "18/02/2023",
      comment:
        "Camisetas com ótimo acabamento e estampa perfeita. A gráfica foi muito atenciosa e entregou antes do prazo previsto.",
    },
  ],
}

export default function PrintingShopPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="relative h-64 w-full">
          <Image src={printingShop.image || "/placeholder.svg"} alt={printingShop.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="container mx-auto px-4 py-6 text-white">
              <h1 className="text-3xl font-bold">{printingShop.name}</h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center mr-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{printingShop.rating}</span>
                  <span className="ml-1">({printingShop.reviews} avaliações)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{printingShop.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Tabs defaultValue="products">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="products">Produtos</TabsTrigger>
                  <TabsTrigger value="about">Sobre</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {printingShop.products.map((product) => (
                      <Link href={`/produto/${product.id}`} key={product.id}>
                        <Card className="h-full hover:shadow-lg transition-shadow">
                          <div className="relative h-48 w-full">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-blue-600 font-bold mt-2">R$ {product.price.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Sobre a Gráfica</h2>
                      <p className="text-gray-700 mb-6">{printingShop.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-2">Informações de Contato</h3>
                          <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center">
                              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                              {printingShop.address}
                            </li>
                            <li className="flex items-center">
                              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                              {printingShop.phone}
                            </li>
                            <li className="flex items-center">
                              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                              {printingShop.email}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Prazos e Entregas</h3>
                          <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center">
                              <Clock className="h-5 w-5 text-blue-600 mr-2" />
                              Produção: 3-5 dias úteis
                            </li>
                            <li className="flex items-center">
                              <Truck className="h-5 w-5 text-blue-600 mr-2" />
                              Entrega: {printingShop.deliveryTime}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Avaliações dos Clientes</h2>
                        <div className="flex items-center">
                          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 mr-2" />
                          <span className="text-2xl font-bold">{printingShop.rating}</span>
                          <span className="text-gray-500 ml-2">({printingShop.reviews} avaliações)</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {printingShop.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="flex justify-between mb-2">
                              <span className="font-medium">{review.name}</span>
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                            <div className="flex mb-2">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:w-1/3">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Iniciar Projeto</h2>
                  <p className="text-gray-600 mb-6">
                    Crie seu design personalizado e envie diretamente para {printingShop.name}.
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/editor">Criar Design</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/chat">Conversar com a Gráfica</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
