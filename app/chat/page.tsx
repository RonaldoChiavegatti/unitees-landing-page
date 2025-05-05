"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/firebase-auth"
import { UserRole } from "@/lib/types"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Search, Users, Store, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ImageUploader } from "@/components/ui/image-uploader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthUpdate } from "@/components/auth/auth-provider"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  const { lastUpdate } = useAuthUpdate()
  
  const [activeTab, setActiveTab] = useState<string>("chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [partnerId, setPartnerId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // Obter o ID do parceiro de chat da URL, se existir
  useEffect(() => {
    const partner = searchParams.get("partner")
    if (partner) {
      setPartnerId(partner)
    }
  }, [searchParams])
  
  // Verifica se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar o chat",
        variant: "destructive"
      })
      router.push("/login?redirect=/chat")
    }
  }, [isAuthenticated, router, toast, lastUpdate])
  
  // Exemplo de gráficas e estudantes para pesquisa
  const printers = [
    {
      id: "printer-1",
      name: "Gráfica UniPrint",
      description: "Especializada em camisetas universitárias",
      city: "São Paulo, SP",
      rating: 4.8,
      reviewCount: 124,
      avatar: "/images/avatars/printer-1.jpg",
      verified: true
    },
    {
      id: "printer-2",
      name: "FastPrint Solutions",
      description: "Impressão digital e estamparia",
      city: "Rio de Janeiro, RJ",
      rating: 4.5,
      reviewCount: 87,
      avatar: "/images/avatars/printer-2.jpg",
      verified: true
    },
    {
      id: "printer-3",
      name: "Express Gráfica",
      description: "Soluções completas em impressão",
      city: "Curitiba, PR",
      rating: 4.2,
      reviewCount: 56,
      avatar: "/images/avatars/printer-default.jpg",
      verified: false
    }
  ]
  
  const students = [
    {
      id: "student-1",
      name: "Carlos Silva",
      university: "USP",
      course: "Engenharia Civil",
      avatar: "/images/avatars/student-1.jpg"
    },
    {
      id: "student-2",
      name: "Mariana Oliveira",
      university: "UFMG",
      course: "Medicina",
      avatar: "/images/avatars/student-2.jpg"
    },
    {
      id: "student-3",
      name: "Lucas Mendes",
      university: "PUC-SP",
      course: "Administração",
      avatar: "/images/avatars/student-3.jpg"
    }
  ]
  
  // Filtrar com base na busca
  const filteredPrinters = printers.filter(printer => 
    printer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    printer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    printer.city.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Handle image upload
  const handleImageUpload = (file: File, preview: string) => {
    setIsUploading(false)
    toast({
      title: "Imagem enviada com sucesso",
      description: "A imagem foi enviada para todos os participantes do chat."
    })
  }
  
  // Se não estiver autenticado, não renderiza o conteúdo
  if (!isAuthenticated) {
    return null
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <div className="bg-slate-100 py-4 px-6 border-b">
          <div className="flex justify-between items-center container mx-auto">
            <div className="flex gap-4 items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
              
              <h1 className="text-xl font-medium">Mensagens</h1>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Barra lateral */}
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Chat</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="chats" className="flex-1">
                        Conversas
                      </TabsTrigger>
                      {user?.role === UserRole.STUDENT ? (
                        <TabsTrigger value="printers" className="flex-1">
                          <Store className="h-4 w-4 mr-2" />
                          Gráficas
                        </TabsTrigger>
                      ) : (
                        <TabsTrigger value="students" className="flex-1">
                          <Users className="h-4 w-4 mr-2" />
                          Estudantes
                        </TabsTrigger>
                      )}
                    </TabsList>
                    
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-10"
                        placeholder={user?.role === UserRole.STUDENT ? "Buscar gráficas..." : "Buscar estudantes..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <TabsContent value="chats" className="mt-0 space-y-4">
                      {partnerId ? (
                        <div className="text-center p-4">
                          <p className="text-sm text-gray-500">
                            Você está em uma conversa ativa.
                          </p>
                          <Button 
                            variant="link" 
                            className="mt-1 text-sm"
                            onClick={() => setPartnerId(null)}
                          >
                            Ver todas as conversas
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium text-sm">Conversas recentes</h3>
                            <Button variant="ghost" size="sm" className="h-8">
                              <Filter className="h-4 w-4 mr-1" />
                              Filtrar
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {user?.role === UserRole.STUDENT ? (
                              // Lista de conversas para estudantes
                              <>
                                {printers.slice(0, 2).map((printer) => (
                                  <div 
                                    key={printer.id}
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-md cursor-pointer transition-colors border"
                                    onClick={() => setPartnerId(printer.id)}
                                  >
                                    <Avatar>
                                      <AvatarImage src={printer.avatar} alt={printer.name} />
                                      <AvatarFallback>{printer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow min-w-0">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium truncate text-sm">{printer.name}</h4>
                                        <span className="text-xs text-gray-500">2h atrás</span>
                                      </div>
                                      <p className="text-xs text-gray-500 truncate">
                                        Seu orçamento está pronto! Verifique os detalhes...
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              // Lista de conversas para gráficas
                              <>
                                {students.slice(0, 2).map((student) => (
                                  <div 
                                    key={student.id}
                                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-md cursor-pointer transition-colors border"
                                    onClick={() => setPartnerId(student.id)}
                                  >
                                    <Avatar>
                                      <AvatarImage src={student.avatar} alt={student.name} />
                                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow min-w-0">
                                      <div className="flex justify-between">
                                        <h4 className="font-medium truncate text-sm">{student.name}</h4>
                                        <span className="text-xs text-gray-500">1d atrás</span>
                                      </div>
                                      <p className="text-xs text-gray-500 truncate">
                                        {student.university} - {student.course}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </>
                            )}
                            
                            <Button className="w-full" variant="outline">
                              Ver todas as conversas
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="printers" className="mt-0 space-y-4">
                      <div className="space-y-3">
                        {filteredPrinters.map((printer) => (
                          <div 
                            key={printer.id}
                            className="border rounded-md p-4 hover:border-blue-400 cursor-pointer transition-colors"
                            onClick={() => setPartnerId(printer.id)}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar>
                                <AvatarImage src={printer.avatar} alt={printer.name} />
                                <AvatarFallback>{printer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-grow">
                                <div className="flex items-center">
                                  <h3 className="font-medium">{printer.name}</h3>
                                  {printer.verified && (
                                    <Badge variant="outline" className="ml-2 bg-blue-50">Verificada</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">{printer.city}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{printer.description}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="text-amber-500 text-sm font-medium">{printer.rating}</span>
                                <span className="mx-1">★</span>
                                <span className="text-xs text-gray-500">({printer.reviewCount} avaliações)</span>
                              </div>
                              <Button size="sm" variant="outline">Conversar</Button>
                            </div>
                          </div>
                        ))}
                        
                        {filteredPrinters.length === 0 && (
                          <div className="text-center py-8">
                            <Store className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500">Nenhuma gráfica encontrada</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="students" className="mt-0 space-y-4">
                      <div className="space-y-3">
                        {filteredStudents.map((student) => (
                          <div 
                            key={student.id}
                            className="border rounded-md p-4 hover:border-blue-400 cursor-pointer transition-colors"
                            onClick={() => setPartnerId(student.id)}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar>
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{student.name}</h3>
                                <p className="text-xs text-gray-500">{student.university}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{student.course}</p>
                            <div className="flex justify-end mt-2">
                              <Button size="sm" variant="outline">Conversar</Button>
                            </div>
                          </div>
                        ))}
                        
                        {filteredStudents.length === 0 && (
                          <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                            <p className="text-gray-500">Nenhum estudante encontrado</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Conversa
                    </Button>
                    
                    {isUploading && (
                      <div className="mt-4">
                        <ImageUploader 
                          onUpload={handleImageUpload}
                          onDelete={() => setIsUploading(false)}
                          maxSize={2}
                          label="Enviar imagem para o chat"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Área de chat principal */}
            <div className="lg:col-span-2">
              {partnerId ? (
                <div className="w-full h-full min-h-[600px] bg-white rounded-lg border shadow-sm">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={
                            user?.role === UserRole.STUDENT 
                            ? printers.find(p => p.id === partnerId)?.avatar 
                            : students.find(s => s.id === partnerId)?.avatar
                          } 
                          alt="Avatar do parceiro" 
                        />
                        <AvatarFallback>
                          {user?.role === UserRole.STUDENT 
                            ? printers.find(p => p.id === partnerId)?.name.charAt(0) 
                            : students.find(s => s.id === partnerId)?.name.charAt(0)
                          }
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="font-medium">
                          {user?.role === UserRole.STUDENT 
                            ? printers.find(p => p.id === partnerId)?.name 
                            : students.find(s => s.id === partnerId)?.name
                          }
                        </h3>
                        <p className="text-xs text-gray-500">
                          {user?.role === UserRole.STUDENT 
                            ? printers.find(p => p.id === partnerId)?.city
                            : students.find(s => s.id === partnerId)?.university
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow flex items-center justify-center">
                      <div className="text-center space-y-3">
                        <p className="text-gray-500">
                          Esta é uma demonstração do chat. Em uma implementação real, a conversa seria carregada do servidor.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => setIsUploading(true)}
                        >
                          Enviar imagem
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-white rounded-lg border shadow-sm">
                  <div className="bg-slate-100 p-6 rounded-full inline-block mb-4">
                    <Users className="h-12 w-12 text-slate-400" />
                  </div>
                  <h2 className="text-xl font-medium text-center mb-2">Selecione uma conversa</h2>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    Escolha uma conversa da lista ou inicie uma nova conversa com uma gráfica ou estudante.
                  </p>
                  <Button onClick={() => setActiveTab(user?.role === UserRole.STUDENT ? "printers" : "students")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Conversa
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
