"use client"

export interface SalesData {
  productId: string
  productName: string
  date: string
  quantitySold: number
  revenue: number
}

export interface ForecastData {
  productId: string
  productName: string
  currentStock: number
  averageDailySales: number
  forecastedDemand: {
    next7Days: number
    next30Days: number
    next90Days: number
  }
  recommendedReorderPoint: number
  recommendedReorderQuantity: number
  stockoutRisk: "low" | "medium" | "high"
  daysUntilStockout: number
}

export class ForecastingService {
  // Mock sales data for the last 90 days
  private generateMockSalesData(): SalesData[] {
    const products = [
      { id: "1", name: "Modern Sofa" },
      { id: "2", name: "Wooden Dining Table" },
      { id: "3", name: "Ergonomic Office Chair" },
      { id: "4", name: "King Size Bed Frame" },
      { id: "5", name: "Minimalist Coffee Table" },
      { id: "6", name: "Bookshelf with Storage" },
    ]

    const salesData: SalesData[] = []
    const today = new Date()

    for (let i = 0; i < 90; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)

      products.forEach((product) => {
        // Generate random sales data with some seasonality
        const baseQuantity = Math.floor(Math.random() * 5) + 1
        const seasonalMultiplier = 1 + 0.3 * Math.sin((i / 30) * Math.PI) // 30-day cycle
        const quantity = Math.floor(baseQuantity * seasonalMultiplier)

        if (quantity > 0) {
          salesData.push({
            productId: product.id,
            productName: product.name,
            date: date.toISOString().split("T")[0],
            quantitySold: quantity,
            revenue: quantity * (Math.random() * 500 + 200), // Random price
          })
        }
      })
    }

    return salesData
  }

  calculateForecast(productId: string, currentStock: number): ForecastData | null {
    const salesData = this.generateMockSalesData().filter((sale) => sale.productId === productId)

    if (salesData.length === 0) {
      return null
    }

    const productName = salesData[0].productName

    // Calculate average daily sales over different periods
    const last7Days = salesData.filter((sale) => {
      const saleDate = new Date(sale.date)
      const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return saleDate >= cutoff
    })

    const last30Days = salesData.filter((sale) => {
      const saleDate = new Date(sale.date)
      const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return saleDate >= cutoff
    })

    const totalSales7Days = last7Days.reduce((sum, sale) => sum + sale.quantitySold, 0)
    const totalSales30Days = last30Days.reduce((sum, sale) => sum + sale.quantitySold, 0)
    const totalSales90Days = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0)

    const averageDailySales = totalSales30Days / 30

    // Calculate forecasted demand
    const forecastedDemand = {
      next7Days: Math.ceil(averageDailySales * 7),
      next30Days: Math.ceil(averageDailySales * 30),
      next90Days: Math.ceil(averageDailySales * 90),
    }

    // Calculate days until stockout
    const daysUntilStockout = averageDailySales > 0 ? Math.floor(currentStock / averageDailySales) : 999

    // Determine stockout risk
    let stockoutRisk: "low" | "medium" | "high" = "low"
    if (daysUntilStockout <= 7) {
      stockoutRisk = "high"
    } else if (daysUntilStockout <= 14) {
      stockoutRisk = "medium"
    }

    // Calculate recommended reorder point (safety stock + lead time demand)
    const leadTimeDays = 14 // Assume 14 days lead time
    const safetyStock = Math.ceil(averageDailySales * 7) // 7 days safety stock
    const recommendedReorderPoint = Math.ceil(averageDailySales * leadTimeDays) + safetyStock

    // Calculate recommended reorder quantity (EOQ simplified)
    const recommendedReorderQuantity = Math.max(
      forecastedDemand.next30Days,
      Math.ceil(averageDailySales * 45), // 45 days worth of stock
    )

    return {
      productId,
      productName,
      currentStock,
      averageDailySales,
      forecastedDemand,
      recommendedReorderPoint,
      recommendedReorderQuantity,
      stockoutRisk,
      daysUntilStockout,
    }
  }

  getAllForecasts(products: Array<{ id: string; name: string; stock: number }>): ForecastData[] {
    return products
      .map((product) => this.calculateForecast(product.id, product.stock))
      .filter((forecast): forecast is ForecastData => forecast !== null)
  }

  getSalesAnalytics(productId?: string) {
    const salesData = productId
      ? this.generateMockSalesData().filter((sale) => sale.productId === productId)
      : this.generateMockSalesData()

    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.revenue, 0)
    const totalQuantity = salesData.reduce((sum, sale) => sum + sale.quantitySold, 0)
    const averageOrderValue = totalRevenue / salesData.length

    // Group by date for trend analysis
    const dailyTotals = salesData.reduce(
      (acc, sale) => {
        if (!acc[sale.date]) {
          acc[sale.date] = { quantity: 0, revenue: 0 }
        }
        acc[sale.date].quantity += sale.quantitySold
        acc[sale.date].revenue += sale.revenue
        return acc
      },
      {} as Record<string, { quantity: number; revenue: number }>,
    )

    return {
      totalRevenue,
      totalQuantity,
      averageOrderValue,
      dailyTotals,
      salesData,
    }
  }
}

export function useForecastingService() {
  return new ForecastingService()
}
