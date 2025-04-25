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
import { Checkbox } from "@/components/ui/checkbox"

export function SignupForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { signup } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
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
  
  const [printerFormData, setPrinterFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: false
  })
  
  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setStudentFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handlePrinterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setPrinterFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as UserRole.STUDENT | UserRole.PRINTER)
  }
  
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (studentFormData.password !== studentFormData.confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
        variant: "destructive"
      })
      return
    }
    
    if (!studentFormData.acceptTerms) {
      toast({
        title: "Aceite os termos",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive"
      })
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
          description: "Seja bem-vindo à Unitees! Sua conta foi criada com sucesso."
        })
        
        router.push('/minha-conta/completar-perfil')
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePrinterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (printerFormData.password !== printerFormData.confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
        variant: "destructive"
      })
      return
    }
    
    if (!printerFormData.acceptTerms) {
      toast({
        title: "Aceite os termos",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const user = await signup({
        name: printerFormData.name,
        email: printerFormData.email,
        password: printerFormData.password,
        role: UserRole.PRINTER
      })
      
      if (user) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Seja bem-vindo à Unitees! Complete seu perfil para começar a oferecer seus serviços."
        })
        
        router.push('/painel-grafica/completar-perfil')
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="student-terms" 
                    name="acceptTerms"
                    checked={studentFormData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setStudentFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="student-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os{" "}
                    <Link href="/termos" className="text-blue-600 hover:text-blue-800">
                      termos de uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-blue-600 hover:text-blue-800">
                      política de privacidade
                    </Link>
                  </label>
                </div>
              </div>
            </form>
          </CardContent>
        </TabsContent>
        
        <TabsContent value={UserRole.PRINTER}>
          <CardContent className="pt-6">
            <form id="printer-form" onSubmit={handlePrinterSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="printer-name">Nome do responsável</Label>
                  <Input
                    id="printer-name"
                    name="name"
                    type="text"
                    placeholder="Nome completo do responsável"
                    value={printerFormData.name}
                    onChange={handlePrinterInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="printer-company">Nome da gráfica</Label>
                  <Input
                    id="printer-company"
                    name="companyName"
                    type="text"
                    placeholder="Nome da sua gráfica"
                    value={printerFormData.companyName}
                    onChange={handlePrinterInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="printer-email">Email</Label>
                  <Input
                    id="printer-email"
                    name="email"
                    type="email"
                    placeholder="contato@suagrafica.com"
                    value={printerFormData.email}
                    onChange={handlePrinterInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="printer-phone">Telefone</Label>
                  <Input
                    id="printer-phone"
                    name="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={printerFormData.phone}
                    onChange={handlePrinterInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="printer-password">Senha</Label>
                  <Input
                    id="printer-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={printerFormData.password}
                    onChange={handlePrinterInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="printer-confirm-password">Confirmar senha</Label>
                  <Input
                    id="printer-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={printerFormData.confirmPassword}
                    onChange={handlePrinterInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id="printer-terms" 
                    name="acceptTerms"
                    checked={printerFormData.acceptTerms}
                    onCheckedChange={(checked) => 
                      setPrinterFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                    }
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="printer-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os{" "}
                    <Link href="/termos" className="text-blue-600 hover:text-blue-800">
                      termos de uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacidade" className="text-blue-600 hover:text-blue-800">
                      política de privacidade
                    </Link>
                  </label>
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
          {isLoading ? "Cadastrando..." : "Criar conta"}
        </Button>
        
        <div className="text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link 
            href="/login" 
            className="text-blue-600 hover:text-blue-800"
          >
            Faça login
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
} 