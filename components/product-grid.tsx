import React from 'react'
import ProductCard from '@/components/product-card'
import { Product } from '@/lib/data'

interface ProductGridProps {
  products: Product[]
  featuredIndex?: number
}

const ProductGrid = ({ products, featuredIndex }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product}
          featured={index === featuredIndex}
        />
      ))}
    </div>
  )
}

export default ProductGrid 