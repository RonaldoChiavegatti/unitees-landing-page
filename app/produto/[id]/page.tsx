"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Star, ShoppingBag, Heart, Truck, Check, ShoppingCart } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ProductGrid from '@/components/product-grid'
import { getProductById, getProductReviews, getProductsByCategory, getBestSellerProducts } from '@/lib/data'
import { useCartStore, CartItem } from '@/lib/store'

const colors = [
  { id: "black", name: "Preto", value: "#000000", inStock: true },
  { id: "white", name: "Branco", value: "#FFFFFF", inStock: true },
  { id: "navy", name: "Azul Marinho", value: "#172554", inStock: true },
  { id: "red", name: "Vermelho", value: "#DC2626", inStock: true },
  { id: "green", name: "Verde", value: "#15803D", inStock: false },
  { id: "purple", name: "Roxo", value: "#7E22CE", inStock: true },
]

const sizes = [
  { id: "pp", name: "PP", value: "PP", description: "Tamanho PP (Muito Pequeno)", inStock: true },
  { id: "p", name: "P", value: "P", description: "Tamanho P (Pequeno)", inStock: true },
  { id: "m", name: "M", value: "M", description: "Tamanho M (Médio)", inStock: true },
  { id: "g", name: "G", value: "G", description: "Tamanho G (Grande)", inStock: true },
  { id: "gg", name: "GG", value: "GG", description: "Tamanho GG (Extra Grande)", inStock: true },
  { id: "xgg", name: "XGG", value: "XGG", description: "Tamanho XGG (Extra Extra Grande)", inStock: false },
]

// Mock de produtos relacionados para demonstração
const relatedProducts = [
  {
    id: 1,
    name: "Camiseta Universitária Medicina",
    imageUrl: "/placeholder.svg?height=400&width=300",
    price: 69.90,
    rating: 4.7,
    reviews: 42,
  },
  {
    id: 2,
    name: "Camiseta Universitária Direito",
    imageUrl: "/placeholder.svg?height=400&width=300",
    price: 69.90,
    discountPrice: 59.90,
    rating: 4.5,
    reviews: 28,
    isNew: true,
  },
  {
    id: 3,
    name: "Moletom Universitário Engenharia",
    imageUrl: "/placeholder.svg?height=400&width=300",
    price: 129.90,
    rating: 4.8,
    reviews: 56,
  },
  {
    id: 4,
    name: "Camiseta Universitária Arquitetura",
    imageUrl: "/placeholder.svg?height=400&width=300",
    price: 69.90,
    rating: 4.6,
    reviews: 32,
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCartStore()
  
  const product = getProductById(params.id)
  const reviews = getProductReviews(params.id)
  
  // Produto não encontrado
  if (!product) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-16 flex-grow flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link href="/explorar">Ver todos os produtos</Link>
          </Button>
        </div>
        <Footer />
      </main>
    )
  }
  
  // Produtos relacionados
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4)
  
  const bestSellers = getBestSellerProducts().slice(0, 4)
  
  // Estados
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0].value)
  const [quantity, setQuantity] = useState(1)
  
  const handleAddToCart = () => {
    const selectedColorObj = product.colors.find(c => c.value === selectedColor)
    const selectedSizeObj = product.sizes.find(s => s.value === selectedSize)
    
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0] || '/images/products/placeholder.svg',
      size: selectedSizeObj?.value || 'M',
      color: selectedColorObj?.value || '#000000'
    }
    
    addItem(cartItem)
    
    toast({
      title: "Produto adicionado ao carrinho",
      description: `${quantity}x ${product.name} adicionado com sucesso.`,
    })
  }
  
  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <Link 
            href="/explorar" 
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para produtos
          </Link>
        </div>
        
        {/* Detalhes do produto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Imagens do produto */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden border bg-white">
              <Image
                src={product.images[selectedImage] || '/images/products/placeholder.svg'}
                alt={product.name}
                fill
                className="object-contain"
              />
              {product.bestSeller && (
                <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">
                  Mais Vendido
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 border rounded-md overflow-hidden flex-shrink-0 ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Informações e ações */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-500 ml-1">({product.reviewCount} avaliações)</span>
                </div>
                
                {product.inStock ? (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Em estoque
                  </span>
                ) : (
                  <span className="text-red-600">Esgotado</span>
                )}
              </div>
              
              <div className="text-2xl font-bold text-blue-600 mb-4">
                R$ {product.price.toFixed(2)}
              </div>
              
              <p className="text-gray-700 mb-6">{product.description}</p>
            </div>
            
            <Separator />
            
            {/* Seleção de cor */}
            <div>
              <h3 className="font-medium mb-3">Cor</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-10 h-10 rounded-full border ${
                      selectedColor === color.value ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-0'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
            </div>
            
            {/* Seleção de tamanho */}
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="font-medium">Tamanho</h3>
                <button className="text-sm text-blue-600 hover:underline">
                  Guia de tamanhos
                </button>
              </div>
              
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size.value}>
                    <RadioGroupItem
                      value={size.value}
                      id={`size-${size.value}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`size-${size.value}`}
                      className={`w-12 h-12 flex items-center justify-center text-sm rounded border cursor-pointer ${
                        selectedSize === size.value
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      {size.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Quantidade */}
            <div>
              <h3 className="font-medium mb-3">Quantidade</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <span className="text-xl">-</span>
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="text-xl">+</span>
                </Button>
              </div>
            </div>
            
            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="flex-1" 
                size="lg" 
                variant="outline"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
              
              <Button 
                className="flex-1" 
                size="lg"
                onClick={handleBuyNow}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Comprar Agora
              </Button>
            </div>
            
            {/* Informações adicionais */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Envio para todo o Brasil</p>
                  <p className="text-sm text-gray-600">Entrega expressa disponível</p>
                </div>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Garantia de qualidade</p>
                  <p className="text-sm text-gray-600">Produtos com garantia de 30 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abas de informações */}
        <Tabs defaultValue="details" className="mb-16">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações ({reviews.length})</TabsTrigger>
            <TabsTrigger value="shipping">Envio e Devoluções</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Descrição do Produto</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Perguntas Frequentes</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como devo lavar esta camiseta?</AccordionTrigger>
                    <AccordionContent>
                      Recomendamos lavar à mão ou na máquina com água fria e ciclo suave. Não use alvejante, não deixe de molho e seque à sombra para preservar as cores.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>As cores podem desbotar?</AccordionTrigger>
                    <AccordionContent>
                      Nossas camisetas possuem tratamento antidesbotamento, mas para aumentar a vida útil da estampa, recomendamos lavar com roupas de cores semelhantes e evitar exposição prolongada ao sol.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Posso personalizar ainda mais este modelo?</AccordionTrigger>
                    <AccordionContent>
                      Sim! Você pode entrar em contato conosco pelo chat para discutir opções adicionais de personalização, incluindo cores, tecidos e adição de elementos gráficos específicos.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Avaliações de clientes</h3>
                <Button>Escrever Avaliação</Button>
              </div>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Ainda não há avaliações para este produto.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{review.title}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        Por {review.user} • {review.date}
                      </p>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informações de Envio</h3>
                <p className="text-gray-700 mb-4">
                  Oferecemos envio para todo o Brasil através de transportadoras parceiras. O prazo de entrega varia de acordo com a sua localização:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Capitais e regiões metropolitanas: 3-5 dias úteis</li>
                  <li>Demais localidades: 5-10 dias úteis</li>
                  <li>Opção de envio expresso disponível com custo adicional</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Política de Devolução</h3>
                <p className="text-gray-700 mb-4">
                  Sua satisfação é nossa prioridade. Se não estiver completamente satisfeito com sua compra, você pode solicitar uma devolução ou troca:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Prazo de 30 dias após o recebimento para devoluções</li>
                  <li>O produto deve estar em perfeitas condições, sem sinais de uso</li>
                  <li>Embalagem original preservada</li>
                  <li>Para problemas de fabricação, cobrimos os custos de envio da devolução</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Produtos relacionados */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <ProductGrid products={relatedProducts} />
        </section>
        
        {/* Mais vendidos */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Mais Vendidos</h2>
          <ProductGrid products={bestSellers} />
        </section>
      </div>
      
      <Footer />
    </main>
  )
}
