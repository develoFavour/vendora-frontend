"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useProductStore } from "@/stores/product-store";
import { Badge } from "@/components/ui/badge";

export function ProductVariants() {
    const {
        data,
        updateData,
        addVariantOption,
        updateVariantOption,
        removeVariantOption,
        updateVariant
    } = useProductStore();

    const handleOptionNameChange = (index: number, name: string) => {
        updateVariantOption(index, name, data.variantOptions[index].values);
    };

    const handleValuesChange = (index: number, valuesString: string) => {
        const values = valuesString.split(",").map(v => v.trim()).filter(v => v !== "");
        updateVariantOption(index, data.variantOptions[index].name, values);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>
                    Does this product come in different options like size or color?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="has-variants"
                            checked={data.hasVariants}
                            onCheckedChange={(c) => updateData({ hasVariants: c === true })}
                        />
                        <Label htmlFor="has-variants" className="font-medium cursor-pointer">This product has variants</Label>
                    </div>

                    {data.hasVariants && (
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Separator />

                            {/* Variant Options Section */}
                            <div className="flex flex-col gap-4">
                                <Label className="text-sm font-semibold">Product Options</Label>
                                {data.variantOptions.map((option, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg border bg-muted/30 relative group">
                                        <div className="md:col-span-4 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Option Name</Label>
                                            <Input
                                                placeholder="e.g. Color"
                                                value={option.name}
                                                onChange={(e) => handleOptionNameChange(index, e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-7 space-y-2">
                                            <Label className="text-xs text-muted-foreground">Values (comma separated)</Label>
                                            <Input
                                                placeholder="Red, Blue, Green"
                                                value={option.values.join(", ")}
                                                onChange={(e) => handleValuesChange(index, e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-1 flex items-end justify-center pb-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive transition-colors"
                                                onClick={() => removeVariantOption(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full md:w-fit"
                                    onClick={addVariantOption}
                                >
                                    <Plus className="h-3 w-3 mr-2" />
                                    Add Option
                                </Button>
                            </div>

                            {/* Generated Variants Table */}
                            {data.variants.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-semibold">Generated Variants ({data.variants.length})</Label>
                                        <CardDescription>Adjust price and stock per variant</CardDescription>
                                    </div>

                                    <div className="rounded-md border overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/50 border-b">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-medium">Variant</th>
                                                    <th className="px-4 py-2 text-left font-medium">SKU</th>
                                                    <th className="px-4 py-2 text-left font-medium">Price</th>
                                                    <th className="px-4 py-2 text-left font-medium">Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {data.variants.map((variant, vIndex) => (
                                                    <tr key={variant.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-1 flex-wrap">
                                                                {Object.entries(variant.options).map(([key, val]) => (
                                                                    <Badge key={key} variant="secondary" className="text-[10px] font-normal">
                                                                        {key}: {val}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 min-w-[120px]">
                                                            <Input
                                                                className="h-8 text-xs"
                                                                value={variant.sku}
                                                                onChange={(e) => updateVariant(vIndex, { sku: e.target.value })}
                                                                placeholder="Variant SKU"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 min-w-[100px]">
                                                            <Input
                                                                className="h-8 text-xs"
                                                                value={variant.price}
                                                                onChange={(e) => updateVariant(vIndex, { price: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="px-4 py-3 min-w-[80px]">
                                                            <Input
                                                                className="h-8 text-xs"
                                                                value={variant.stock}
                                                                onChange={(e) => updateVariant(vIndex, { stock: e.target.value })}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
