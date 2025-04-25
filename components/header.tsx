"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, UserCircle, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CartIndicator from "@/components/cart-indicator"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold p-2 rounded-md">
            <span>UT</span>
          </div>
          <span className="font-bold text-xl">Unitees</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-blue-600">
            Início
          </Link>
          <Link href="/como-funciona" className="text-sm font-medium transition-colors hover:text-blue-600">
            Como Funciona
          </Link>
          <Link href="/explorar" className="text-sm font-medium transition-colors hover:text-blue-600">
            Explorar Gráficas
          </Link>
          <Link href="/editor" className="text-sm font-medium transition-colors hover:text-blue-600">
            Criar Camiseta
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Pesquisar">
            <SearchIcon className="h-5 w-5" />
          </Button>
          
          <CartIndicator />
          
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Minha conta</span>
            </Link>
          </Button>

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
                <Link href="/" className="text-lg font-medium transition-colors hover:text-blue-600">
                  Início
                </Link>
                <Link href="/como-funciona" className="text-lg font-medium transition-colors hover:text-blue-600">
                  Como Funciona
                </Link>
                <Link href="/explorar" className="text-lg font-medium transition-colors hover:text-blue-600">
                  Explorar Gráficas
                </Link>
                <Link href="/editor" className="text-lg font-medium transition-colors hover:text-blue-600">
                  Criar Camiseta
                </Link>
                <Link href="/login" className="text-lg font-medium transition-colors hover:text-blue-600">
                  Minha Conta
                </Link>
                <Link href="/carrinho" className="text-lg font-medium transition-colors hover:text-blue-600">
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
