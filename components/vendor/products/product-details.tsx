"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/stores/product-store";

export function ProductDetails() {
    const { data, updateData, generateSlug } = useProductStore();

    // Auto generate slug when name changes if slug is empty
    useEffect(() => {
        if (!data.seo.slug && data.name) {
            generateSlug(data.name);
        }
    }, [data.name, data.seo.slug, generateSlug]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                    Basic information about your product.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        type="text"
                        className="w-full"
                        placeholder="e.g. Handmade Ceramic Vase"
                        value={data.name}
                        onChange={(e) => updateData({ name: e.target.value })}
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="description">Description (Markdown)</Label>
                    <Textarea
                        id="description"
                        className="min-h-32"
                        placeholder="Describe your product... supports markdown."
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
