"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Paperclip, Send, X, Minimize, ChevronLeft, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/lib/firebase-auth"
import { UserRole } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ImageUploader } from "@/components/ui/image-uploader"
import { useAuthUpdate } from "@/components/auth/auth-provider"

type MessageType = {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
  type: 'text' | 'image'
  imageUrl?: string
}

type Contact = {
  id: string
  name: string
  role: UserRole
  avatarUrl?: string
  lastMessage?: string
  unreadCount?: number
}

interface ChatWidgetProps {
  partnerId?: string // ID do parceiro (se já estiver em conversa com alguém)
  isMinimized?: boolean
  autoOpen?: boolean // Abrir automaticamente
  className?: string
}

export default function ChatWidget({
  partnerId,
  isMinimized: initialMinimized = true,
  autoOpen = false,
  className = ""
}: ChatWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(initialMinimized && !autoOpen)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(partnerId || null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [showImageUploader, setShowImageUploader] = useState(false)
  const [partnerTyping, setPartnerTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuthStore()
  const { lastUpdate } = useAuthUpdate()
  const router = useRouter()
  
  // Simular carregamento de contatos
  useEffect(() => {
    if (isAuthenticated && user) {
      // Simular dados de contatos diferentes dependendo do tipo de usuário
      const mockContacts: Contact[] = user.role === UserRole.STUDENT 
        ? [
            {
              id: "printer-1",
              name: "Gráfica UniPrint",
              role: UserRole.PRINTER,
              avatarUrl: "/images/avatars/printer-1.jpg",
              lastMessage: "Seu orçamento está pronto!",
              unreadCount: 1
            },
            {
              id: "printer-2",
              name: "FastPrint Solutions",
              role: UserRole.PRINTER,
              avatarUrl: "/images/avatars/printer-2.jpg",
              lastMessage: "Obrigado pelo seu pedido",
              unreadCount: 0
            }
          ]
        : [
            {
              id: "student-1",
              name: "Carlos Silva",
              role: UserRole.STUDENT,
              avatarUrl: "/images/avatars/student-1.jpg",
              lastMessage: "Preciso de 30 camisetas para o evento",
              unreadCount: 2
            },
            {
              id: "student-2",
              name: "Mariana Oliveira",
              role: UserRole.STUDENT,
              avatarUrl: "/images/avatars/student-2.jpg",
              lastMessage: "Qual o prazo de entrega?",
              unreadCount: 0
            }
          ];
      
      setContacts(mockContacts)
      
      // Se tiver partnerId, selecione esse chat
      if (partnerId) {
        setActiveChat(partnerId)
      }
    }
  }, [isAuthenticated, user, partnerId, lastUpdate])
  
  // Carregar mensagens quando um chat é selecionado
  useEffect(() => {
    if (activeChat) {
      setIsLoadingMessages(true)
      
      // Simular carregamento de mensagens
      setTimeout(() => {
        // Mensagens simuladas
        const mockMessages: MessageType[] = [
          {
            id: "msg1",
            senderId: user?.id || "user",
            content: "Olá! Gostaria de fazer um orçamento para camisetas.",
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
            read: true,
            type: 'text'
          },
          {
            id: "msg2",
            senderId: activeChat,
            content: "Olá! Claro, posso ajudar. Quantas camisetas você precisa?",
            timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
            read: true,
            type: 'text'
          },
          {
            id: "msg3",
            senderId: user?.id || "user",
            content: "Preciso de 30 camisetas para um evento universitário.",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            read: true,
            type: 'text'
          },
          {
            id: "msg4",
            senderId: activeChat,
            content: "Perfeito. Você já tem o design pronto ou precisa de ajuda com isso?",
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
            read: true,
            type: 'text'
          },
          {
            id: "msg5",
            senderId: user?.id || "user",
            content: "Já tenho o design. Vou enviar uma imagem.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            read: true,
            type: 'text'
          },
          {
            id: "msg6",
            senderId: user?.id || "user",
            content: "Design para as camisetas",
            timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
            read: true,
            type: 'image',
            imageUrl: "/images/products/camiseta-1.jpg"
          },
          {
            id: "msg7",
            senderId: activeChat,
            content: "Recebi o design! Vou preparar um orçamento e envio em breve.",
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
            read: false,
            type: 'text'
          }
        ];
        
        setMessages(mockMessages)
        setIsLoadingMessages(false)
      }, 1000)
    }
  }, [activeChat, user, lastUpdate])
  
  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isMinimized])
  
  const handleSendMessage = () => {
    if (!message.trim() && !showImageUploader) return
    if (!activeChat) return
    
    // Adicionar mensagem ao estado
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "user",
      content: message,
      timestamp: new Date(),
      read: false,
      type: 'text'
    }
    
    setMessages([...messages, newMessage])
    setMessage("")
    setShowImageUploader(false)
    
    // Simular resposta do parceiro
    setPartnerTyping(true)
    setTimeout(() => {
      setPartnerTyping(false)
      
      const response: MessageType = {
        id: `msg-${Date.now() + 1}`,
        senderId: activeChat,
        content: "Obrigado pela mensagem. Vou analisar e responder em breve.",
        timestamp: new Date(),
        read: false,
        type: 'text'
      }
      
      setMessages(prev => [...prev, response])
    }, 3000)
  }
  
  const handleImageUpload = (file: File, preview: string) => {
    if (!activeChat) return
    
    // Adicionar mensagem com imagem
    const newMessage: MessageType = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "user",
      content: "Enviou uma imagem",
      timestamp: new Date(),
      read: false,
      type: 'image',
      imageUrl: preview
    }
    
    setMessages([...messages, newMessage])
    setShowImageUploader(false)
    
    // Simular resposta do parceiro
    setPartnerTyping(true)
    setTimeout(() => {
      setPartnerTyping(false)
      
      const response: MessageType = {
        id: `msg-${Date.now() + 1}`,
        senderId: activeChat,
        content: "Recebi a imagem! Vou analisar e retorno em breve.",
        timestamp: new Date(),
        read: false,
        type: 'text'
      }
      
      setMessages(prev => [...prev, response])
    }, 3000)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }
  
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return "Hoje"
    } else if (diffDays === 1) {
      return "Ontem"
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
      })
    }
  }
  
  const goToFullChat = () => {
    if (activeChat) {
      router.push(`/chat?partner=${activeChat}`)
    } else {
      router.push('/chat')
    }
  }
  
  // Se não estiver autenticado, renderize apenas o botão de chat
  if (!isAuthenticated) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => router.push("/login?redirect=chat")}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    )
  }
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {isMinimized ? (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsMinimized(false)}
        >
          <MessageSquare className="h-6 w-6" />
          {contacts.reduce((total, contact) => total + (contact.unreadCount || 0), 0) > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
              {contacts.reduce((total, contact) => total + (contact.unreadCount || 0), 0)}
            </span>
          )}
        </Button>
      ) : (
        <div className="bg-background rounded-lg shadow-xl w-80 sm:w-96 max-h-[500px] flex flex-col overflow-hidden border">
          {/* Cabeçalho */}
          <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              {activeChat 
                ? contacts.find(c => c.id === activeChat)?.name || "Chat" 
                : "Mensagens"}
            </h3>
            <div className="flex space-x-1">
              {activeChat && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                  onClick={() => setActiveChat(null)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                onClick={goToFullChat}
                title="Abrir chat completo"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsMinimized(true)}
              >
                <Minimize className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsMinimized(true)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Lista de contatos ou mensagens */}
          {!activeChat ? (
            <div className="flex-grow overflow-y-auto">
              {contacts.length > 0 ? (
                <ul className="divide-y divide-border">
                  {contacts.map((contact) => (
                    <li 
                      key={contact.id}
                      className="p-3 hover:bg-muted cursor-pointer relative"
                      onClick={() => setActiveChat(contact.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium truncate">{contact.name}</h4>
                          </div>
                          {contact.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {contact.lastMessage}
                            </p>
                          )}
                        </div>
                        
                        {contact.unreadCount && contact.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {contact.unreadCount}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 p-4">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center">
                    Você ainda não tem nenhuma conversa.
                  </p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => router.push("/chat")}
                  >
                    Iniciar nova conversa
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Área de mensagens */}
              <div className="flex-grow overflow-y-auto p-3 space-y-3">
                {isLoadingMessages ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-pulse text-slate-400">Carregando mensagens...</div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isOwn = msg.senderId === user?.id || msg.senderId === "user"
                      
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwn && (
                            <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                              <AvatarImage 
                                src={contacts.find(c => c.id === msg.senderId)?.avatarUrl} 
                                alt="Avatar" 
                              />
                              <AvatarFallback>
                                {contacts.find(c => c.id === msg.senderId)?.name.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div 
                            className={`max-w-[80%] p-2 rounded-lg ${
                              isOwn 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {msg.type === 'text' && (
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            )}
                            
                            {msg.type === 'image' && (
                              <div className="space-y-1">
                                <p className="text-xs">{msg.content}</p>
                                <div className="rounded overflow-hidden">
                                  <img 
                                    src={msg.imageUrl} 
                                    alt="Imagem" 
                                    className="max-h-40 w-auto"
                                  />
                                </div>
                              </div>
                            )}
                            
                            <span 
                              className={`text-xs block mt-1 ${
                                isOwn ? 'text-primary-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {formatMessageTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    
                    {partnerTyping && (
                      <div className="flex justify-start">
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                          <AvatarImage 
                            src={contacts.find(c => c.id === activeChat)?.avatarUrl} 
                            alt="Avatar" 
                          />
                          <AvatarFallback>
                            {contacts.find(c => c.id === activeChat)?.name.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 text-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              
              {/* Componente de upload quando ativado */}
              {showImageUploader && (
                <div className="p-3 border-t">
                  <ImageUploader 
                    onUpload={handleImageUpload}
                    onDelete={() => setShowImageUploader(false)}
                    maxSize={2}
                    label="Enviar imagem"
                  />
                </div>
              )}
              
              {/* Área de entrada */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite sua mensagem..."
                      className="min-h-[60px] resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setShowImageUploader(prev => !prev)}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={handleSendMessage}
                      disabled={(!message.trim() && !showImageUploader) || !activeChat}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
} 