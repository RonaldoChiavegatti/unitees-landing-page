"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, CreditCard, Truck, Check } from "lucide-react"
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

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const { items, getTotal, clearCart } = useCartStore()
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("credit")
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
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
      const formattedPaymentMethod = paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Pix';
      
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
        }))
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
        
        <form onSubmit={handleSubmit}>
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
                    <Label htmlFor="address">Endereço completo</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                      <Select defaultValue="SP" onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="CE">Ceará</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  
                  {/* Opções de frete */}
                  <div className="mt-4">
                    <Label className="mb-2 block">Método de Entrega</Label>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-grow cursor-pointer flex justify-between">
                          <span>Entrega Padrão (3-5 dias úteis)</span>
                          <span className="font-medium">R$ {shippingCosts.standard.toFixed(2)}</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="flex-grow cursor-pointer flex justify-between">
                          <span>Entrega Expressa (1-2 dias úteis)</span>
                          <span className="font-medium">R$ {shippingCosts.express.toFixed(2)}</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
              
              {/* Dados de pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex-grow cursor-pointer">
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex-grow cursor-pointer">
                        Pix
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit" && (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Número do cartão</Label>
                        <Input 
                          id="cardNumber" 
                          name="cardNumber" 
                          placeholder="0000 0000 0000 0000" 
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Nome no cartão</Label>
                        <Input 
                          id="cardName" 
                          name="cardName" 
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Validade (MM/AA)</Label>
                          <Input 
                            id="cardExpiry" 
                            name="cardExpiry" 
                            placeholder="MM/AA" 
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input 
                            id="cardCvv" 
                            name="cardCvv" 
                            placeholder="123" 
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "pix" && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
                      <p className="mb-2">O QR Code para pagamento será gerado após a confirmação do pedido.</p>
                      <p className="text-sm text-gray-500">O pedido será processado após a confirmação do pagamento.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Resumo do pedido */}
            <div>
              <div className="bg-white rounded-lg border p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} {items.length === 1 ? 'item' : 'itens'})</span>
                    <span className="font-medium">R$ {getTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entrega ({shippingMethod === 'standard' ? 'Padrão' : 'Expressa'})</span>
                    <span className="font-medium">R$ {shippingCosts[shippingMethod as keyof typeof shippingCosts].toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">R$ {totalWithShipping.toFixed(2)}</span>
                  </div>
                  
                  <Button className="w-full mt-4" size="lg" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      "Finalizar Pedido"
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Ao finalizar o pedido, você concorda com nossos termos de serviço e política de privacidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  )
}
