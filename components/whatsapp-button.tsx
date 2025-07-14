"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppButton() {
  const phoneNumber = "+254700000000" // Replace with your actual WhatsApp number
  const message = "Hello! I'm interested in your furniture products."

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-[#25D366] hover:bg-[#128C7E] z-50"
      size="icon"
    >
      <MessageCircle className="h-6 w-6 text-white" />
      <span className="sr-only">Contact us on WhatsApp</span>
    </Button>
  )
}
