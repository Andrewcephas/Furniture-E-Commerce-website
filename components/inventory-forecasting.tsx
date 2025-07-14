"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { useForecastingService } from "@/lib/forecasting-service"
import { useInventory } from "@/lib/inventory-context"

export default function InventoryForecasting() {
  const { products } = useInventory()
  const forecastingService = useForecastingService()
  const [forecasts, setForecasts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  useEffect(() => {
    const productData = products.map((p) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
    }))

    const forecastData = forecastingService.getAllForecasts(productData)
    setForecasts(forecastData)
  }, [products])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <TrendingDown className="h-4 w-4 text-yellow-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-green-500" />
    }
  }

  const getStockHealthPercentage = (currentStock: number, reorderPoint: number) => {
    if (currentStock <= 0) return 0
    if (currentStock >= reorderPoint * 2) return 100
    return Math.max(0, (currentStock / (reorderPoint * 2)) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Forecasting</h2>
          <p className="text-muted-foreground">AI-powered demand forecasting and stock optimization</p>
        </div>
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Products</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {forecasts.filter((f) => f.stockoutRisk === "high").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Risk Products</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {forecasts.filter((f) => f.stockoutRisk === "medium").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forecasts.length > 0
                ? (forecasts.reduce((sum, f) => sum + f.averageDailySales, 0) / forecasts.length).toFixed(1)
                : "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting Table */}
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast & Stock Analysis</CardTitle>
          <CardDescription>Predictive analytics for inventory optimization and reorder planning</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Health</TableHead>
                <TableHead>Avg Daily Sales</TableHead>
                <TableHead>7-Day Forecast</TableHead>
                <TableHead>30-Day Forecast</TableHead>
                <TableHead>Days Until Stockout</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Recommended Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.map((forecast) => (
                <TableRow key={forecast.productId}>
                  <TableCell className="font-medium">{forecast.productName}</TableCell>
                  <TableCell>{forecast.currentStock}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={getStockHealthPercentage(forecast.currentStock, forecast.recommendedReorderPoint)}
                        className="w-16 h-2"
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(getStockHealthPercentage(forecast.currentStock, forecast.recommendedReorderPoint))}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{forecast.averageDailySales.toFixed(1)}</TableCell>
                  <TableCell>{forecast.forecastedDemand.next7Days}</TableCell>
                  <TableCell>{forecast.forecastedDemand.next30Days}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        forecast.daysUntilStockout <= 7
                          ? "text-red-600"
                          : forecast.daysUntilStockout <= 14
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {forecast.daysUntilStockout > 365 ? "365+" : forecast.daysUntilStockout}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(forecast.stockoutRisk)}
                      <Badge variant={getRiskColor(forecast.stockoutRisk)}>{forecast.stockoutRisk.toUpperCase()}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {forecast.stockoutRisk === "high" ? (
                      <Button size="sm" variant="destructive">
                        Reorder Now
                      </Button>
                    ) : forecast.stockoutRisk === "medium" ? (
                      <Button size="sm" variant="secondary">
                        Plan Reorder
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">Monitor</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reorder Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Reorder Recommendations</CardTitle>
          <CardDescription>Optimized reorder points and quantities based on demand forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecasts
              .filter((f) => f.stockoutRisk === "high" || f.stockoutRisk === "medium")
              .map((forecast) => (
                <div key={forecast.productId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getRiskIcon(forecast.stockoutRisk)}
                    <div>
                      <h4 className="font-medium">{forecast.productName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current: {forecast.currentStock} | Recommended reorder point: {forecast.recommendedReorderPoint}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Reorder {forecast.recommendedReorderQuantity} units</p>
                    <p className="text-sm text-muted-foreground">{forecast.daysUntilStockout} days until stockout</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
