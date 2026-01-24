"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProductStore } from "@/stores/product-store";
import { useState } from "react";

export function ProductSEO() {
    const { data, updateSEO } = useProductStore();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Card>
            <CardHeader>
                <CardTitle>SEO Preview</CardTitle>
                <CardDescription>
                    See how your product appears in search results.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md bg-muted/30 p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                        vendora.com/products/{data.seo.slug || "product-name"}
                    </p>
                    <h4 className="text-sm font-medium text-primary hover:underline cursor-pointer truncate">
                        {data.seo.title || data.name || "Product Name"} | Vendora
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {data.seo.description || data.description || "Your product description will appear here."}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 h-8 text-xs"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Close SEO Settings" : "Edit SEO Settings"}
                </Button>

                {isEditing && (
                    <div className="grid gap-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-2">
                            <Label htmlFor="seo-title">Page Title</Label>
                            <Input
                                id="seo-title"
                                value={data.seo.title}
                                onChange={(e) => updateSEO("title", e.target.value)}
                                placeholder={data.name}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seo-desc">Meta Description</Label>
                            <Input
                                id="seo-desc"
                                value={data.seo.description}
                                onChange={(e) => updateSEO("description", e.target.value)}
                                placeholder="Summarize your product..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seo-slug">URL Handle</Label>
                            <Input
                                id="seo-slug"
                                value={data.seo.slug}
                                onChange={(e) => updateSEO("slug", e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
