"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/lib/store-auth"
import { UserRole, StudentUser, PrinterUser } from "@/lib/types"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Search, Send, Info, Plus, Image, PaperclipIcon, Smile } from "lucide-react"

// Dados de exemplo para conversas
const mockChats = [
  {
    id: "chat-1",
    partnerId: "printer-1",
    partnerName: "Gráfica Universitária Express",
    lastMessage: "Seu orçamento está pronto! Verifique os detalhes e me avise se tiver dúvidas.",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutos atrás
    unread: 2,
    avatar: "/images/avatars/printer.jpg"
  },
  {
    id: "chat-2",
    partnerId: "printer-2",
    partnerName: "Print Solutions",
    lastMessage: "Olá! Tenho disponibilidade para entregar seu pedido na próxima semana.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
    unread: 0,
    avatar: "/images/avatars/printer-default.jpg"
  },
  {
    id: "chat-3",
    partnerId: "student-1",
    partnerName: "Carlos Mendes",
    lastMessage: "Obrigado pelas informações! Vou fazer o pagamento hoje.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    unread: 0,
    avatar: "/images/avatars/student.jpg"
  },
]

// Modelo de mensagens
type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    productId?: string;
  };
}

// Dados de exemplo para mensagens
const mockMessages = {
  "chat-1": [
    {
      id: "msg-1",
      senderId: "user-1", // ID do usuário atual (estudante)
      content: "Olá! Gostaria de fazer um orçamento para 30 camisetas personalizadas para minha turma de Engenharia.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
      type: 'text' as const
    },
    {
      id: "msg-2",
      senderId: "printer-1",
      content: "Olá! Claro, será um prazer atender vocês. Você já tem o design pronto ou precisamos criar?",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
      read: true,
      type: 'text' as const
    },
    {
      id: "msg-3",
      senderId: "user-1",
      content: "Já temos o design! Criei aqui na plataforma. Vou compartilhar com você.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
      read: true,
      type: 'text' as const
    },
    {
      id: "msg-4",
      senderId: "user-1",
      content: "Camiseta Engenharia Civil 2024",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 11 * 60 * 1000).toISOString(),
      read: true,
      type: 'image' as const,
      metadata: {
        imageUrl: "/images/products/camiseta-1.jpg",
        productId: "design-123"
      }
    },
    {
      id: "msg-5",
      senderId: "printer-1",
      content: "Recebi! O design está bem legal. Vou preparar um orçamento considerando 30 unidades em poliéster.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
      read: true,
      type: 'text' as const
    },
    {
      id: "msg-6",
      senderId: "printer-1",
      content: "Seu orçamento está pronto! Para 30 camisetas, o valor unitário fica em R$ 37,90, totalizando R$ 1.137,00. Posso oferecer um desconto de 5% para pagamento via PIX.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      type: 'text' as const
    },
    {
      id: "msg-7",
      senderId: "printer-1",
      content: "O prazo de produção é de 7 dias úteis após a aprovação do pedido.",
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      read: false,
      type: 'text' as const
    }
  ]
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuthStore()
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messageEndRef = useRef<null | HTMLDivElement>(null)
  
  // Obtém o ID do parceiro de chat da URL, se existir
  useEffect(() => {
    const partnerId = searchParams.get("partner")
    if (partnerId) {
      // Encontrar o chat com este parceiro ou criar um novo
      const existingChat = mockChats.find(chat => chat.partnerId === partnerId)
      if (existingChat) {
        setActiveChat(existingChat.id)
      } else {
        // Em uma implementação real, criaríamos um novo chat
        toast({
          title: "Chat iniciado",
          description: "Iniciando conversa com um novo parceiro."
        })
      }
    }
  }, [searchParams, toast])
  
  // Carrega mensagens quando um chat é selecionado
  useEffect(() => {
    if (activeChat) {
      const chatMessages = mockMessages[activeChat as keyof typeof mockMessages] || []
      setMessages(chatMessages)
      
      // Marca mensagens como lidas
      if (chatMessages.length > 0) {
        // Em uma implementação real, enviaríamos essa informação para o servidor
        setMessages(chatMessages.map(msg => {
          if (!msg.read && msg.senderId !== user?.id) {
            return { ...msg, read: true }
          }
          return msg
        }))
      }
    }
  }, [activeChat, user])
  
  // Rola para a última mensagem quando houver novas mensagens
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
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
  }, [isAuthenticated, router, toast])
  
  // Filtra as conversas de acordo com a busca
  const filteredChats = mockChats.filter(chat => 
    chat.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Obtém o chat ativo
  const currentChat = activeChat ? mockChats.find(chat => chat.id === activeChat) : null
  
  // Envia uma nova mensagem
  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "user-1", // ID do usuário atual
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text'
    }
    
    setMessages([...messages, newMsg])
    setNewMessage("")
    
    // Simula resposta após alguns segundos
    setTimeout(() => {
      const autoReply: Message = {
        id: `msg-auto-${Date.now()}`,
        senderId: currentChat?.partnerId || "bot",
        content: "Obrigado pela sua mensagem! Vou analisar e responder em breve.",
        timestamp: new Date().toISOString(),
        read: false,
        type: 'text'
      }
      
      setMessages(prev => [...prev, autoReply])
    }, 3000)
  }
  
  // Formata data relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.round(diffMs / 1000)
    const diffMin = Math.round(diffSec / 60)
    const diffHour = Math.round(diffMin / 60)
    const diffDay = Math.round(diffHour / 24)
    
    if (diffSec < 60) {
      return "agora"
    } else if (diffMin < 60) {
      return `${diffMin}m atrás`
    } else if (diffHour < 24) {
      return `${diffHour}h atrás`
    } else if (diffDay === 1) {
      return "ontem"
    } else {
      return `${diffDay} dias atrás`
    }
  }
  
  // Verifica se há um parceiro de chat e obtém informações
  const getChatPartnerInfo = () => {
    if (!currentChat) return null
    
    return {
      name: currentChat.partnerName,
      avatar: currentChat.avatar
    }
  }
  
  const partnerInfo = getChatPartnerInfo()
  
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
        
        <div className="container mx-auto px-4 py-6 flex-grow flex flex-col md:flex-row gap-6">
          {/* Lista de conversas */}
          <div className={`w-full md:w-1/3 lg:w-1/4 ${activeChat ? 'hidden md:block' : ''}`}>
            <Card className="h-full flex flex-col">
              <CardHeader className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="Buscar conversas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-y-auto p-0">
                {filteredChats.length > 0 ? (
                  <ul className="divide-y">
                    {filteredChats.map((chat) => (
                      <li 
                        key={chat.id}
                        className={`p-4 hover:bg-slate-50 cursor-pointer relative ${activeChat === chat.id ? 'bg-slate-50' : ''}`}
                        onClick={() => setActiveChat(chat.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={chat.avatar} alt={chat.partnerName} />
                            <AvatarFallback>{chat.partnerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-center mb-1">
                              <h3 className="font-medium truncate">{chat.partnerName}</h3>
                              <span className="text-xs text-gray-500">{formatRelativeTime(chat.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          </div>
                        </div>
                        
                        {chat.unread > 0 && (
                          <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center h-5 min-w-[20px] px-1">
                            {chat.unread}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    <p className="text-gray-500 mb-2">Nenhuma conversa encontrada</p>
                    {searchQuery && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSearchQuery("")}
                      >
                        Limpar busca
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
              
              <div className="p-4 border-t">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Mensagem
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Área de conversa */}
          <div className={`w-full md:w-2/3 lg:w-3/4 ${!activeChat ? 'hidden md:flex' : ''}`}>
            {activeChat && partnerInfo ? (
              <Card className="h-full flex flex-col">
                {/* Cabeçalho do chat */}
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="md:hidden"
                      onClick={() => setActiveChat(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <Avatar>
                      <AvatarImage src={partnerInfo.avatar} alt={partnerInfo.name} />
                      <AvatarFallback>{partnerInfo.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-medium">{partnerInfo.name}</h3>
                      <p className="text-xs text-gray-500">Online agora</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Mensagens */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === user?.id || message.senderId === "user-1"
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            isOwn 
                              ? 'bg-blue-600 text-white rounded-br-none' 
                              : 'bg-slate-100 text-gray-800 rounded-bl-none'
                          }`}
                        >
                          {message.type === 'text' && (
                            <p>{message.content}</p>
                          )}
                          
                          {message.type === 'image' && (
                            <div className="space-y-2">
                              <p>{message.content}</p>
                              <div className="rounded overflow-hidden">
                                <img 
                                  src={message.metadata?.imageUrl || ""}
                                  alt="Imagem compartilhada"
                                  className="w-full h-auto max-h-40 object-cover"
                                />
                              </div>
                              <div className="text-right">
                                <Button 
                                  size="sm" 
                                  variant={isOwn ? "secondary" : "outline"} 
                                  className="text-xs h-7 px-2"
                                >
                                  Ver design
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <div 
                            className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  <div ref={messageEndRef} />
                </div>
                
                {/* Área de entrada de mensagem */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Plus className="h-5 w-5" />
                    </Button>
                    
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      className="flex-grow min-h-[40px] max-h-32 resize-y p-2"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                    
                    <Button 
                      disabled={!newMessage.trim()}
                      onClick={sendMessage}
                      size="icon"
                      className="rounded-full"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg p-6">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <MessageSquare className="h-10 w-10 text-slate-400" />
                </div>
                <h2 className="text-xl font-medium text-center mb-2">Nenhuma conversa selecionada</h2>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  Selecione uma conversa da lista ou inicie uma nova conversa com uma gráfica ou estudante.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Mensagem
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
