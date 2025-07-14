"use client"

import { useState } from "react"
import { Package, Plus, Edit, RotateCcw, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useInventory } from "@/lib/inventory-context"
import { useToast } from "@/hooks/use-toast"

export default function ReorderManagement() {
  const { products, updateReorderPoint, restockProduct } = useInventory()
  const { toast } = useToast()
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [reorderPoint, setReorderPoint] = useState("")
  const [reorderQuantity, setReorderQuantity] = useState("")
  const [restockQuantity, setRestockQuantity] = useState("")
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Out of Stock":
        return "destructive"
      case "Reorder Required":
        return "secondary"
      case "Low Stock":
        return "secondary"
      default:
        return "default"
    }
  }

  const handleEditReorderPoint = (product: any) => {
    setEditingProduct(product.id)
    setReorderPoint(product.reorderPoint.toString())
    setReorderQuantity(product.reorderQuantity.toString())
  }

  const handleSaveReorderPoint = () => {
    if (editingProduct && reorderPoint && reorderQuantity) {
      updateReorderPoint(editingProduct, Number.parseInt(reorderPoint), Number.parseInt(reorderQuantity))
      setEditingProduct(null)
      setReorderPoint("")
      setReorderQuantity("")

      toast({
        title: "Reorder settings updated",
        description: "The reorder point and quantity have been updated successfully.",
      })
    }
  }

  const handleRestock = () => {
    if (selectedProduct && restockQuantity) {
      const product = products.find((p) => p.id === selectedProduct)
      restockProduct(selectedProduct, Number.parseInt(restockQuantity))
      setIsRestockDialogOpen(false)
      setSelectedProduct(null)
      setRestockQuantity("")

      toast({
        title: "Product restocked",
        description: `${product?.name} has been restocked with ${restockQuantity} units.`,
      })
    }
  }

  const openRestockDialog = (productId: string) => {
    setSelectedProduct(productId)
    setIsRestockDialogOpen(true)
  }

  const productsNeedingReorder = products.filter(
    (product) => product.status === "Reorder Required" || product.status === "Out of Stock",
  )

  const lowStockProducts = products.filter((product) => product.status === "Low Stock")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reorder Management</h2>
          <p className="text-muted-foreground">Manage stock levels and reorder points</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Needing Reorder</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{productsNeedingReorder.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.status === "In Stock").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Reorders */}
      {productsNeedingReorder.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Priority Reorders</CardTitle>
            <CardDescription>Products that require immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {productsNeedingReorder.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Current Stock: {product.stock} | Reorder Point: {product.reorderPoint}
                      </p>
                      <p className="text-sm text-muted-foreground">Supplier: {product.supplier || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(product.status)}>{product.status}</Badge>
                    <Button size="sm" onClick={() => openRestockDialog(product.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Restock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products - Reorder Settings</CardTitle>
          <CardDescription>Manage reorder points and quantities for all products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Reorder Point</TableHead>
                <TableHead>Reorder Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {editingProduct === product.id ? (
                      <Input
                        type="number"
                        value={reorderPoint}
                        onChange={(e) => setReorderPoint(e.target.value)}
                        className="w-20"
                      />
                    ) : (
                      product.reorderPoint
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct === product.id ? (
                      <Input
                        type="number"
                        value={reorderQuantity}
                        onChange={(e) => setReorderQuantity(e.target.value)}
                        className="w-20"
                      />
                    ) : (
                      product.reorderQuantity
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(product.status)}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>{product.supplier || "Not specified"}</TableCell>
                  <TableCell>
                    {product.lastRestocked ? new Date(product.lastRestocked).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {editingProduct === product.id ? (
                        <>
                          <Button size="sm" onClick={handleSaveReorderPoint}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => handleEditReorderPoint(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openRestockDialog(product.id)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
            <DialogDescription>
              Add inventory to {products.find((p) => p.id === selectedProduct)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restock-quantity">Quantity to Add</Label>
              <Input
                id="restock-quantity"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRestock}>
                <Truck className="h-4 w-4 mr-2" />
                Restock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
