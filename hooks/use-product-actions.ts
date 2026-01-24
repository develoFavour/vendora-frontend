"use client";

import { useState } from "react";
import { useProductStore } from "@/stores/product-store";
import { productAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useProductActions(productId?: string) {
    const router = useRouter();
    const { data, reset } = useProductStore();
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        if (!data.name) {
            toast.error("Product name is required");
            return;
        }

        setIsPublishing(true);
        try {
            // Transform data to match Backend types (Strings -> Numbers)
            const payload: any = {
                ...data,
                price: parseFloat(data.price) || 0,
                salePrice: parseFloat(data.salePrice) || 0,
                costPrice: parseFloat(data.costPrice) || 0,
                taxRate: parseFloat(data.taxRate) || 0,
                stock: parseInt(data.stock) || 0,
                lowStockThreshold: parseInt(data.lowStockThreshold) || 0,
            };

            // Clean up ObjectIDs: Go's primitive.ObjectID doesn't like empty strings
            if (!payload.categoryId || payload.categoryId.length !== 24) {
                delete payload.categoryId;
            }

            // Clean up variants
            if (data.hasVariants) {
                payload.variants = data.variants.map((v: any) => ({
                    ...v,
                    price: parseFloat(v.price) || 0,
                    stock: parseInt(v.stock) || 0,
                }));
            } else {
                payload.variants = [];
                payload.variantOptions = [];
            }

            console.log(productId ? "Updating" : "Publishing", "Product Payload:", JSON.stringify(payload, null, 2));

            const response = productId
                ? await productAPI.update(productId, payload)
                : await productAPI.create(payload);

            if (response.success) {
                toast.success(productId ? "Product updated successfully!" : "Product published successfully!");
                reset(); // Clear form
                router.push("/vendor/dashboard/products");
            }
        } catch (error: any) {
            console.error("Save error:", error);
            const message = error.message || "Failed to save product";
            toast.error(message);
        } finally {
            setIsPublishing(false);
        }
    };

    return {
        handlePublish,
        isPublishing,
    };
}
