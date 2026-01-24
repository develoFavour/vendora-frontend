"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProductHeader } from "@/components/vendor/products/product-header";
import { ProductDetails } from "@/components/vendor/products/product-details";
import { ProductMedia } from "@/components/vendor/products/product-media";
import { ProductPricing } from "@/components/vendor/products/product-pricing";
import { ProductInventory } from "@/components/vendor/products/product-inventory";
import { ProductVariants } from "@/components/vendor/products/product-variants";
import { ProductOrganization } from "@/components/vendor/products/product-organization";
import { ProductShipping } from "@/components/vendor/products/product-shipping";
import { ProductSEO } from "@/components/vendor/products/product-seo";
import { useProductStore } from "@/stores/product-store";
import { useProductActions } from "@/hooks/use-product-actions";
import { Loader2, PackageSearch } from "lucide-react";
import { productAPI } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;
    const { setData, reset } = useProductStore();
    const { handlePublish, isPublishing } = useProductActions(productId);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const response = await productAPI.get(productId);
                if (response.success) {
                    const product = response.data.product;
                    // Map backend data back to frontend store format
                    setData({
                        ...product,
                        price: product.price?.toString() || "",
                        salePrice: product.salePrice?.toString() || "",
                        costPrice: product.costPrice?.toString() || "",
                        taxRate: product.taxRate?.toString() || "",
                        stock: product.stock?.toString() || "",
                        lowStockThreshold: product.lowStockThreshold?.toString() || "5",
                        variants: (product.variants || []).map((v: any) => ({
                            ...v,
                            price: v.price?.toString() || "",
                            stock: v.stock?.toString() || "",
                        }))
                    });
                } else {
                    setError("Product not found");
                }
            } catch (err: any) {
                console.error("Fetch product error:", err);
                setError(err.message || "Failed to load product");
                toast.error("Failed to load product details");
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }

        return () => reset(); // Clean up on unmount
    }, [productId, setData, reset]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/40">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-muted/40">
                <div className="flex flex-col items-center gap-4 text-center p-8">
                    <PackageSearch className="h-12 w-12 text-muted-foreground opacity-20" />
                    <h2 className="text-xl font-bold font-serif italic">Oops! Product not found</h2>
                    <p className="text-muted-foreground max-w-xs">{error}</p>
                    <Button onClick={() => router.push("/vendor/dashboard/products")}>
                        Back to Inventory
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 pb-20">
            <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <ProductHeader id={productId} />

                <div className="grid gap-6 lg:grid-cols-3 pt-4">
                    <div className="grid gap-6 auto-rows-max lg:col-span-2">
                        <ProductDetails />
                        <ProductMedia />
                        <Tabs defaultValue="pricing" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pricing">
                                <ProductPricing />
                            </TabsContent>
                            <TabsContent value="inventory">
                                <ProductInventory />
                            </TabsContent>
                        </Tabs>
                        <ProductVariants />
                    </div>

                    <div className="grid gap-6 auto-rows-max lg:col-span-1">
                        <ProductOrganization />
                        <ProductShipping />
                        <ProductSEO />
                    </div>
                </div>

                {/* Mobile Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 md:hidden flex gap-2 z-50">
                    <Button variant="outline" className="flex-1" disabled={isPublishing} onClick={() => router.back()}>Discard</Button>
                    <Button className="flex-1" onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
