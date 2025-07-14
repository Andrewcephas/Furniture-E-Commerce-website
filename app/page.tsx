import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Star, TrendingUp, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeaturedProducts from "@/components/featured-products"
import CategoryGrid from "@/components/category-grid"
import NewsletterSignup from "@/components/newsletter-signup"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Elegant Furniture for Modern Living
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Transform your space with our handcrafted furniture collection. Quality pieces designed for comfort
                  and style.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/products">Shop Collection</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/categories">Explore Categories</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[600px] overflow-hidden rounded-xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                width={800}
                height={600}
                alt="Modern living room with elegant furniture"
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose Us</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We pride ourselves on quality, design, and customer satisfaction
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Premium Quality</h3>
                <p className="text-muted-foreground">Crafted with the finest materials for durability and style</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Expert Design</h3>
                <p className="text-muted-foreground">Created by skilled artisans with attention to detail</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast Delivery</h3>
                <p className="text-muted-foreground">Quick and reliable shipping to your doorstep</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center p-6 text-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Shopping</h3>
                <p className="text-muted-foreground">Seamless online experience with secure checkout</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Categories */}
      <CategoryGrid />

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  )
}
