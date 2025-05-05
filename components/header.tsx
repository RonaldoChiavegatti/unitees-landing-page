"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, UserCircle, SearchIcon, MessageSquare, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CartIndicator from "@/components/cart-indicator"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/lib/firebase-auth"
import { UserRole } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useAuthUpdate } from "@/components/auth/auth-provider"

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const [authState, setAuthState] = useState({ 
    isAuthenticated: isAuthenticated,
    user: user
  })
  
  // Obter o contexto de atualização da autenticação
  const { lastUpdate, forceUpdate } = useAuthUpdate()
  
  // Efeito para sincronizar o estado da autenticação com o componente
  useEffect(() => {
    // Atualizar o estado local com o estado do store quando algo muda
    const currentState = useAuthStore.getState()
    setAuthState({
      isAuthenticated: currentState.isAuthenticated,
      user: currentState.user
    })
  }, [lastUpdate, isAuthenticated, user])
  
  // Efeito para observar mudanças no Firebase Auth
  useEffect(() => {
    // Observar mudanças no estado de autenticação do Firebase
    const unsubscribe = auth ? onAuthStateChanged(auth, (firebaseUser) => {
      // Força atualização do componente quando houver mudança no Firebase Auth
      const currentState = useAuthStore.getState()
      setAuthState({
        isAuthenticated: currentState.isAuthenticated,
        user: currentState.user
      })
    }) : undefined
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])
  
  const handleLogout = async () => {
    try {
      await logout()
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      
      // Fechar dropdown se estiver aberto
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false)
      }
      
      // Atualizar o estado local imediatamente
      setAuthState({
        isAuthenticated: false,
        user: null
      })
      
      // Forçar atualização global
      forceUpdate()
      
      // Redirecionar para login 
      router.push("/login")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao desconectar. Tente novamente.",
        variant: "destructive",
      })
    }
  }
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!authState.isAuthenticated) {
      // Se não estiver autenticado, redireciona para login
      router.push("/login?redirect=/chat")
      return
    }
    
    // Se estiver autenticado, vai para o chat
    router.push("/chat")
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground font-bold p-2 rounded-md">
            <span>UT</span>
          </div>
          <span className="font-bold text-xl">Unitees</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Início
          </Link>
          <Link href="/como-funciona" className="text-sm font-medium transition-colors hover:text-primary">
            Como Funciona
          </Link>
          <Link href="/explorar" className="text-sm font-medium transition-colors hover:text-primary">
            Explorar Gráficas
          </Link>
          <Link href="/editor" className="text-sm font-medium transition-colors hover:text-primary">
            Criar Camiseta
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Pesquisar">
            <SearchIcon className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />
          
          <CartIndicator />
          
          {authState.isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleChatClick}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Mensagens</span>
              </Button>
              
              <DropdownMenu open={profileDropdownOpen} onOpenChange={setProfileDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={authState.user?.avatarUrl} alt={authState.user?.name} />
                      <AvatarFallback>{authState.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{authState.user?.name}</p>
                      <p className="text-sm text-muted-foreground truncate w-[180px]">
                        {authState.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/minha-conta" className="cursor-pointer">
                      Minha Conta
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleChatClick} className="cursor-pointer">
                    Mensagens
                  </DropdownMenuItem>
                  {authState.user?.role === UserRole.PRINTER && (
                    <DropdownMenuItem asChild>
                      <Link href="/painel-grafica" className="cursor-pointer">
                        Painel da Gráfica
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Minha conta</span>
              </Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium transition-colors hover:text-primary">
                  Início
                </Link>
                <Link href="/como-funciona" className="text-lg font-medium transition-colors hover:text-primary">
                  Como Funciona
                </Link>
                <Link href="/explorar" className="text-lg font-medium transition-colors hover:text-primary">
                  Explorar Gráficas
                </Link>
                <Link href="/editor" className="text-lg font-medium transition-colors hover:text-primary">
                  Criar Camiseta
                </Link>
                
                {authState.isAuthenticated ? (
                  <>
                    <Link href="/minha-conta" className="text-lg font-medium transition-colors hover:text-primary">
                      Minha Conta
                    </Link>
                    <button 
                      onClick={handleChatClick}
                      className="text-lg font-medium transition-colors hover:text-primary text-left"
                    >
                      Mensagens
                    </button>
                    {authState.user?.role === UserRole.PRINTER && (
                      <Link href="/painel-grafica" className="text-lg font-medium transition-colors hover:text-primary">
                        Painel da Gráfica
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="text-lg font-medium transition-colors hover:text-primary text-left text-red-600"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="text-lg font-medium transition-colors hover:text-primary">
                    Entrar / Cadastrar
                  </Link>
                )}
                
                <Link href="/carrinho" className="text-lg font-medium transition-colors hover:text-primary">
                  Carrinho
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
