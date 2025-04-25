"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store-auth"
import { UserRole, PrinterUser } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  Store, 
  Package, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Edit, 
  BarChart, 
  Plus,
  ShoppingBag,
  Users,
  AlertCircle
} from "lucide-react"

export default function PainelGraficaPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  
  useEffect(() => {
    // Redireciona para login se não estiver autenticado
    if (!isAuthenticated) {
      router.push("/login")
    }
    
    // Redireciona para área do estudante se for estudante
    if (user && user.role === UserRole.STUDENT) {
      router.push("/minha-conta")
    }
  }, [isAuthenticated, user, router])
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  if (!user || user.role !== UserRole.PRINTER) {
    return null // Não renderiza nada até verificar autenticação
  }
  
  const printerUser = user as PrinterUser;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Perfil lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Perfil da Gráfica</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatarUrl || ""} alt={printerUser.companyName || user.name} />
                  <AvatarFallback>{(printerUser.companyName || user.name).substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{printerUser.companyName || user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                
                {printerUser.verified && (
                  <div className="mt-2 bg-green-100 text-green-800 text-xs font-medium inline-flex items-center px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Gráfica Verificada
                  </div>
                )}
                
                <div className="mt-2 space-y-1 w-full text-left text-sm">
                  <p><span className="font-medium">Avaliação:</span> {printerUser.rating ? `${printerUser.rating}/5.0 (${printerUser.reviewCount} avaliações)` : "Sem avaliações"}</p>
                  <p><span className="font-medium">Prazo de entrega:</span> {printerUser.deliveryTime || "Não informado"}</p>
                  {printerUser.minimumOrderValue && (
                    <p><span className="font-medium">Pedido mínimo:</span> R$ {printerUser.minimumOrderValue.toFixed(2)}</p>
                  )}
                </div>
                
                <div className="mt-4 w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#dashboard">
                      <BarChart className="mr-2 h-5 w-5" /> Dashboard
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#produtos">
                      <Package className="mr-2 h-5 w-5" /> Meus Produtos
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#pedidos">
                      <ShoppingBag className="mr-2 h-5 w-5" /> Pedidos
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#mensagens">
                      <MessageSquare className="mr-2 h-5 w-5" /> Mensagens
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#configuracoes">
                      <Settings className="mr-2 h-5 w-5" /> Configurações
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" /> Sair
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Conteúdo principal */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="mr-2 h-5 w-5" />
                  Bem-vindo ao seu painel, {printerUser.companyName || user.name}!
                </CardTitle>
                <CardDescription>
                  Gerencie seus produtos, pedidos e interações com os clientes
                </CardDescription>
              </CardHeader>
            </Card>
            
            {!printerUser.verified && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-amber-800">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Complete seu perfil para verificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-amber-700">
                  <p>Para aproveitar ao máximo a plataforma e aparecer nos resultados de busca, complete seu perfil e envie os documentos necessários para verificação.</p>
                  <Button className="mt-4 bg-amber-600 hover:bg-amber-700" asChild>
                    <a href="/painel-grafica/completar-perfil">Completar Perfil</a>
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="dashboard">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Produtos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{printerUser.products?.length || 0}</div>
                  <p className="text-muted-foreground text-sm">Produtos cadastrados</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Pedidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-muted-foreground text-sm">Pedidos em aberto</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-muted-foreground text-sm">Clientes atendidos</p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="produtos" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="produtos">Produtos</TabsTrigger>
                <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
              </TabsList>
              
              <TabsContent value="produtos" id="produtos">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Meus Produtos</CardTitle>
                      <CardDescription>Gerencie os produtos disponíveis em sua loja</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Produto
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {printerUser.products && printerUser.products.length > 0 ? (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-16 bg-slate-100 rounded-md flex-shrink-0">
                              <img
                                src="/images/products/camiseta-1.jpg"
                                alt="Produto"
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">Camiseta Básica Universitária</h4>
                              <p className="text-sm text-muted-foreground">Camiseta 100% algodão, disponível em várias cores</p>
                              <div className="flex items-center mt-1">
                                <span className="text-sm font-medium">R$ 49,90</span>
                                <span className="mx-2 text-muted-foreground">•</span>
                                <span className="text-sm text-green-600">Em estoque</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">Editar</Button>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                                Remover
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Nenhum produto cadastrado</h3>
                        <p className="text-muted-foreground mt-2">
                          Você ainda não cadastrou nenhum produto na sua loja.
                        </p>
                        <Button className="mt-4">
                          <Plus className="mr-2 h-4 w-4" />
                          Cadastrar meu primeiro produto
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pedidos" id="pedidos">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pedidos Recebidos</CardTitle>
                    <CardDescription>Acompanhe e gerencie os pedidos dos seus clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum pedido recebido</h3>
                      <p className="text-muted-foreground mt-2">
                        Você ainda não recebeu nenhum pedido.
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <a href="/">Explorar plataforma</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mensagens" id="mensagens">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mensagens</CardTitle>
                    <CardDescription>Interaja com seus clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Nenhuma mensagem</h3>
                      <p className="text-muted-foreground mt-2">
                        Você ainda não tem conversas com clientes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 