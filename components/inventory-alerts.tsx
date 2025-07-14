"use client"

import { useState } from "react"
import { Bell, AlertTriangle, AlertCircle, XCircle, Check, X, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useInventory } from "@/lib/inventory-context"
import { useToast } from "@/hooks/use-toast"

export default function InventoryAlerts() {
  const { alerts, settings, acknowledgeAlert, clearAlert, updateSettings } = useInventory()
  const { toast } = useToast()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged)
  const acknowledgedAlerts = alerts.filter((alert) => alert.acknowledged)

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case "out_of_stock":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "reorder_required":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "low_stock":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertBadge = (alertType: string) => {
    switch (alertType) {
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      case "reorder_required":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Reorder Required
          </Badge>
        )
      case "low_stock":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Low Stock
          </Badge>
        )
      default:
        return <Badge variant="outline">Alert</Badge>
    }
  }

  const getAlertMessage = (alert: any) => {
    switch (alert.alertType) {
      case "out_of_stock":
        return `${alert.productName} is out of stock. Immediate restocking required.`
      case "reorder_required":
        return `${alert.productName} has reached critical stock level (${alert.currentStock} units). Reorder immediately.`
      case "low_stock":
        return `${alert.productName} is running low (${alert.currentStock} units left, reorder point: ${alert.reorderPoint}).`
      default:
        return `Stock alert for ${alert.productName}`
    }
  }

  const handleAcknowledge = (alertId: string, productName: string) => {
    acknowledgeAlert(alertId)
    toast({
      title: "Alert acknowledged",
      description: `Alert for ${productName} has been acknowledged.`,
    })
  }

  const handleClear = (alertId: string, productName: string) => {
    clearAlert(alertId)
    toast({
      title: "Alert cleared",
      description: `Alert for ${productName} has been cleared.`,
    })
  }

  const handleSettingsUpdate = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value })
    toast({
      title: "Settings updated",
      description: `Notification settings have been updated.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Inventory Alerts</h2>
          {unacknowledgedAlerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unacknowledgedAlerts.length}
            </Badge>
          )}
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alert Settings</DialogTitle>
              <DialogDescription>Configure your inventory alert preferences</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-reorder">Enable Auto Reorder</Label>
                <Switch
                  id="auto-reorder"
                  checked={settings.enableAutoReorder}
                  onCheckedChange={(checked) => handleSettingsUpdate("enableAutoReorder", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingsUpdate("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingsUpdate("smsNotifications", checked)}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {unacknowledgedAlerts.length === 0 && acknowledgedAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inventory alerts at this time</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Unacknowledged Alerts */}
          {unacknowledgedAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Active Alerts ({unacknowledgedAlerts.length})</CardTitle>
                <CardDescription>These alerts require your immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {unacknowledgedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between p-3 border rounded-lg bg-red-50 border-red-200"
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.alertType)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getAlertBadge(alert.alertType)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{getAlertMessage(alert)}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcknowledge(alert.id, alert.productName)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleClear(alert.id, alert.productName)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Acknowledged Alerts */}
          {acknowledgedAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  Acknowledged Alerts ({acknowledgedAlerts.length})
                </CardTitle>
                <CardDescription>Previously acknowledged alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {acknowledgedAlerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg bg-muted/30">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.alertType)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getAlertBadge(alert.alertType)}
                          <Badge variant="outline" className="text-xs">
                            Acknowledged
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{getAlertMessage(alert)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleClear(alert.id, alert.productName)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {acknowledgedAlerts.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    And {acknowledgedAlerts.length - 5} more acknowledged alerts...
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
