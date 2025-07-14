"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Mock featured products data
const featuredProducts = [
  {
    id: "1",
    name: "Modern Sofa",
    price: 1299.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Living Room",
  },
  {
    id: "2",
    name: "Wooden Dining Table",
    price: 899.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Dining",
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    price: 349.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Office",
  },
  {
    id: "4",
    name: "King Size Bed Frame",
    price: 1499.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Bedroom",
  },
  {
    id: "5",
    name: "Minimalist Coffee Table",
    price: 499.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Living Room",
  },
  {
    id: "6",
    name: "Bookshelf with Storage",
    price: 699.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Living Room",
  },
]

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { addItem } = useCart()
  const { toast } = useToast()

  const visibleProducts = 3
  const maxIndex = featuredProducts.length - visibleProducts

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover our most popular furniture pieces
            </p>
          </div>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)` }}
            >
              {featuredProducts.map((product) => (
                <div key={product.id} className={cn("w-full sm:w-1/2 lg:w-1/3 p-4 flex-shrink-0")}>
                  <Card className="h-full overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                      <Button className="w-full" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-background shadow-md hidden md:flex"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-background shadow-md hidden md:flex"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
