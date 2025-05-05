"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { useAuthStore } from "@/lib/firebase-auth"
import { useAuthUpdate } from "@/components/auth/auth-provider"

// Importar o componente de chat com carregamento dinâmico para evitar SSR
const ChatWidget = dynamic(() => import("@/components/chat-widget"), {
  ssr: false,
  loading: () => null
})

export default function GlobalChatWidget() {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { lastUpdate } = useAuthUpdate()
  
  // Verificar se estamos no cliente
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Não mostrar o chat na página de chat ou se não estivermos no cliente
  if (!isClient || pathname === "/chat" || pathname.startsWith("/chat/")) {
    return null
  }
  
  return <ChatWidget key={`chat-widget-${lastUpdate}`} />
} 