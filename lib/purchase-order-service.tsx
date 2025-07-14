"use client"

import { useToast } from "@/hooks/use-toast"
import { useNotificationService } from "./notification-service"

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  supplierEmail: string
  supplierPhone: string
  items: PurchaseOrderItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled"
  createdAt: string
  expectedDelivery?: string
  notes?: string
}

export interface PurchaseOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  leadTimeDays: number
  paymentTerms: string
}

// Mock suppliers
const mockSuppliers: Supplier[] = [
  {
    id: "supplier-1",
    name: "Comfort Furniture Co.",
    email: "orders@comfortfurniture.com",
    phone: "+254700000010",
    address: "123 Industrial Area, Nairobi",
    leadTimeDays: 14,
    paymentTerms: "Net 30",
  },
  {
    id: "supplier-2",
    name: "Wood Craft Ltd.",
    email: "sales@woodcraft.co.ke",
    phone: "+254700000011",
    address: "456 Furniture Street, Mombasa",
    leadTimeDays: 21,
    paymentTerms: "Net 15",
  },
  {
    id: "supplier-3",
    name: "Office Solutions Inc.",
    email: "procurement@officesolutions.com",
    phone: "+254700000012",
    address: "789 Business Park, Kisumu",
    leadTimeDays: 10,
    paymentTerms: "COD",
  },
]

export class PurchaseOrderService {
  private toast: any
  private notificationService: any

  constructor(toast: any, notificationService: any) {
    this.toast = toast
    this.notificationService = notificationService
  }

  async generatePurchaseOrder(
    supplierId: string,
    items: { productId: string; productName: string; quantity: number; unitPrice: number }[],
    notes?: string,
  ): Promise<PurchaseOrder | null> {
    try {
      const supplier = mockSuppliers.find((s) => s.id === supplierId)
      if (!supplier) {
        throw new Error("Supplier not found")
      }

      const orderItems: PurchaseOrderItem[] = items.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }))

      const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
      const tax = subtotal * 0.16 // 16% VAT
      const total = subtotal + tax

      const purchaseOrder: PurchaseOrder = {
        id: `po-${Date.now()}`,
        orderNumber: `PO-${Date.now().toString().slice(-6)}`,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierEmail: supplier.email,
        supplierPhone: supplier.phone,
        items: orderItems,
        subtotal,
        tax,
        total,
        status: "draft",
        createdAt: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + supplier.leadTimeDays * 24 * 60 * 60 * 1000).toISOString(),
        notes,
      }

      // Save to localStorage (in real app, this would be saved to database)
      const existingPOs = JSON.parse(localStorage.getItem("purchase-orders") || "[]")
      existingPOs.push(purchaseOrder)
      localStorage.setItem("purchase-orders", JSON.stringify(existingPOs))

      this.toast({
        title: "Purchase Order Generated",
        description: `PO ${purchaseOrder.orderNumber} created successfully`,
      })

      return purchaseOrder
    } catch (error) {
      console.error("Failed to generate purchase order:", error)
      this.toast({
        title: "Error",
        description: "Failed to generate purchase order",
        variant: "destructive",
      })
      return null
    }
  }

  async sendPurchaseOrder(purchaseOrderId: string): Promise<boolean> {
    try {
      const existingPOs = JSON.parse(localStorage.getItem("purchase-orders") || "[]")
      const poIndex = existingPOs.findIndex((po: PurchaseOrder) => po.id === purchaseOrderId)

      if (poIndex === -1) {
        throw new Error("Purchase order not found")
      }

      const purchaseOrder = existingPOs[poIndex]
      purchaseOrder.status = "sent"

      existingPOs[poIndex] = purchaseOrder
      localStorage.setItem("purchase-orders", JSON.stringify(existingPOs))

      // Send email to supplier
      await this.notificationService.sendNotification({
        type: "email",
        recipient: purchaseOrder.supplierEmail,
        subject: `Purchase Order ${purchaseOrder.orderNumber}`,
        message: `Please find attached purchase order ${purchaseOrder.orderNumber} for $${purchaseOrder.total.toFixed(2)}`,
        template: "purchase_order",
        data: purchaseOrder,
      })

      this.toast({
        title: "Purchase Order Sent",
        description: `PO ${purchaseOrder.orderNumber} sent to ${purchaseOrder.supplierName}`,
      })

      return true
    } catch (error) {
      console.error("Failed to send purchase order:", error)
      this.toast({
        title: "Error",
        description: "Failed to send purchase order",
        variant: "destructive",
      })
      return false
    }
  }

  getPurchaseOrders(): PurchaseOrder[] {
    return JSON.parse(localStorage.getItem("purchase-orders") || "[]")
  }

  getSuppliers(): Supplier[] {
    return mockSuppliers
  }

  async updatePurchaseOrderStatus(purchaseOrderId: string, status: PurchaseOrder["status"]): Promise<boolean> {
    try {
      const existingPOs = JSON.parse(localStorage.getItem("purchase-orders") || "[]")
      const poIndex = existingPOs.findIndex((po: PurchaseOrder) => po.id === purchaseOrderId)

      if (poIndex === -1) {
        throw new Error("Purchase order not found")
      }

      existingPOs[poIndex].status = status
      localStorage.setItem("purchase-orders", JSON.stringify(existingPOs))

      this.toast({
        title: "Status Updated",
        description: `Purchase order status updated to ${status}`,
      })

      return true
    } catch (error) {
      console.error("Failed to update purchase order status:", error)
      return false
    }
  }
}

export function usePurchaseOrderService() {
  const { toast } = useToast()
  const notificationService = useNotificationService()
  return new PurchaseOrderService(toast, notificationService)
}
