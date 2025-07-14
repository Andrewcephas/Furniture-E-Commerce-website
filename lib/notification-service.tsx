"use client"

import { useToast } from "@/hooks/use-toast"

export interface NotificationData {
  type: "email" | "sms" | "both"
  recipient: string
  subject?: string
  message: string
  template?: "order_confirmation" | "low_stock" | "reorder_alert" | "payment_success"
  data?: Record<string, any>
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class NotificationService {
  private toast: any

  constructor(toast: any) {
    this.toast = toast
  }

  async sendNotification(notification: NotificationData): Promise<boolean> {
    try {
      // Simulate API call to notification service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (notification.type === "email" || notification.type === "both") {
        await this.sendEmail(notification)
      }

      if (notification.type === "sms" || notification.type === "both") {
        await this.sendSMS(notification)
      }

      this.toast({
        title: "Notification sent",
        description: `${notification.type.toUpperCase()} notification sent to ${notification.recipient}`,
      })

      return true
    } catch (error) {
      console.error("Failed to send notification:", error)
      this.toast({
        title: "Notification failed",
        description: "Failed to send notification. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  private async sendEmail(notification: NotificationData): Promise<void> {
    const template = this.getEmailTemplate(notification.template, notification.data)

    // Simulate email sending
    console.log("📧 Email sent:", {
      to: notification.recipient,
      subject: notification.subject || template.subject,
      html: template.html,
      text: template.text,
    })
  }

  private async sendSMS(notification: NotificationData): Promise<void> {
    // Simulate SMS sending
    console.log("📱 SMS sent:", {
      to: notification.recipient,
      message: notification.message,
    })
  }

  private getEmailTemplate(template?: string, data?: Record<string, any>): EmailTemplate {
    switch (template) {
      case "order_confirmation":
        return {
          subject: `Order Confirmation - #${data?.orderNumber}`,
          html: `
            <h2>Thank you for your order!</h2>
            <p>Your order #${data?.orderNumber} has been confirmed.</p>
            <p>Total: $${data?.total}</p>
            <p>We'll send you updates as your order is processed.</p>
          `,
          text: `Thank you for your order! Your order #${data?.orderNumber} has been confirmed. Total: $${data?.total}`,
        }

      case "low_stock":
        return {
          subject: `Low Stock Alert - ${data?.productName}`,
          html: `
            <h2>Low Stock Alert</h2>
            <p>${data?.productName} is running low on stock.</p>
            <p>Current stock: ${data?.currentStock}</p>
            <p>Reorder point: ${data?.reorderPoint}</p>
          `,
          text: `Low Stock Alert: ${data?.productName} is running low. Current: ${data?.currentStock}, Reorder point: ${data?.reorderPoint}`,
        }

      case "payment_success":
        return {
          subject: `Payment Successful - Order #${data?.orderNumber}`,
          html: `
            <h2>Payment Successful!</h2>
            <p>Your payment of $${data?.amount} has been processed successfully.</p>
            <p>Order #${data?.orderNumber}</p>
            <p>Transaction ID: ${data?.transactionId}</p>
          `,
          text: `Payment Successful! $${data?.amount} processed for Order #${data?.orderNumber}. Transaction ID: ${data?.transactionId}`,
        }

      default:
        return {
          subject: "Notification from Elegance Furniture",
          html: `<p>${data?.message || "You have a new notification."}</p>`,
          text: data?.message || "You have a new notification.",
        }
    }
  }
}

export function useNotificationService() {
  const { toast } = useToast()
  return new NotificationService(toast)
}
