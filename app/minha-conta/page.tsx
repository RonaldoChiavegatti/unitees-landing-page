"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store-auth"
import { UserRole, StudentUser } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { GraduationCap, History, Heart, MessageSquare, ShoppingBag, Edit, LogOut } from "lucide-react"

export default function MinhaContaPage() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  
  useEffect(() => {
    // Redireciona para login se não estiver autenticado
    if (!isAuthenticated) {
      router.push("/login")
    }
    
    // Redireciona para painel de gráfica se for usuário tipo gráfica
    if (user && user.role === UserRole.PRINTER) {
      router.push("/painel-grafica")
    }
  }, [isAuthenticated, user, router])
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  if (!user || user.role !== UserRole.STUDENT) {
    return null // Não renderiza nada até verificar autenticação
  }
  
  const studentUser = user as StudentUser;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="grid md:grid-cols-[300px_1fr] gap-8">
          {/* Perfil lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatarUrl || ""} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2 space-y-1 w-full text-left text-sm">
                  <p><span className="font-medium">Universidade:</span> {studentUser.university || "Não informado"}</p>
                  <p><span className="font-medium">Curso:</span> {studentUser.course || "Não informado"}</p>
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
                    <a href="#pedidos">
                      <ShoppingBag className="mr-2 h-5 w-5" /> Meus Pedidos
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#favoritos">
                      <Heart className="mr-2 h-5 w-5" /> Favoritos
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <a href="#mensagens">
                      <MessageSquare className="mr-2 h-5 w-5" /> Mensagens
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
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Bem-vindo(a), {user.name.split(' ')[0]}!
                </CardTitle>
                <CardDescription>
                  Gerencie seus pedidos, designs favoritos e mensagens
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Tabs defaultValue="pedidos" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
                <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
                <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pedidos" id="pedidos">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Histórico de Pedidos</CardTitle>
                    <CardDescription>Veja o status de todos os seus pedidos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {studentUser.orders && studentUser.orders.length > 0 ? (
                      <div className="space-y-4">
                        {/* Lista de pedidos simulada */}
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Pedido #12345</p>
                              <p className="text-sm text-muted-foreground">10/10/2023</p>
                              <p className="mt-2 text-sm">2 camisetas personalizadas</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                Entregue
                              </span>
                              <p className="mt-1 font-medium">R$ 89,90</p>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm">Ver detalhes</Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">Pedido #12346</p>
                              <p className="text-sm text-muted-foreground">15/10/2023</p>
                              <p className="mt-2 text-sm">1 moletom personalizado</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                Em produção
                              </span>
                              <p className="mt-1 font-medium">R$ 120,00</p>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <Button variant="outline" size="sm">Ver detalhes</Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Nenhum pedido encontrado</h3>
                        <p className="text-muted-foreground mt-2">
                          Você ainda não fez nenhum pedido.
                        </p>
                        <Button className="mt-4" asChild>
                          <a href="/explorar/produtos">Explorar Produtos</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favoritos" id="favoritos">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Designs Favoritos</CardTitle>
                    <CardDescription>Produtos que você salvou para ver mais tarde</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {studentUser.favoriteProducts && studentUser.favoriteProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Lista de favoritos simulada */}
                        <div className="border rounded-lg overflow-hidden">
                          <div className="aspect-[4/3] bg-slate-100 relative">
                            <img 
                              src="/images/products/camiseta-1.jpg" 
                              alt="Camiseta design"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">Camiseta Engenharia</h4>
                            <p className="text-sm text-muted-foreground">A partir de R$ 49,90</p>
                            <div className="mt-2 flex justify-between">
                              <Button size="sm">Ver produto</Button>
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden">
                          <div className="aspect-[4/3] bg-slate-100 relative">
                            <img 
                              src="/images/products/camiseta-3.jpg" 
                              alt="Camiseta design"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">Camiseta Design</h4>
                            <p className="text-sm text-muted-foreground">A partir de R$ 45,90</p>
                            <div className="mt-2 flex justify-between">
                              <Button size="sm">Ver produto</Button>
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Nenhum favorito</h3>
                        <p className="text-muted-foreground mt-2">
                          Você ainda não adicionou produtos aos favoritos.
                        </p>
                        <Button className="mt-4" asChild>
                          <a href="/explorar/produtos">Explorar Produtos</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="mensagens" id="mensagens">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mensagens</CardTitle>
                    <CardDescription>Suas conversas com gráficas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Nenhuma mensagem</h3>
                      <p className="text-muted-foreground mt-2">
                        Você ainda não iniciou conversas com gráficas.
                      </p>
                      <Button className="mt-4" asChild>
                        <a href="/explorar/graficas">Explorar Gráficas</a>
                      </Button>
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