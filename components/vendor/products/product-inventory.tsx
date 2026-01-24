"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductStore } from "@/stores/product-store";

export function ProductInventory() {
    const { data, updateData } = useProductStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                    Track stock and product codes.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                        <Input
                            id="sku"
                            placeholder="e.g. VASE-001"
                            value={data.sku}
                            onChange={(e) => updateData({ sku: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="barcode">Barcode (ISBN/UPC)</Label>
                        <Input
                            id="barcode"
                            placeholder="e.g. 12345678"
                            value={data.barcode}
                            onChange={(e) => updateData({ barcode: e.target.value })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                            id="quantity"
                            type="number"
                            placeholder="0"
                            value={data.stock}
                            onChange={(e) => updateData({ stock: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="low-stock">Low Stock Alert</Label>
                        <Input
                            id="low-stock"
                            type="number"
                            placeholder="5"
                            value={data.lowStockThreshold}
                            onChange={(e) => updateData({ lowStockThreshold: e.target.value })}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                        id="backorder"
                        checked={data.allowBackorder}
                        onCheckedChange={(c) => updateData({ allowBackorder: c === true })}
                    />
                    <Label htmlFor="backorder" className="font-normal cursor-pointer">Allow customers to purchase when out of stock</Label>
                </div>
            </CardContent>
        </Card>
    );
}
