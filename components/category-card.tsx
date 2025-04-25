import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Category } from '@/lib/data'

interface CategoryCardProps {
  category: Category
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link 
      href={`/categoria/${category.slug}`}
      className="group relative overflow-hidden rounded-lg"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={category.image || '/images/categories/placeholder.svg'}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
        <p className="text-sm text-gray-200">{category.description}</p>
      </div>
    </Link>
  )
}

export default CategoryCard 