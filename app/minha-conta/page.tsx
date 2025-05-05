"use client"

import { Shell } from "@/components/shell"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/types"
import { useAuthStore } from "@/lib/firebase-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"

export default function StudentAccountPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true)
  
  // Verificar se o usuário está realmente autenticado no Firebase
  useEffect(() => {
    const checkAuthState = async () => {
      // Aguardar um momento para garantir que o estado foi carregado
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Se está ainda carregando, espera
      if (isLoading) return
      
      // Se não tem usuário no Firebase Auth, redireciona
      const currentFirebaseUser = auth?.currentUser
      
      if (!currentFirebaseUser && isAuthenticated) {
        // Aqui detectamos uma inconsistência: estado diz que está autenticado,
        // mas o Firebase diz que não. Isso ocorre após F5 com problemas de persistência.
        console.log("Detectada inconsistência no estado de autenticação. Redirecionando...")
        
        // Podemos tentar fazer logout para limpar o estado
        try {
          await logout()
        } catch (error) {
          console.error("Erro ao limpar sessão inconsistente:", error)
        }
        
        router.push("/login")
        return
      }
      
      // Se não está autenticado no estado, redireciona
      if (!isAuthenticated || !user) {
        router.push("/login")
        return
      }
      
      // Verificação concluída
      setIsVerifyingAuth(false)
    }
    
    checkAuthState()
  }, [isLoading, isAuthenticated, user, router, logout])
  
  const handleLogout = async () => {
    try {
      await logout()
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      })
      
      // Garantir que o redirecionamento aconteça após o logout
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
  
  // Se estiver carregando ou verificando autenticação, mostra uma mensagem de carregamento
  if (isLoading || isVerifyingAuth) {
    return (
      <Shell>
        <div className="container py-10 flex justify-center items-center">
          <p>Verificando autenticação...</p>
        </div>
      </Shell>
    )
  }
  
  // Se não estiver autenticado, não renderiza nada (será redirecionado pelo useEffect)
  if (!isAuthenticated || !user) {
    return null
  }
  
  return (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <Shell>
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>
          
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>Seus dados pessoais</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-medium">{user?.name}</h3>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  
                  <div className="w-full space-y-2 border-t pt-4 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Perfil:</span>
                      <span>Estudante</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Membro desde:</span>
                      <span>{new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/minha-conta/editar-perfil">Editar Perfil</Link>
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Sair
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:col-span-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>Histórico dos seus pedidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-10">
                    Você ainda não realizou nenhum pedido.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/produtos">Ver Produtos</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Itens Favoritos</CardTitle>
                  <CardDescription>Produtos que você salvou</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-10">
                    Você ainda não adicionou produtos aos favoritos.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/produtos">Explorar Produtos</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </Shell>
    </ProtectedRoute>
  )
} 