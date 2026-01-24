"use client";

import { use, useEffect, useState } from "react";
import { productAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChevronLeft,
    Edit,
    Trash2,
    Package,
    Tag,
    Truck,
    BarChart,
    Globe,
    AlertCircle,
    Eye,
    TrendingUp,
    DollarSign,
    Box,
    Share2,
    MoreHorizontal,
    Scale,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    salePrice: number;
    costPrice: number;
    stock: number;
    lowStockThreshold: number;
    sku: string;
    barcode: string;
    images: string[];
    status: "draft" | "active" | "archived";
    categoryId: string;
    tags: string[];
    dimensions: {
        length: number;
        width: number;
        height: number;
        weight: number;
    };
    taxRate: number;
    totalSales: number;
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    isDigital: boolean;
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productAPI.get(productId);
                if (response.success) {
                    setProduct(response.data.product);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load product details");
                router.push("/vendor/dashboard/products");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [productId, router]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        try {
            const response = await productAPI.delete(productId);
            if (response.success) {
                toast.success("Product deleted successfully");
                router.push("/vendor/dashboard/products");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product");
        }
    };

    if (isLoading) {
        return <ProductLoadingSkeleton />;
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold">Product Not Found</h2>
                <p className="mt-2 text-muted-foreground">The product you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button asChild className="mt-6">
                    <Link href="/vendor/dashboard/products">Back to Products</Link>
                </Button>
            </div>
        );
    }

    const stockPercentage = Math.min((product.stock / (product.lowStockThreshold * 2 || 100)) * 100, 100);
    const isLowStock = product.stock <= product.lowStockThreshold;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen space-y-8 p-8"
        >
            {/* Top Bar Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" asChild className="-ml-2">
                        <Link href="/vendor/dashboard/products">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Inventory
                        </Link>
                    </Button>
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    <span className="text-sm font-medium text-muted-foreground truncate max-w-[200px]">
                        {product.name}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/vendor/dashboard/products/${productId}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete} className="shadow-lg shadow-destructive/20">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Hero Section with Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/50 p-6 rounded-3xl border border-border/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-3 w-3 rounded-full animate-pulse",
                        product.status === "active" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" :
                            product.status === "draft" ? "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]" :
                                "bg-slate-500"
                    )} />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Product Status</span>
                        <span className={cn(
                            "text-lg font-bold capitalize",
                            product.status === "active" ? "text-emerald-500" :
                                product.status === "draft" ? "text-amber-500" : "text-slate-500"
                        )}>
                            {product.status}
                        </span>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Created On</span>
                        <span className="font-semibold">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Last Updated</span>
                        <span className="font-semibold">{new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Main Product Section */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Images Column */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="overflow-hidden border-0 bg-transparent shadow-none group relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square rounded-2xl bg-muted overflow-hidden border border-border/50 shadow-2xl shadow-primary/5"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    src={product.images[activeImage] || "/placeholder-product.png"}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </AnimatePresence>
                        </motion.div>

                        <div className="absolute top-4 right-4 z-10">
                            <Badge className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-300",
                                product.status === "active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-xl shadow-emerald-500/10" :
                                    product.status === "draft" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-xl shadow-amber-500/10" :
                                        "bg-slate-500/10 text-slate-500 border-slate-500/20"
                            )}>
                                {product.status}
                            </Badge>
                        </div>
                    </Card>

                    {product.images.length > 1 && (
                        <div className="flex flex-wrap gap-3 p-1">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={cn(
                                        "h-16 w-16 rounded-lg border-2 overflow-hidden transition-all duration-300 transform",
                                        activeImage === idx ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                                    )}
                                >
                                    <img src={img} alt="" className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-2">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-medium tracking-wider text-primary uppercase"
                        >
                            {product.brand || "Vendor Brand"}
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-serif text-4xl font-bold leading-tight"
                        >
                            {product.name}
                        </motion.h1>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-foreground">
                                    ${product.salePrice > 0 ? product.salePrice.toLocaleString() : product.price.toLocaleString()}
                                </span>
                                {product.salePrice > 0 && product.salePrice < product.price && (
                                    <span className="text-sm text-muted-foreground line-through decoration-destructive/50 font-medium">
                                        ${product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {product.salePrice > 0 && product.salePrice < product.price && (
                                <Badge variant="destructive" className="animate-pulse">
                                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={<TrendingUp className="h-4 w-4" />}
                            label="Total Sales"
                            value={product.totalSales.toLocaleString()}
                            subValue="Lifetime Units"
                        />
                        <StatCard
                            icon={<DollarSign className="h-4 w-4" />}
                            label="Est. Revenue"
                            value={`$${(product.totalSales * (product.salePrice || product.price)).toLocaleString()}`}
                            subValue="Based on Volume"
                        />
                        <StatCard
                            icon={<Box className="h-4 w-4" />}
                            label="Stock Value"
                            value={`$${(product.stock * (product.salePrice || product.price)).toLocaleString()}`}
                            subValue={`@ $${(product.salePrice || product.price).toLocaleString()} each`}
                        />
                        <StatCard
                            icon={<BarChart className="h-4 w-4" />}
                            label="Groos Margin"
                            value={product.costPrice ? `${Math.round(((product.price - product.costPrice) / product.price) * 100)}%` : "0%"}
                            subValue="Est. Profitability"
                        />
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-xl overflow-hidden relative group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Package className="h-32 w-32" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                                    <Scale className="h-4 w-4" />
                                    Inventory Status
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-bold font-serif">{product.stock}</h3>
                                    <span className="text-sm text-muted-foreground">Units in Stock</span>
                                </div>
                                <div className="space-y-2">
                                    <Progress
                                        value={stockPercentage}
                                        className={cn(
                                            "h-2",
                                            isLowStock ? "bg-destructive/10" : "bg-primary/10"
                                        )}
                                    />
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className={isLowStock ? "text-destructive" : "text-muted-foreground"}>
                                            {isLowStock ? "Critical Level" : "Healthy Stock"}
                                        </span>
                                        <span className="text-muted-foreground">Goal: {product.lowStockThreshold * 2 || 100}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[140px]">
                                {isLowStock && (
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 mb-2">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <span className="text-xs font-bold leading-none">Restock Required</span>
                                    </div>
                                )}
                                <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">SKU Number</p>
                                    <code className="text-sm font-mono font-bold">{product.sku || "NO-SKU-SET"}</code>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Information Tabs */}
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6 gap-8">
                            <TabsTrigger
                                value="overview"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm transition-all"
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm transition-all"
                            >
                                Specifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="shipping"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-sm transition-all"
                            >
                                Shipping & SEO
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 outline-none">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <h4 className="text-lg font-semibold mb-2">Description</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                    {product.description || "No description provided for this product."}
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="text-lg font-semibold">Categories & Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="capitalize bg-primary/5">
                                        <Tag className="mr-1 h-3 w-3" />
                                        Category ID: {product.categoryId}
                                    </Badge>
                                    {product.tags?.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="capitalize">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="outline-none">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <DetailItem label="Brand" value={product.brand || "N/A"} />
                                <DetailItem label="Barcode" value={product.barcode || "N/A"} />
                                <DetailItem label="Low Stock Alert" value={`${product.lowStockThreshold} units`} />
                                <DetailItem label="Tax Rate" value={`${product.taxRate || 0}%`} />
                                <DetailItem label="Estimated Cost" value={product.costPrice ? `$${product.costPrice.toLocaleString()}` : "Not Set"} />
                                <DetailItem label="Is Digital" value={product.isDigital ? "Yes" : "No"} />
                            </div>
                        </TabsContent>

                        <TabsContent value="shipping" className="space-y-8 outline-none">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-lg font-semibold">
                                        <Truck className="h-5 w-5 text-primary" />
                                        Physical Dimensions
                                    </h4>
                                    <div className="space-y-3 rounded-2xl border bg-muted/30 p-5">
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-muted-foreground">Dimensions</span>
                                            <span className="font-mono">{product.dimensions?.length || 0} x {product.dimensions?.width || 0} x {product.dimensions?.height || 0} cm</span>
                                        </div>
                                        <Separator className="bg-border/50" />
                                        <div className="flex justify-between items-center text-sm font-medium">
                                            <span className="text-muted-foreground">Weight</span>
                                            <span className="font-mono">{product.dimensions?.weight || 0} kg</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-lg font-semibold">
                                        <Globe className="h-5 w-5 text-primary" />
                                        Search Engine Metadata
                                    </h4>
                                    <div className="space-y-3 rounded-2xl border bg-muted/30 p-5">
                                        <div className="text-sm font-mono text-primary truncate">
                                            vendora.com/p/{product.id}
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                                            SEO title and description are auto-generated from product details for optimal search performance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
    return (
        <Card className="p-4 border-border/50 bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-primary/20">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                {icon}
                {label}
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-xl font-bold tracking-tight">{value}</span>
                <span className="text-[10px] font-medium text-primary/60">{subValue}</span>
            </div>
        </Card>
    );
}

function DetailItem({ label, value, colSpan = 1 }: { label: string, value: string, colSpan?: number }) {
    return (
        <div className={cn("space-y-1", colSpan === 2 && "sm:col-span-2")}>
            <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    );
}

function ProductLoadingSkeleton() {
    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48 rounded-xl bg-gray-200" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-xl bg-gray-200" />
                    <Skeleton className="h-10 w-24 rounded-xl bg-gray-200" />
                </div>
            </div>

            <Skeleton className="h-24 w-full rounded-3xl bg-gray-200" />

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl bg-gray-200" />
                    <div className="flex gap-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-16 rounded-xl bg-gray-200" />)}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-32 rounded-lg bg-gray-200" />
                        <Skeleton className="h-12 w-3/4 rounded-xl bg-gray-200" />
                        <Skeleton className="h-8 w-40 rounded-lg mt-4 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-8">
                        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl bg-gray-200" />)}
                    </div>

                    <Skeleton className="h-40 w-full rounded-2xl bg-gray-200" />

                    <div className="space-y-4">
                        <div className="flex gap-8 border-b border-border/50 pb-3">
                            <Skeleton className="h-4 w-20 rounded-md bg-gray-200" />
                            <Skeleton className="h-4 w-20 rounded-md bg-gray-200" />
                            <Skeleton className="h-4 w-20 rounded-md bg-gray-200" />
                        </div>
                        <Skeleton className="h-32 w-full rounded-xl bg-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}
