"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store-auth"
import { UserRole, PrinterUser } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect } from "react"

const estadosBrasileiros = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" }
]

export default function CompletarPerfilGraficaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, updateProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    description: "",
    services: {
      camisetas: false,
      moletons: false,
      canecas: false,
      adesivos: false,
      outros: false
    },
    minimumOrderValue: "",
    deliveryTime: "",
    acceptsSmallOrders: false
  })
  
  useEffect(() => {
    // Redireciona para login se não estiver autenticado
    if (!isAuthenticated) {
      router.push("/login")
    }
    
    // Redireciona para perfil de estudante se for estudante
    if (user && user.role === UserRole.STUDENT) {
      router.push("/minha-conta/completar-perfil")
    }
    
    // Preenche dados existentes
    if (user && user.role === UserRole.PRINTER) {
      const printerUser = user as PrinterUser;
      setFormData({
        companyName: printerUser.companyName || "",
        address: printerUser.address || "",
        city: printerUser.city || "",
        state: printerUser.state || "",
        zipCode: printerUser.zipCode || "",
        phone: printerUser.phone || "",
        description: printerUser.description || "",
        services: {
          camisetas: printerUser.services?.includes("Camisetas") || false,
          moletons: printerUser.services?.includes("Moletons") || false,
          canecas: printerUser.services?.includes("Canecas") || false,
          adesivos: printerUser.services?.includes("Adesivos") || false,
          outros: printerUser.services?.some(s => !["Camisetas", "Moletons", "Canecas", "Adesivos"].includes(s)) || false
        },
        minimumOrderValue: printerUser.minimumOrderValue?.toString() || "",
        deliveryTime: printerUser.deliveryTime || "",
        acceptsSmallOrders: printerUser.minimumOrderValue ? printerUser.minimumOrderValue < 100 : false
      })
    }
  }, [isAuthenticated, user, router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith('services.')) {
      const serviceName = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        services: {
          ...prev.services,
          [serviceName]: checked
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: checked }))
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Converte os serviços selecionados em array
      const servicesArray = Object.entries(formData.services)
        .filter(([_, isSelected]) => isSelected)
        .map(([name, _]) => {
          switch (name) {
            case 'camisetas': return 'Camisetas'
            case 'moletons': return 'Moletons'
            case 'canecas': return 'Canecas'
            case 'adesivos': return 'Adesivos'
            case 'outros': return 'Outros'
            default: return name
          }
        })
      
      // Atualiza o perfil com os dados do formulário
      const updatedUser = await updateProfile({
        companyName: formData.companyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        phone: formData.phone,
        description: formData.description,
        services: servicesArray,
        minimumOrderValue: formData.minimumOrderValue ? parseFloat(formData.minimumOrderValue) : undefined,
        deliveryTime: formData.deliveryTime
      } as Partial<PrinterUser>)
      
      if (updatedUser) {
        toast({
          title: "Perfil atualizado com sucesso",
          description: "Seu perfil foi completado com sucesso. Agora você pode começar a oferecer seus serviços."
        })
        
        router.push("/painel-grafica")
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!user || user.role !== UserRole.PRINTER) {
    return null // Não renderiza nada até verificar autenticação
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete o Perfil da sua Gráfica</CardTitle>
              <CardDescription>
                Forneça os detalhes da sua gráfica para começar a oferecer seus serviços na plataforma
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações da Empresa</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Gráfica</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Nome da sua gráfica"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição da Gráfica</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descreva sua gráfica, especialidades e diferenciais..."
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="resize-none min-h-[100px]"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Localização e Contato</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Rua, número, complemento"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Sua cidade"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Select
                        name="state"
                        value={formData.state}
                        onValueChange={(value) => handleSelectChange("state", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosBrasileiros.map((estado) => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="00000-000"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(00) 00000-0000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Serviços e Condições</h3>
                  
                  <div className="space-y-3">
                    <Label>Serviços Oferecidos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="services-camisetas" 
                          checked={formData.services.camisetas}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("services.camisetas", checked === true)
                          }
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="services-camisetas"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Camisetas
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="services-moletons" 
                          checked={formData.services.moletons}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("services.moletons", checked === true)
                          }
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="services-moletons"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Moletons
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="services-canecas" 
                          checked={formData.services.canecas}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("services.canecas", checked === true)
                          }
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="services-canecas"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Canecas
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="services-adesivos" 
                          checked={formData.services.adesivos}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("services.adesivos", checked === true)
                          }
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="services-adesivos"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Adesivos
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="services-outros" 
                          checked={formData.services.outros}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange("services.outros", checked === true)
                          }
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="services-outros"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Outros
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minimumOrderValue">Valor Mínimo de Pedido (R$)</Label>
                      <Input
                        id="minimumOrderValue"
                        name="minimumOrderValue"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.minimumOrderValue}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">Prazo de Entrega</Label>
                      <Input
                        id="deliveryTime"
                        name="deliveryTime"
                        placeholder="Ex: 5-7 dias úteis"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="acceptsSmallOrders" 
                      checked={formData.acceptsSmallOrders}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("acceptsSmallOrders", checked === true)
                      }
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="acceptsSmallOrders"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Aceito pedidos pequenos (menos de 10 unidades)
                    </label>
                  </div>
                </div>
                
                <div className="pt-2 text-center text-sm text-muted-foreground">
                  <p>
                    Você poderá atualizar essas informações a qualquer momento no seu perfil.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar e Continuar"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push("/painel-grafica")}
                  disabled={isLoading}
                >
                  Completar depois
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 