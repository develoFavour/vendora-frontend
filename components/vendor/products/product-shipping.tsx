"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useProductStore } from "@/stores/product-store";

export function ProductShipping() {
    const { data, updateData, updateDimension } = useProductStore();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                        id="digital"
                        checked={data.isDigital}
                        onCheckedChange={(c) => updateData({ isDigital: c === true })}
                    />
                    <Label htmlFor="digital" className="cursor-pointer">This is a digital product</Label>
                </div>

                {!data.isDigital && (
                    <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-3">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                placeholder="0.0"
                                value={data.dimensions.weight}
                                onChange={(e) => updateDimension("weight", parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="grid gap-2">
                                <Label className="text-xs" htmlFor="length">L (cm)</Label>
                                <Input
                                    id="length"
                                    type="number"
                                    placeholder="0"
                                    value={data.dimensions.length}
                                    onChange={(e) => updateDimension("length", parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs" htmlFor="width">W (cm)</Label>
                                <Input
                                    id="width"
                                    type="number"
                                    placeholder="0"
                                    value={data.dimensions.width}
                                    onChange={(e) => updateDimension("width", parseFloat(e.target.value))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs" htmlFor="height">H (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    placeholder="0"
                                    value={data.dimensions.height}
                                    onChange={(e) => updateDimension("height", parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
