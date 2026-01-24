"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/marketplace/product-card";

export default function WishlistPage() {
    const { data: wishlistData, isLoading } = useWishlist();

    const wishlistProducts = wishlistData?.data?.wishlist?.products || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="animate-pulse text-zinc-500 font-bold tracking-widest uppercase text-xs">Curating your collection...</div>
                </div>
            </div>
        );
    }

    if (wishlistProducts.length === 0) {
        return (
            <div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center bg-transparent text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative mb-8"
                >
                    <div className="w-32 h-32 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center relative z-10">
                        <Heart className="h-12 w-12 text-zinc-700" />
                    </div>
                    <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl animate-pulse" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Your gallery is empty</h1>
                <p className="text-zinc-400 max-w-md mb-10 leading-relaxed text-lg italic">
                    &ldquo;A blank canvas waits for the touch of an artisan. Begin your journey by discovering treasures that speak to you.&rdquo;
                </p>

                <Link href="/buyer/dashboard/marketplace">
                    <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 h-16 text-lg font-bold group">
                        Explore Marketplace
                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10 max-w-[1800px] mx-auto space-y-16 bg-transparent">
            {/* Header Section */}
            <header className="relative py-12 px-8 overflow-hidden rounded-[3rem] bg-zinc-950 border border-white/5 shadow-2xl">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

                <div className="relative z-10">
                    <Badge className="mb-6 bg-white/5 text-zinc-400 hover:bg-white/10 backdrop-blur-md border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.4em]">
                        <Heart className="mr-3 h-3 w-3 text-red-500 fill-red-500/20" />
                        Curated Selection
                    </Badge>
                    <h1 className="text-5xl md:text-7xl tracking-tighter leading-tight text-white mb-6">
                        The <span className="italic text-primary">Wishlist.</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed italic">
                        Treasures you&apos;ve discovered and set aside. A personalized gallery of artisan excellence awaiting your final decision.
                    </p>
                </div>
            </header>

            {/* Grid Section */}
            <section>
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="flex items-center gap-4">
                        <div className="h-px w-12 bg-primary/50" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                            {wishlistProducts.length} Exceptional Items
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {wishlistProducts.map((product: any, idx: number) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    vendor={product.vendorName || "Artisan Master"}
                                    price={product.price}
                                    image={product.images?.[0] || ""}
                                    featured={false}
                                    rating={product.rating || 5.0}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Bottom CTA for empty state feel even if not empty */}
            <div className="pt-24 pb-40 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white mb-4">Discover More Mastery</h2>
                <p className="text-zinc-500 mb-8 max-w-md">Our collections are updated daily with new artisan treasures from around the world.</p>
                <Link href="/buyer/dashboard/marketplace">
                    <Button variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white hover:text-black">
                        Back to Marketplace
                    </Button>
                </Link>
            </div>
        </div>
    );
}
