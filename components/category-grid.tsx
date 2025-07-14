import Link from "next/link"
import Image from "next/image"

import { Card } from "@/components/ui/card"

// Mock categories data
const categories = [
  {
    id: "living-room",
    name: "Living Room",
    image: "/placeholder.svg?height=300&width=300",
    count: 42,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    image: "/placeholder.svg?height=300&width=300",
    count: 36,
  },
  {
    id: "dining",
    name: "Dining",
    image: "/placeholder.svg?height=300&width=300",
    count: 28,
  },
  {
    id: "office",
    name: "Office",
    image: "/placeholder.svg?height=300&width=300",
    count: 24,
  },
]

export default function CategoryGrid() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Shop by Category</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse our furniture collections by room
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
                <div className="aspect-square relative">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <h3 className="font-semibold text-xl">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count} items</p>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
