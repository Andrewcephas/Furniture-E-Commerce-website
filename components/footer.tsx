import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Elegance Furniture</h3>
          <p className="text-sm text-muted-foreground">
            Quality furniture for modern living. Transform your space with our handcrafted collection.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/products" className="text-muted-foreground hover:text-primary">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/categories/living-room" className="text-muted-foreground hover:text-primary">
                Living Room
              </Link>
            </li>
            <li>
              <Link href="/categories/bedroom" className="text-muted-foreground hover:text-primary">
                Bedroom
              </Link>
            </li>
            <li>
              <Link href="/categories/dining" className="text-muted-foreground hover:text-primary">
                Dining
              </Link>
            </li>
            <li>
              <Link href="/categories/office" className="text-muted-foreground hover:text-primary">
                Office
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-muted-foreground hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/careers" className="text-muted-foreground hover:text-primary">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-muted-foreground hover:text-primary">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="text-muted-foreground hover:text-primary">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link href="/returns" className="text-muted-foreground hover:text-primary">
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="text-muted-foreground hover:text-primary">
                Warranty Information
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Elegance Furniture. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
