"use client"

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
import { GraduationCap, Printer, AlertCircle, LockIcon, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

export function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { signup, loginWithGoogle } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<UserRole.STUDENT | UserRole.PRINTER>(UserRole.STUDENT)
  
  const [studentFormData, setStudentFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university: "",
    course: "",
    acceptTerms: false
  })
  
  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setStudentFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError(null)
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole.STUDENT | UserRole.PRINTER)
    setError(null)
  }
  
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (studentFormData.password !== studentFormData.confirmPassword) {
      setError("As senhas não coincidem. Por favor, verifique.")
      return
    }
    
    if (!studentFormData.acceptTerms) {
      setError("Você precisa aceitar os termos de uso para continuar.")
      return
    }
    
    setIsLoading(true)
    
    try {
      const user = await signup({
        name: studentFormData.name,
        email: studentFormData.email,
        password: studentFormData.password,
        role: UserRole.STUDENT
      })
      
      if (user) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar sua conta."
        })
        
        router.push('/minha-conta/completar-perfil')
      } else {
        setError("Não foi possível completar o cadastro. Verifique os dados informados.")
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError("Este email já está em uso. Tente fazer login ou recuperar sua senha.")
      } else if (error.code === 'auth/weak-password') {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres combinando letras e números.")
      } else {
        setError("Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.")
        console.error("Erro no cadastro:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    setError(null)
    
    try {
      const user = await loginWithGoogle()
      
      if (user) {
        const redirectPath = user.role === UserRole.STUDENT 
          ? '/minha-conta/completar-perfil'
          : '/painel-grafica/completar-perfil'
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Complete seu perfil para continuar."
        })
        
        router.push(redirectPath)
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
        <CardTitle className="text-xl text-center">Criar uma conta</CardTitle>
        <CardDescription className="text-center">
          Escolha o tipo de conta que deseja criar
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
            
            <div className="mb-4">
              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
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
                    Cadastrar com Google
                  </>
                )}
              </Button>
            </div>
            
            <div className="relative my-4">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">ou cadastre com email</span>
              </div>
            </div>
            
            <form id="student-form" onSubmit={handleStudentSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="student-name">Nome completo</Label>
                  <Input
                    id="student-name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={studentFormData.name}
                    onChange={handleStudentInputChange}
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    name="email"
                    type="email"
                    placeholder="seu.email@universidade.com"
                    value={studentFormData.email}
                    onChange={handleStudentInputChange}
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="student-university">Universidade</Label>
                    <Input
                      id="student-university"
                      name="university"
                      type="text"
                      placeholder="Nome da universidade"
                      value={studentFormData.university}
                      onChange={handleStudentInputChange}
                      disabled={isLoading || googleLoading}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="student-course">Curso</Label>
                    <Input
                      id="student-course"
                      name="course"
                      type="text"
                      placeholder="Seu curso"
                      value={studentFormData.course}
                      onChange={handleStudentInputChange}
                      disabled={isLoading || googleLoading}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="student-password">Senha</Label>
                  <Input
                    id="student-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={studentFormData.password}
                    onChange={handleStudentInputChange}
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="student-confirm-password">Confirmar senha</Label>
                  <Input
                    id="student-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={studentFormData.confirmPassword}
                    onChange={handleStudentInputChange}
                    disabled={isLoading || googleLoading}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 my-2">
                  <Checkbox 
                    id="student-terms" 
                    name="acceptTerms"
                    checked={studentFormData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setStudentFormData(prev => ({
                        ...prev,
                        acceptTerms: checked === true
                      }))
                    }
                    disabled={isLoading || googleLoading}
                  />
                  <label
                    htmlFor="student-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os <Link href="/termos" className="text-blue-600 hover:underline">termos de uso</Link> e <Link href="/privacidade" className="text-blue-600 hover:underline">política de privacidade</Link>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || googleLoading}
                  className="w-full mt-2"
                >
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>
              </div>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value={UserRole.PRINTER}>
          <CardContent className="pt-6">
            <Alert className="mb-6">
              <LockIcon className="h-4 w-4" />
              <AlertTitle>Cadastro restrito</AlertTitle>
              <AlertDescription>
                O cadastro de gráficas está disponível apenas por convite. 
                Por favor, entre em contato com nossa equipe para solicitar acesso.
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                Atualmente, o acesso para gráficas está disponível apenas para usuários de teste. 
                Use as credenciais de teste fornecidas para acessar o painel de gráficas.
              </AlertDescription>
            </Alert>
            
            <Button 
              asChild
              className="w-full mt-4"
            >
              <Link href="/login">Ir para o login</Link>
            </Button>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex flex-col items-center justify-center pt-0">
        <p className="text-center text-sm text-gray-500 mt-4">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
} 