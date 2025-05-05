import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/firebase-auth"
import { UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { GraduationCap, Printer, Mail, AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, loginWithGoogle } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<UserRole.STUDENT | UserRole.PRINTER>(UserRole.STUDENT)
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole.STUDENT | UserRole.PRINTER)
    setError(null)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      if (!formData.email || !formData.password) {
        setError("Preencha todos os campos obrigatórios.")
        setIsLoading(false)
        return
      }
      
      const user = await login({ 
        email: formData.email,
        password: formData.password 
      })
      
      if (user) {
        if (
          (activeTab === UserRole.STUDENT && user.role !== UserRole.STUDENT) || 
          (activeTab === UserRole.PRINTER && user.role !== UserRole.PRINTER)
        ) {
          if (user.role === UserRole.PRINTER) {
            setError("Esta conta é de uma gráfica. Por favor, use a aba 'Gráfica' para fazer login.")
          } else {
            setError("Esta conta é de um estudante. Por favor, use a aba 'Estudante' para fazer login.")
          }
          setIsLoading(false)
          return
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${user.name}!`,
        })
        
        const redirectUrl = typeof window !== 'undefined' 
          ? sessionStorage.getItem('auth_redirect') 
          : null;
        
        if (redirectUrl) {
          sessionStorage.removeItem('auth_redirect');
          router.push(redirectUrl);
        } else {
          if (user.role === UserRole.STUDENT) {
            router.push('/minha-conta')
          } else if (user.role === UserRole.PRINTER) {
            router.push('/painel-grafica')
          }
        }
      } else {
        setError("Credenciais inválidas. Verifique seu email e senha.")
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login. Tente novamente mais tarde.")
      console.error("Erro no login:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError(null)
    
    try {
      const user = await loginWithGoogle()
      
      if (user) {
        if (
          (activeTab === UserRole.STUDENT && user.role !== UserRole.STUDENT) || 
          (activeTab === UserRole.PRINTER && user.role !== UserRole.PRINTER)
        ) {
          if (user.role === UserRole.PRINTER) {
            setError("Esta conta é de uma gráfica. Por favor, use a aba 'Gráfica' para fazer login.")
          } else {
            setError("Esta conta é de um estudante. Por favor, use a aba 'Estudante' para fazer login.")
          }
          setGoogleLoading(false)
          return
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo, ${user.name}!`,
        })
        
        const redirectUrl = typeof window !== 'undefined' 
          ? sessionStorage.getItem('auth_redirect') 
          : null;
        
        if (redirectUrl) {
          sessionStorage.removeItem('auth_redirect');
          router.push(redirectUrl);
        } else {
          if (user.role === UserRole.STUDENT) {
            router.push('/minha-conta')
          } else if (user.role === UserRole.PRINTER) {
            router.push('/painel-grafica')
          }
        }
      } else {
        setError("Não foi possível fazer login com o Google. Tente novamente.")
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login com o Google. Tente novamente mais tarde.")
      console.error("Erro no login com Google:", error)
    } finally {
      setGoogleLoading(false)
    }
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Entre na sua conta</CardTitle>
        <CardDescription className="text-center">
          Acesse sua conta para gerenciar pedidos e personalizar camisetas
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value={UserRole.STUDENT} className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4" />
            Estudante
          </TabsTrigger>
          <TabsTrigger value={UserRole.PRINTER} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Gráfica
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={UserRole.STUDENT}>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form id="student-form" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    name="email"
                    type="email"
                    placeholder="seu.email@universidade.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="student-password">Senha</Label>
                    <Link 
                      href="/esqueci-senha" 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || googleLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar com Email"}
                </Button>
                
                <div className="relative my-2">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white px-2 text-gray-500 text-sm">ou</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading || googleLoading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {googleLoading ? (
                    "Conectando..."
                  ) : (
                    <>
                      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                      </svg>
                      Entrar com Google
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value={UserRole.PRINTER}>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                O acesso para gráficas está disponível apenas para usuários de teste.
                Use as credenciais de teste fornecidas para acessar o painel de gráficas.
              </AlertDescription>
            </Alert>
            
            <form id="printer-form" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="printer-email">Email</Label>
                  <Input
                    id="printer-email"
                    name="email"
                    type="email"
                    placeholder="email@suagrafica.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="printer-password">Senha</Label>
                    <Link 
                      href="/esqueci-senha" 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="printer-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || googleLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </form>
            
            <div className="relative my-2">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">ou</span>
              </div>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading || googleLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              {googleLoading ? (
                "Conectando..."
              ) : (
                <>
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Entrar com Google
                </>
              )}
            </Button>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex-col gap-4">
        <div className="text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <Link 
            href="/cadastro" 
            className="text-blue-600 hover:text-blue-800"
          >
            Cadastre-se
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 