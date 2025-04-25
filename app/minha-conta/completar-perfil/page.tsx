"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store-auth"
import { UserRole, StudentUser } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

export default function CompletarPerfilEstudantePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated, updateProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    university: "",
    course: "",
    graduationYear: "",
    phone: ""
  })
  
  useEffect(() => {
    // Redireciona para login se não estiver autenticado
    if (!isAuthenticated) {
      router.push("/login")
    }
    
    // Redireciona para painel de gráfica se for usuário tipo gráfica
    if (user && user.role === UserRole.PRINTER) {
      router.push("/painel-grafica/completar-perfil")
    }
    
    // Preenche dados existentes
    if (user && user.role === UserRole.STUDENT) {
      const studentUser = user as StudentUser;
      setFormData({
        university: studentUser.university || "",
        course: studentUser.course || "",
        graduationYear: studentUser.graduationYear || "",
        phone: studentUser.phone || ""
      })
    }
  }, [isAuthenticated, user, router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Atualiza o perfil com os dados do formulário
      const updatedUser = await updateProfile({
        university: formData.university,
        course: formData.course,
        graduationYear: formData.graduationYear,
        phone: formData.phone
      } as Partial<StudentUser>)
      
      if (updatedUser) {
        toast({
          title: "Perfil atualizado com sucesso",
          description: "Seu perfil foi completado com sucesso. Agora você pode explorar a plataforma completa."
        })
        
        router.push("/minha-conta")
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar seu perfil. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  if (!user || user.role !== UserRole.STUDENT) {
    return null // Não renderiza nada até verificar autenticação
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-xl px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Complete seu Perfil</CardTitle>
              <CardDescription>
                Forneça mais alguns detalhes para personalizar sua experiência na Unitees
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="university">Universidade</Label>
                  <Input
                    id="university"
                    name="university"
                    placeholder="Nome da sua universidade"
                    value={formData.university}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <Input
                    id="course"
                    name="course"
                    placeholder="Seu curso"
                    value={formData.course}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Ano de Formatura</Label>
                    <Select
                      name="graduationYear"
                      value={formData.graduationYear}
                      onValueChange={(value) => handleSelectChange("graduationYear", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="graduationYear">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="pt-2 text-center text-sm text-muted-foreground">
                  <p>
                    Você poderá atualizar essas informações a qualquer momento no seu perfil.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar e Continuar"}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => router.push("/minha-conta")}
                  disabled={isLoading}
                >
                  Completar depois
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 