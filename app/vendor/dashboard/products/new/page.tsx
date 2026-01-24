"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
// Remove context import as it's no longer needed
// import { ProductFormProvider } from "@/components/vendor/products/product-form-context";
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
import { Loader2 } from "lucide-react";

export default function CreateProductPage() {
    // Optional: Reset store on unmount or on mount to ensure clean state
    const { reset } = useProductStore();
    const { handlePublish, isPublishing } = useProductActions();

    React.useEffect(() => {
        // Reset on mount to ensure fresh form
        reset();
    }, [reset]);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 pb-20">
            <div className="flex flex-col gap-4 p-4 md:p-8 max-w-7xl mx-auto w-full">

                <ProductHeader />

                <div className="grid gap-6 lg:grid-cols-3 pt-4">
                    {/* ... main content ... */}
                    <div className="grid gap-6 auto-rows-max lg:col-span-2">
                        <ProductDetails />
                        <ProductMedia />
                        {/* ... tabs ... */}
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

                    {/* Sidebar */}
                    <div className="grid gap-6 auto-rows-max lg:col-span-1">
                        <ProductOrganization />
                        <ProductShipping />
                        <ProductSEO />
                    </div>
                </div>

                {/* Mobile Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 md:hidden flex gap-2 z-50">
                    <Button variant="outline" className="flex-1" disabled={isPublishing}>Discard</Button>
                    <Button className="flex-1" onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Publish"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
