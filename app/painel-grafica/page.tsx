"use client"

import { Shell } from "@/components/shell"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/types"
import { useAuthStore } from "@/lib/firebase-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ShoppingBag, Settings, Activity, Plus } from "lucide-react"

export default function PrinterDashboardPage() {
  const { user, logout } = useAuthStore()
  
  return (
    <ProtectedRoute allowedRoles={[UserRole.PRINTER]}>
      <Shell>
        <div className="container py-10">
          <h1 className="text-3xl font-bold mb-6">Painel da Gráfica</h1>
          
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil da Gráfica</CardTitle>
                  <CardDescription>Informações da sua empresa</CardDescription>
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
                      <span>Gráfica</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Membro desde:</span>
                      <span>{new Date(user?.createdAt || '').toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/painel-grafica/editar-perfil">Configurações</Link>
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={() => logout()}>
                    Sair
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Menu Rápido</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/painel-grafica/pedidos">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Gerenciar Pedidos
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/painel-grafica/produtos">
                        <Plus className="mr-2 h-4 w-4" />
                        Cadastrar Produtos
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/painel-grafica/relatorios">
                        <Activity className="mr-2 h-4 w-4" />
                        Relatórios
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/painel-grafica/configuracoes">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações
                      </Link>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo de Pedidos</CardTitle>
                  <CardDescription>Visão geral dos seus pedidos recentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <h3 className="text-xl font-bold text-blue-700">0</h3>
                      <p className="text-blue-700 text-sm">Pedidos Novos</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <h3 className="text-xl font-bold text-yellow-700">0</h3>
                      <p className="text-yellow-700 text-sm">Em Produção</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <h3 className="text-xl font-bold text-green-700">0</h3>
                      <p className="text-green-700 text-sm">Entregues</p>
                    </div>
                  </div>
                  
                  <p className="text-center text-gray-500 py-6">
                    Você ainda não recebeu nenhum pedido.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/painel-grafica/pedidos">Ver Todos os Pedidos</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Cadastrados</CardTitle>
                  <CardDescription>Seus produtos disponíveis para venda</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-6">
                    Você ainda não cadastrou nenhum produto.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/painel-grafica/produtos/novo">Cadastrar Novo Produto</Link>
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