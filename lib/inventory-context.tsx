"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  reorderPoint: number
  reorderQuantity: number
  supplier?: string
  lastRestocked?: string
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Reorder Required"
}

export interface StockAlert {
  id: string
  productId: string
  productName: string
  alertType: "low_stock" | "out_of_stock" | "reorder_required"
  currentStock: number
  reorderPoint: number
  timestamp: string
  acknowledged: boolean
}

interface InventoryState {
  products: Product[]
  alerts: StockAlert[]
  settings: {
    enableAutoReorder: boolean
    emailNotifications: boolean
    smsNotifications: boolean
  }
}

type InventoryAction =
  | { type: "LOAD_INVENTORY"; payload: { products: Product[]; alerts: StockAlert[] } }
  | { type: "UPDATE_STOCK"; payload: { productId: string; newStock: number } }
  | { type: "UPDATE_REORDER_POINT"; payload: { productId: string; reorderPoint: number; reorderQuantity: number } }
  | { type: "ADD_ALERT"; payload: StockAlert }
  | { type: "ACKNOWLEDGE_ALERT"; payload: string }
  | { type: "CLEAR_ALERT"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<InventoryState["settings"]> }
  | { type: "RESTOCK_PRODUCT"; payload: { productId: string; quantity: number } }

const getProductStatus = (stock: number, reorderPoint: number): Product["status"] => {
  if (stock === 0) return "Out of Stock"
  if (stock <= reorderPoint) return stock <= reorderPoint / 2 ? "Reorder Required" : "Low Stock"
  return "In Stock"
}

const inventoryReducer = (state: InventoryState, action: InventoryAction): InventoryState => {
  switch (action.type) {
    case "LOAD_INVENTORY":
      return {
        ...state,
        products: action.payload.products,
        alerts: action.payload.alerts,
      }

    case "UPDATE_STOCK": {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          const newStock = action.payload.newStock
          const status = getProductStatus(newStock, product.reorderPoint)
          return { ...product, stock: newStock, status }
        }
        return product
      })

      return {
        ...state,
        products: updatedProducts,
      }
    }

    case "UPDATE_REORDER_POINT": {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          const status = getProductStatus(product.stock, action.payload.reorderPoint)
          return {
            ...product,
            reorderPoint: action.payload.reorderPoint,
            reorderQuantity: action.payload.reorderQuantity,
            status,
          }
        }
        return product
      })

      return {
        ...state,
        products: updatedProducts,
      }
    }

    case "ADD_ALERT":
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
      }

    case "ACKNOWLEDGE_ALERT":
      return {
        ...state,
        alerts: state.alerts.map((alert) => (alert.id === action.payload ? { ...alert, acknowledged: true } : alert)),
      }

    case "CLEAR_ALERT":
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }

    case "RESTOCK_PRODUCT": {
      const updatedProducts = state.products.map((product) => {
        if (product.id === action.payload.productId) {
          const newStock = product.stock + action.payload.quantity
          const status = getProductStatus(newStock, product.reorderPoint)
          return {
            ...product,
            stock: newStock,
            status,
            lastRestocked: new Date().toISOString(),
          }
        }
        return product
      })

      return {
        ...state,
        products: updatedProducts,
      }
    }

    default:
      return state
  }
}

interface InventoryContextType {
  products: Product[]
  alerts: StockAlert[]
  settings: InventoryState["settings"]
  updateStock: (productId: string, newStock: number) => void
  updateReorderPoint: (productId: string, reorderPoint: number, reorderQuantity: number) => void
  acknowledgeAlert: (alertId: string) => void
  clearAlert: (alertId: string) => void
  updateSettings: (settings: Partial<InventoryState["settings"]>) => void
  restockProduct: (productId: string, quantity: number) => void
  checkStockLevels: () => void
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined)

// Mock initial data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Modern Sofa",
    category: "Living Room",
    price: 1299.99,
    stock: 15,
    reorderPoint: 10,
    reorderQuantity: 20,
    supplier: "Comfort Furniture Co.",
    status: "In Stock",
  },
  {
    id: "2",
    name: "Wooden Dining Table",
    category: "Dining",
    price: 899.99,
    stock: 8,
    reorderPoint: 12,
    reorderQuantity: 15,
    supplier: "Wood Craft Ltd.",
    status: "Low Stock",
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    category: "Office",
    price: 349.99,
    stock: 3,
    reorderPoint: 8,
    reorderQuantity: 25,
    supplier: "Office Solutions Inc.",
    status: "Reorder Required",
  },
  {
    id: "4",
    name: "King Size Bed Frame",
    category: "Bedroom",
    price: 1499.99,
    stock: 0,
    reorderPoint: 5,
    reorderQuantity: 10,
    supplier: "Sleep Well Furniture",
    status: "Out of Stock",
  },
  {
    id: "5",
    name: "Minimalist Coffee Table",
    category: "Living Room",
    price: 499.99,
    stock: 20,
    reorderPoint: 8,
    reorderQuantity: 15,
    supplier: "Modern Living Co.",
    status: "In Stock",
  },
  {
    id: "6",
    name: "Bookshelf with Storage",
    category: "Living Room",
    price: 699.99,
    stock: 7,
    reorderPoint: 10,
    reorderQuantity: 12,
    supplier: "Storage Solutions Ltd.",
    status: "Low Stock",
  },
]

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, {
    products: initialProducts,
    alerts: [],
    settings: {
      enableAutoReorder: true,
      emailNotifications: true,
      smsNotifications: false,
    },
  })

  // Load inventory from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem("inventory")
    const savedAlerts = localStorage.getItem("inventory-alerts")
    const savedSettings = localStorage.getItem("inventory-settings")

    if (savedInventory || savedAlerts) {
      dispatch({
        type: "LOAD_INVENTORY",
        payload: {
          products: savedInventory ? JSON.parse(savedInventory) : initialProducts,
          alerts: savedAlerts ? JSON.parse(savedAlerts) : [],
        },
      })
    }

    if (savedSettings) {
      dispatch({
        type: "UPDATE_SETTINGS",
        payload: JSON.parse(savedSettings),
      })
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(state.products))
    localStorage.setItem("inventory-alerts", JSON.stringify(state.alerts))
    localStorage.setItem("inventory-settings", JSON.stringify(state.settings))
  }, [state.products, state.alerts, state.settings])

  // Check stock levels and generate alerts
  const checkStockLevels = () => {
    state.products.forEach((product) => {
      const existingAlert = state.alerts.find((alert) => alert.productId === product.id && !alert.acknowledged)

      if (!existingAlert) {
        let alertType: StockAlert["alertType"] | null = null

        if (product.stock === 0) {
          alertType = "out_of_stock"
        } else if (product.stock <= product.reorderPoint / 2) {
          alertType = "reorder_required"
        } else if (product.stock <= product.reorderPoint) {
          alertType = "low_stock"
        }

        if (alertType) {
          const alert: StockAlert = {
            id: `alert-${Date.now()}-${product.id}`,
            productId: product.id,
            productName: product.name,
            alertType,
            currentStock: product.stock,
            reorderPoint: product.reorderPoint,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          }

          dispatch({ type: "ADD_ALERT", payload: alert })

          // Simulate sending notifications
          if (state.settings.emailNotifications || state.settings.smsNotifications) {
            console.log(`📧 Notification sent for ${product.name}: ${alertType}`)
          }
        }
      }
    })
  }

  // Auto-check stock levels periodically
  useEffect(() => {
    const interval = setInterval(checkStockLevels, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [state.products, state.alerts, state.settings])

  const updateStock = (productId: string, newStock: number) => {
    dispatch({ type: "UPDATE_STOCK", payload: { productId, newStock } })
  }

  const updateReorderPoint = (productId: string, reorderPoint: number, reorderQuantity: number) => {
    dispatch({ type: "UPDATE_REORDER_POINT", payload: { productId, reorderPoint, reorderQuantity } })
  }

  const acknowledgeAlert = (alertId: string) => {
    dispatch({ type: "ACKNOWLEDGE_ALERT", payload: alertId })
  }

  const clearAlert = (alertId: string) => {
    dispatch({ type: "CLEAR_ALERT", payload: alertId })
  }

  const updateSettings = (settings: Partial<InventoryState["settings"]>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings })
  }

  const restockProduct = (productId: string, quantity: number) => {
    dispatch({ type: "RESTOCK_PRODUCT", payload: { productId, quantity } })
  }

  return (
    <InventoryContext.Provider
      value={{
        products: state.products,
        alerts: state.alerts,
        settings: state.settings,
        updateStock,
        updateReorderPoint,
        acknowledgeAlert,
        clearAlert,
        updateSettings,
        restockProduct,
        checkStockLevels,
      }}
    >
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const context = useContext(InventoryContext)
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider")
  }
  return context
}
