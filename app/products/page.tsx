import Link from "next/link"
import Image from "next/image"
import { Filter, Grid3X3, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

// Mock products data
const products = [
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
  {
    id: "7",
    name: "Accent Chair",
    price: 449.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Living Room",
  },
  {
    id: "8",
    name: "Nightstand",
    price: 249.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Bedroom",
  },
  {
    id: "9",
    name: "Dining Chairs (Set of 4)",
    price: 599.99,
    image: "/placeholder.svg?height=400&width=400",
    category: "Dining",
  },
]

export default function ProductsPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-1">Browse our collection of high-quality furniture</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="rounded-r-none border-r-0">
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-l-none">
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>

          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>Narrow down your product search with the filters below.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Categories</h3>
                  <div className="space-y-2">
                    {["Living Room", "Bedroom", "Dining", "Office"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Price Range</h3>
                    <span className="text-sm text-muted-foreground">$0 - $2000</span>
                  </div>
                  <Slider defaultValue={[0, 2000]} max={2000} step={50} className="w-full" />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Material</h3>
                  <div className="space-y-2">
                    {["Wood", "Metal", "Fabric", "Leather", "Glass"].map((material) => (
                      <div key={material} className="flex items-center space-x-2">
                        <Checkbox id={`material-${material}`} />
                        <label
                          htmlFor={`material-${material}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {material}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline">Reset Filters</Button>
                  <Button>Apply Filters</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex md:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filter Products
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85%]">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
              <SheetDescription>Narrow down your product search with the filters below.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-4">
                <h3 className="font-medium">Categories</h3>
                <div className="space-y-2">
                  {["Living Room", "Bedroom", "Dining", "Office"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`category-mobile-${category}`} />
                      <label
                        htmlFor={`category-mobile-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Price Range</h3>
                  <span className="text-sm text-muted-foreground">$0 - $2000</span>
                </div>
                <Slider defaultValue={[0, 2000]} max={2000} step={50} className="w-full" />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Material</h3>
                <div className="space-y-2">
                  {["Wood", "Metal", "Fabric", "Leather", "Glass"].map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox id={`material-mobile-${material}`} />
                      <label
                        htmlFor={`material-mobile-${material}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline">Reset Filters</Button>
                <Button>Apply Filters</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
            <CardContent className="p-4">
              <div>
                <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <p className="font-medium mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
