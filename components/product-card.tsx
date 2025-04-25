import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/data'
import { useCartStore, CartItem } from '@/lib/store'

interface ProductCardProps {
  product: Product
  featured?: boolean
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { addItem } = useCartStore()

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '/images/products/placeholder.svg',
      size: product.sizes[0]?.value || 'M',
      color: product.colors[0]?.value || '#000000'
    }
    
    addItem(cartItem)
  }

  return (
    <div className={`group bg-white rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-md ${
      featured ? 'md:col-span-2 lg:col-span-2' : ''
    }`}>
      <div className="relative">
        <Link href={`/produto/${product.id}`} className="block">
          <div className={`relative ${featured ? 'aspect-[2/1] md:aspect-[2.2/1]' : 'aspect-square'} bg-gray-100 overflow-hidden`}>
            <Image
              src={product.images[0] || '/images/products/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        
        {product.bestSeller && (
          <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
            Mais Vendido
          </Badge>
        )}
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="sr-only">Adicionar ao carrinho</span>
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="mx-2">•</span>
          <span>{product.reviewCount} avaliações</span>
        </div>
        
        <Link href={`/produto/${product.id}`} className="block group-hover:text-blue-600 transition-colors">
          <h3 className="font-medium text-lg truncate">{product.name}</h3>
        </Link>
        
        <div className="mt-1 flex items-center justify-between">
          <p className="font-semibold text-lg">R$ {product.price.toFixed(2)}</p>
          
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 3).map((color) => (
              <div 
                key={color.value}
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>
        
        {featured && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
        )}
        
        <div className="mt-3 flex items-center gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductCard 