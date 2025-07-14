"use client"

import { useState } from "react"
import { Download, Mail, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNotificationService } from "@/lib/notification-service"
import { useAuth } from "@/lib/auth-context"

export interface ReceiptData {
  orderNumber: string
  transactionId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  paymentStatus: "success" | "pending" | "failed"
  timestamp: string
  shippingAddress: {
    street: string
    city: string
    county: string
    postalCode: string
  }
}

interface ReceiptGeneratorProps {
  receiptData: ReceiptData
  onClose?: () => void
}

export default function ReceiptGenerator({ receiptData, onClose }: ReceiptGeneratorProps) {
  const [isEmailSending, setIsEmailSending] = useState(false)
  const notificationService = useNotificationService()
  const { user } = useAuth()

  const handleEmailReceipt = async () => {
    setIsEmailSending(true)

    await notificationService.sendNotification({
      type: "email",
      recipient: receiptData.customerEmail,
      template: "payment_success",
      data: {
        orderNumber: receiptData.orderNumber,
        amount: receiptData.total,
        transactionId: receiptData.transactionId,
        customerName: receiptData.customerName,
        items: receiptData.items,
      },
    })

    // Also send to admin if user is admin
    if (user?.role === "admin") {
      await notificationService.sendNotification({
        type: "email",
        recipient: "admin@elegance.com",
        subject: `New Order Receipt - ${receiptData.orderNumber}`,
        message: `New order received from ${receiptData.customerName}. Total: $${receiptData.total}`,
        data: receiptData,
      })
    }

    setIsEmailSending(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const receiptContent = document.getElementById("receipt-content")
    if (receiptContent) {
      // In a real app, you'd use a library like jsPDF to generate PDF
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${receiptData.orderNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt { max-width: 600px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20px; }
                .divider { border-top: 1px solid #ccc; margin: 10px 0; }
                .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .total-row { font-weight: bold; }
              </style>
            </head>
            <body>
              ${receiptContent.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Payment Receipt</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="receipt-content" className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Elegance Furniture</h2>
            <p className="text-muted-foreground">123 Furniture Street, Nairobi, Kenya</p>
            <p className="text-muted-foreground">Phone: +254 700 000 000</p>
            <p className="text-muted-foreground">Email: info@elegancefurniture.com</p>
          </div>

          <Separator />

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Order Number:</strong> {receiptData.orderNumber}
              </p>
              <p>
                <strong>Transaction ID:</strong> {receiptData.transactionId}
              </p>
              <p>
                <strong>Date:</strong> {new Date(receiptData.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Payment Method:</strong> {receiptData.paymentMethod}
              </p>
              <p>
                <strong>Status:</strong>
                <span className={`ml-1 ${receiptData.paymentStatus === "success" ? "text-green-600" : "text-red-600"}`}>
                  {receiptData.paymentStatus.toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <p>
                <strong>Customer:</strong> {receiptData.customerName}
              </p>
              <p>
                <strong>Email:</strong> {receiptData.customerEmail}
              </p>
              <p>
                <strong>Phone:</strong> {receiptData.customerPhone}
              </p>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-2">Shipping Address</h3>
            <p className="text-sm">
              {receiptData.shippingAddress.street}
              <br />
              {receiptData.shippingAddress.city}, {receiptData.shippingAddress.county}
              <br />
              {receiptData.shippingAddress.postalCode}
            </p>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-2">
              {receiptData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                  </div>
                  <div className="text-right">
                    <span>${item.price.toFixed(2)} each</span>
                    <div className="font-medium">${item.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${receiptData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>${receiptData.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (16%):</span>
              <span>${receiptData.tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${receiptData.total.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p>For support, contact us at support@elegancefurniture.com</p>
            <p>Return policy: 30 days from purchase date</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
          <Button onClick={handleEmailReceipt} disabled={isEmailSending} className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            {isEmailSending ? "Sending..." : "Email Receipt"}
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex-1 bg-transparent">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="flex-1 bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          {onClose && (
            <Button variant="secondary" onClick={onClose} className="w-full mt-2">
              Close
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
