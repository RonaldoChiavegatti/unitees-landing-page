"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const featuredDesigns = [
  {
    id: 1,
    title: "Engenharia Civil 2023",
    image: "/placeholder.svg?height=300&width=300",
    creator: "João Silva",
  },
  {
    id: 2,
    title: "Medicina Turma 45",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Ana Oliveira",
  },
  {
    id: 3,
    title: "Direito UFMG",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Carlos Santos",
  },
  {
    id: 4,
    title: "Administração 2023",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Mariana Costa",
  },
  {
    id: 5,
    title: "Psicologia Noturno",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Pedro Almeida",
  },
  {
    id: 6,
    title: "Arquitetura e Urbanismo",
    image: "/placeholder.svg?height=300&width=300",
    creator: "Juliana Mendes",
  },
]

export default function FeaturedDesignsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1)
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2)
      } else {
        setVisibleItems(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = featuredDesigns.length
  const maxIndex = totalSlides - visibleItems

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex))
  }

  return (
    <div className="relative">
      <div className="flex justify-between absolute top-1/2 left-0 right-0 -mt-6 px-4 z-10">
        <Button variant="outline" size="icon" className="bg-white rounded-full shadow-md" onClick={prevSlide}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="bg-white rounded-full shadow-md" onClick={nextSlide}>
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="overflow-hidden" ref={carouselRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {featuredDesigns.map((design) => (
            <div
              key={design.id}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 p-4"
              style={{ width: `${100 / visibleItems}%` }}
            >
              <Link href={`/produto/${design.id}`} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-64 w-full">
                    <Image src={design.image || "/placeholder.svg"} alt={design.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{design.title}</h3>
                    <p className="text-gray-600">por {design.creator}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
