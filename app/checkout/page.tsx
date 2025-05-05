"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PaymentForm } from "@/components/payment-form"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const { items, getTotal, clearCart } = useCartStore()
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [isLoading, setIsLoading] = useState(false)
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  
  // Simular valores de frete
  const shippingCosts = {
    standard: 15.90,
    express: 29.90
  }
  
  const totalWithShipping = getTotal() + shippingCosts[shippingMethod as keyof typeof shippingCosts]
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handlePaymentSubmit = (paymentData: any) => {
    setIsLoading(true)
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      setIsLoading(false)
      
      // Gerar número de pedido aleatório
      const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Data atual formatada
      const currentDate = new Date().toLocaleDateString('pt-BR');
      
      // Calcular data estimada de entrega
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (shippingMethod === 'express' ? 2 : 5));
      const estimatedDelivery = deliveryDate.toLocaleDateString('pt-BR');
      
      // Formatar métodos para exibição
      const formattedShippingMethod = shippingMethod === 'standard' ? 'Entrega Padrão (3-5 dias úteis)' : 'Entrega Expressa (1-2 dias úteis)';
      const formattedPaymentMethod = paymentData.paymentMethod === 'credit' ? 'Cartão de Crédito' : 
                                    paymentData.paymentMethod === 'debit' ? 'Cartão de Débito' : 
                                    paymentData.paymentMethod === 'pix' ? 'PIX' : 'Boleto';
      
      // Salvar informações do pedido para a página de confirmação
      localStorage.setItem('orderInfo', JSON.stringify({
        orderNumber,
        date: currentDate,
        estimatedDelivery,
        total: totalWithShipping,
        paymentMethod: formattedPaymentMethod,
        shippingMethod: formattedShippingMethod,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        address: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        }
      }));
      
      clearCart()
      
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Você receberá um email com os detalhes do seu pedido.",
      })
      
      router.push("/checkout/confirmacao")
    }, 2000)
  }
  
  // Evitar erro de hidratação
  if (!mounted) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          <p>Carregando...</p>
        </div>
        <Footer />
      </main>
    )
  }
  
  // Redirecionar para o carrinho se não houver itens
  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          <Card>
            <CardHeader>
              <CardTitle>Seu carrinho está vazio</CardTitle>
              <CardDescription>Adicione produtos ao carrinho antes de finalizar a compra</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/explorar">Explorar Produtos</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-6">
          <Link 
            href="/carrinho" 
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para o carrinho
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dados de entrega e pagamento */}
          <div className="lg:col-span-2 space-y-8">
            {/* Endereço de entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select 
                      defaultValue="SP"
                      onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Método de envio */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Envio</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  defaultValue="standard" 
                  className="space-y-3"
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <div>
                        <Label htmlFor="standard" className="font-medium">Entrega Padrão</Label>
                        <p className="text-sm text-gray-500">3-5 dias úteis</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      R$ {shippingCosts.standard.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="express" id="express" />
                      <div>
                        <Label htmlFor="express" className="font-medium">Entrega Expressa</Label>
                        <p className="text-sm text-gray-500">1-2 dias úteis</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      R$ {shippingCosts.express.toFixed(2)}
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {/* Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentForm 
                  onSubmit={handlePaymentSubmit}
                  isLoading={isLoading}
                  total={totalWithShipping}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Resumo do pedido */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lista de produtos */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.size} - {item.color} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                {/* Resumo de valores */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>R$ {getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>R$ {shippingCosts[shippingMethod as keyof typeof shippingCosts].toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {totalWithShipping.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
