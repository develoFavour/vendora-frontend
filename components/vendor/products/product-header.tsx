"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { useRouter } from "next/navigation";
import { useProductActions } from "@/hooks/use-product-actions";

interface ProductHeaderProps {
    id?: string;
}

export function ProductHeader({ id }: ProductHeaderProps) {
    const router = useRouter();
    const { data } = useProductStore();
    const { handlePublish, isPublishing } = useProductActions(id);

    return (
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => router.back()} disabled={isPublishing}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
            <div className="flex-1">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-serif">
                    {id ? (data.name || "Edit Product") : (data.name || "Create Product")}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {id ? "Update your product details and inventory." : "Add a new product to your store inventory."}
                </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
                <Button variant="outline" disabled={isPublishing} onClick={() => router.back()}>Discard</Button>
                {/* <Button variant="secondary" disabled={isPublishing}>Save Draft</Button> */}
                <Button onClick={handlePublish} disabled={isPublishing}>
                    {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPublishing ? "Saving..." : id ? "Save Changes" : "Publish Product"}
                </Button>
            </div>
        </div>
    );
}
