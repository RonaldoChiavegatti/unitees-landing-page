"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import ProductGrid from '@/components/product-grid'
import CategoryCard from '@/components/category-card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { 
  products, 
  categories, 
  availableColors, 
  availableSizes 
} from '@/lib/data'

export default function ExplorarPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState('featured')
  
  // Estado para filtros no mobile
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Função para ordenar produtos
  const sortProducts = () => {
    let sortedProducts = [...products]
    
    switch (sortBy) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        sortedProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating)
        break
      default: // featured
        sortedProducts = sortedProducts.filter(p => p.featured).concat(
          sortedProducts.filter(p => !p.featured)
        )
    }
    
    return sortedProducts
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Explorar Produtos</h1>
        
        {/* Categorias */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
        
        <Separator className="my-8" />
        
        {/* Filtros e produtos */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros desktop */}
          <div className="hidden lg:block w-64 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categorias</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      className="mr-2"
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                        }
                      }}
                    />
                    <label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Preço</h3>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="w-20"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-20"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Cores</h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-6 h-6 rounded-full border ${
                      selectedColors.includes(color.value) ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-0'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    onClick={() => {
                      if (selectedColors.includes(color.value)) {
                        setSelectedColors(selectedColors.filter(c => c !== color.value))
                      } else {
                        setSelectedColors([...selectedColors, color.value])
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-3">Tamanhos</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size.value}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded border ${
                      selectedSizes.includes(size.value)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-blue-600'
                    }`}
                    onClick={() => {
                      if (selectedSizes.includes(size.value)) {
                        setSelectedSizes(selectedSizes.filter(s => s !== size.value))
                      } else {
                        setSelectedSizes([...selectedSizes, size.value])
                      }
                    }}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex-1">
            {/* Barra de filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Input 
                    type="search"
                    placeholder="Buscar produtos..."
                    className="pl-10 pr-4"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className="w-5 h-5"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                      <SheetDescription>
                        Filtre os produtos de acordo com suas preferências
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* Mobile filters - Categories */}
                      <div>
                        <h3 className="font-medium mb-3">Categorias</h3>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center">
                              <Checkbox 
                                id={`category-mobile-${category.id}`} 
                                className="mr-2"
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategories([...selectedCategories, category.id])
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`category-mobile-${category.id}`}
                                className="text-sm cursor-pointer"
                              >
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Price range */}
                      <div>
                        <h3 className="font-medium mb-3">Preço</h3>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            className="w-20"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          />
                          <span>-</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            className="w-20"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Colors */}
                      <div>
                        <h3 className="font-medium mb-3">Cores</h3>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map((color) => (
                            <button
                              key={color.value}
                              className={`w-6 h-6 rounded-full border ${
                                selectedColors.includes(color.value) ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-0'
                              }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                              onClick={() => {
                                if (selectedColors.includes(color.value)) {
                                  setSelectedColors(selectedColors.filter(c => c !== color.value))
                                } else {
                                  setSelectedColors([...selectedColors, color.value])
                                }
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Sizes */}
                      <div>
                        <h3 className="font-medium mb-3">Tamanhos</h3>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map((size) => (
                            <button
                              key={size.value}
                              className={`w-8 h-8 flex items-center justify-center text-xs rounded border ${
                                selectedSizes.includes(size.value)
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white text-gray-800 border-gray-300 hover:border-blue-600'
                              }`}
                              onClick={() => {
                                if (selectedSizes.includes(size.value)) {
                                  setSelectedSizes(selectedSizes.filter(s => s !== size.value))
                                } else {
                                  setSelectedSizes([...selectedSizes, size.value])
                                }
                              }}
                            >
                              {size.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Destaque</SelectItem>
                    <SelectItem value="newest">Mais recentes</SelectItem>
                    <SelectItem value="price-asc">Menor preço</SelectItem>
                    <SelectItem value="price-desc">Maior preço</SelectItem>
                    <SelectItem value="rating">Melhor avaliados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Produtos */}
            <ProductGrid products={sortProducts()} />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
