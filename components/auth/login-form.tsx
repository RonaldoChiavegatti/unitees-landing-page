import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store-auth"
import { UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { GraduationCap, Printer } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<UserRole.STUDENT | UserRole.PRINTER>(UserRole.STUDENT)
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole.STUDENT | UserRole.PRINTER)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Valores de exemplo para teste
      const emailToUse = activeTab === UserRole.STUDENT 
        ? "estudante@exemplo.com" 
        : "grafica@exemplo.com"
      
      const user = await login({ 
        email: emailToUse, // Para fins de demo, usa email de teste
        password: formData.password 
      })
      
      if (user) {
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${user.name}!`,
        })
        
        // Redirecionar com base no tipo de usuário
        if (user.role === UserRole.STUDENT) {
          router.push('/minha-conta')
        } else if (user.role === UserRole.PRINTER) {
          router.push('/painel-grafica')
        }
      } else {
        toast({
          title: "Erro ao fazer login",
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Para demo, vamos criar um helper que preenche automaticamente os campos
  const fillDemoCredentials = () => {
    if (activeTab === UserRole.STUDENT) {
      setFormData({
        email: "estudante@exemplo.com",
        password: "senha123"
      })
    } else {
      setFormData({
        email: "grafica@exemplo.com",
        password: "senha123"
      })
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value={UserRole.PRINTER}>
          <CardContent className="pt-6">
            <form id="printer-form" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="printer-email">Email</Label>
                  <Input
                    id="printer-email"
                    name="email"
                    type="email"
                    placeholder="sua.grafica@exemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    disabled={isLoading}
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
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex-col gap-4">
        <Button 
          form={activeTab === UserRole.STUDENT ? "student-form" : "printer-form"}
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          onClick={fillDemoCredentials}
        >
          Usar dados de demonstração
        </Button>
        
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