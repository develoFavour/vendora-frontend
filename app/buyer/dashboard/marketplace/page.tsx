"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    SlidersHorizontal,
    LayoutGrid,
    List,
    X,
    ChevronRight,
    Sparkles,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/marketplace/product-card";
import { cn } from "@/lib/utils";

// Categories for filtering
const CATEGORIES = [
    "All Collections",
    "Artisan Ceramics",
    "Handwoven Textiles",
    "Modern Furniture",
    "Luxury Decor",
    "Sustainable Living"
];

const PRODUCTS = [
    {
        id: "1",
        name: "Ethereal Ceramic Vase",
        vendor: "Luna Artisan Studio",
        price: 245,
        image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop",
        featured: true,
        rating: 4.9
    },
    {
        id: "2",
        name: "Minimalist Oak Chair",
        vendor: "Nordic Craft",
        price: 890,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e277?q=80&w=800&auto=format&fit=crop",
        featured: false,
        rating: 4.8
    },
    {
        id: "3",
        name: "Raw Silk Throw",
        vendor: "Silk & Stone",
        price: 120,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
        featured: true,
        rating: 4.7
    },
    {
        id: "4",
        name: "Hand-poured Soy Candle",
        vendor: "Aura Home",
        price: 45,
        image: "https://images.unsplash.com/photo-1603006375271-7f3b9044402f?q=80&w=800&auto=format&fit=crop",
        featured: false,
        rating: 5.0
    },
    {
        id: "5",
        name: "Abstract Bronze Sculpture",
        vendor: "Vanguard Arts",
        price: 1200,
        image: "https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=800&auto=format&fit=crop",
        featured: true,
        rating: 4.9
    },
    {
        id: "6",
        name: "Textured Wall Tapestry",
        vendor: "Woven Dreams",
        price: 340,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
        featured: false,
        rating: 4.6
    }
];

// ... (imports remain)
import { usePublicProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState("All Collections"); // In a real app, this would be an ID
    const [isGridView, setIsGridView] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);

    // Fetch real data
    const { data, isLoading } = usePublicProducts(page, 12, searchQuery, selectedCategory === "All Collections" ? "" : selectedCategory);

    const products = data?.data.products || [];

    return (
        <div className="min-h-screen bg-transparent p-6 md:p-10 max-w-[1800px] mx-auto space-y-16">
            {/* ... (Hero Section remains the same) ... */}
            <section className="relative overflow-hidden rounded-[4rem] bg-zinc-950 p-16 md:p-24 text-white shadow-2xl shadow-black/50 overflow-hidden">
                {/* Complex Background Layers */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <div className="absolute -right-20 -top-20 h-full w-[600px] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
                <div className="absolute -left-20 -bottom-20 h-full w-[600px] rounded-full bg-accent/10 blur-[150px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/40 to-transparent" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 max-w-3xl"
                >
                    <Badge className="mb-10 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-2 px-8 text-[10px] font-bold uppercase tracking-[0.4em]">
                        <Sparkles className="mr-3 h-4 w-4 text-amber-400" />
                        The Collector&apos;s Circle
                    </Badge>
                    <h1 className="text-6xl md:text-9xl tracking-tighter leading-[0.85] text-white">
                        The Art of <br />
                        <span className="italic text-primary">Mastery.</span>
                    </h1>
                    <p className="mt-12 text-xl md:text-2xl text-zinc-300 max-w-xl leading-relaxed font-medium italic">
                        &ldquo;Beyond the reach of the ordinary. A curated gateway to the world&apos;s most exceptional artisan treasures.&rdquo;
                    </p>

                    <div className="mt-16 flex flex-wrap gap-8">
                        <Button size="lg" className="h-18 px-14 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 border-none">
                            Start Collecting
                        </Button>
                        <Button size="lg" variant="outline" className="h-18 px-14 rounded-full text-xl font-bold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white hover:text-black hover:border-white transition-all text-zinc-200">
                            Artisan Stories
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Curated Control Bar */}
            <div className="sticky top-10 z-50 flex flex-col gap-8 md:flex-row md:items-center md:justify-between px-2">
                <div className="flex flex-1 items-center gap-6">
                    <div className="relative group w-full max-w-xl">
                        <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Discover your next masterpiece..."
                            className="h-20 rounded-[2.5rem] border-white/10 bg-zinc-900/40 pl-16 pr-8 backdrop-blur-3xl focus:ring-8 focus:ring-primary/5 focus:border-primary/40 focus:bg-zinc-900/60 transition-all text-xl text-white placeholder:text-zinc-400 shadow-2xl shadow-black/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Button
                        variant="outline"
                        className="h-20 rounded-[2.5rem] border-white/10 bg-zinc-900/40 px-10 backdrop-blur-3xl shadow-2xl shadow-black/20 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                        onClick={() => setShowFilters(true)}
                    >
                        <Filter className="mr-4 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-bold uppercase tracking-[0.3em] text-[10px] text-white">Refine Search</span>
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex rounded-full bg-zinc-900/40 p-2 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/20">
                        {[
                            { icon: LayoutGrid, val: true },
                            { icon: List, val: false }
                        ].map((view, i) => (
                            <Button
                                key={i}
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-full h-12 w-12 transition-all duration-500",
                                    isGridView === view.val ? "bg-primary text-white shadow-xl" : "text-zinc-400 hover:text-white"
                                )}
                                onClick={() => setIsGridView(view.val)}
                            >
                                <view.icon className="h-5 w-5" />
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Collection Feed */}
            <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
                {CATEGORIES.map((cat, idx) => (
                    <motion.button
                        key={cat}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            "flex-none rounded-2xl px-12 py-6 text-[10px] font-bold tracking-[0.3em] uppercase transition-all whitespace-nowrap border",
                            selectedCategory === cat
                                ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20 scale-105"
                                : "bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-white/20 hover:text-white backdrop-blur-xl"
                        )}
                    >
                        {cat}
                    </motion.button>
                ))}
            </div>

            {/* Main High-End Grid */}
            <div className={cn(
                "grid gap-x-12 gap-y-24 px-2",
                isGridView
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 max-w-5xl mx-auto"
            )}>
                <AnimatePresence mode="popLayout">
                    {isLoading ? (
                        // Obsidian Skeleton Loading
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-[400px] w-full rounded-2xl bg-zinc-900/50" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4 bg-zinc-900/50" />
                                    <Skeleton className="h-4 w-1/2 bg-zinc-900/50" />
                                </div>
                            </div>
                        ))
                    ) : (
                        products.map((product: any, idx: number) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 1, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* We map our backend Product to the ProductCard props */}
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    vendor={product.vendorName || "Obsidian Vendor"}
                                    price={product.price}
                                    image={product.images?.[0] || ""}
                                    featured={false}
                                    rating={product.rating || 5.0}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {!isLoading && products.length === 0 && (
                <div className="py-40 text-center animate-in fade-in duration-1000">
                    <div className="w-24 h-24 rounded-full bg-zinc-900 mx-auto mb-10 flex items-center justify-center border border-white/5">
                        <Search className="h-10 w-10 text-zinc-500" />
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-4">No treasures found.</h2>
                    <p className="text-zinc-400 font-medium italic">Adjust your refinement to discover other masterpieces.</p>
                </div>
            )}

            {/* Pagination (Simple Next/Prev for now) */}
            <div className="pt-24 pb-40 flex justify-center gap-4">
                <Button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    variant="outline"
                    className="rounded-full px-8"
                >
                    Previous
                </Button>
                <Button
                    disabled={products.length < 12} // Simple check
                    onClick={() => setPage(p => p + 1)}
                    variant="outline"
                    className="rounded-full px-8"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
