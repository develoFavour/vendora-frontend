"use client";

import { use } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePublicVendorById } from "@/hooks/use-public-vendors";
import {
    MapPin,
    Star,
    CheckCircle2,
    ShoppingBag,
    Users,
    Calendar,
    ArrowLeft,
    Loader2,
    ShieldCheck,
    Truck,
    Clock,
    Heart
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/marketplace/product-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: vendorRes, isLoading, isError } = usePublicVendorById(id);

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-zinc-950 text-white">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-[0.3em] animate-pulse">Entering the Atelier...</p>
            </div>
        );
    }

    if (isError || !vendorRes?.data) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
                <h2 className="text-3xl font-serif italic mb-6">The Artisan is currently unavailable</h2>
                <Button asChild variant="outline" className="rounded-full border-white/20 hover:bg-white/10">
                    <Link href="/vendors">Back to Directory</Link>
                </Button>
            </div>
        );
    }

    const vendor = vendorRes.data;
    const app = vendor.sellerApplication || {};
    const account = vendor.vendorAccount || {};
    const profile = vendor.profile || {};
    const products = vendor.featuredProducts || [];

    const storeName = app.storeName || vendor.name;
    const trustScore = account.trustScore ? (account.trustScore / 20).toFixed(1) : "4.9";

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50/50">
            <Navigation />

            {/* Cinematic Hero */}
            <section className="relative h-[450px] w-full overflow-hidden bg-zinc-950 text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Abstract Visual Elements */}
                <div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px]" />
                <div className="absolute -left-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[150px]" />

                <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-16">
                    <Link href="/vendors" className="mb-12 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Directory
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Boutique Logo */}
                            <div className="relative group">
                                <div className="h-40 w-40 overflow-hidden rounded-3xl border-4 border-white/10 bg-zinc-900 shadow-2xl backdrop-blur-3xl transition-transform duration-700 group-hover:scale-105">
                                    <img
                                        src={profile.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${storeName}`}
                                        alt={storeName}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                {vendor.vendorStatus === "approved" && (
                                    <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 shadow-2xl ring-4 ring-zinc-950">
                                        <CheckCircle2 className="h-6 w-6 text-zinc-950" />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-primary/20 text-primary border-primary/20 backdrop-blur-md px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold">
                                        {app.categories?.[0] || "Master Artisan"}
                                    </Badge>
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 border-l border-white/10 pl-3">
                                        <Calendar className="h-3 w-3" />
                                        Since {new Date(vendor.createdAt).getFullYear()}
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter">
                                    {storeName}
                                </h1>
                                <div className="flex items-center gap-6 text-zinc-400">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {profile.location || "Earth Base"}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                        <span className="text-white font-bold">{trustScore}</span> Trust Score
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* Quick Stats Bar */}
            <div className="bg-white border-b border-zinc-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 py-8 gap-8">
                        {[
                            { icon: ShoppingBag, label: "Total Items", value: account.productCount || products.length },
                            { icon: Users, label: "Collectors", value: `${((account.totalOrders || 1) / 1000).toFixed(1)}k` },
                            { icon: ShieldCheck, label: "Authenticity", value: "Guaranteed" },
                            { icon: Truck, label: "Ships From", value: profile.location?.split(',')[0] || "Workshop" }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <stat.icon className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold tracking-tight">{stat.value}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-16">
                <Tabs defaultValue="collection" className="space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-center border-b border-zinc-200 pb-8 gap-6">
                        <TabsList className="bg-zinc-100/50 p-1.5 rounded-2xl border border-zinc-200 h-auto">
                            <TabsTrigger value="collection" className="rounded-xl px-10 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-bold uppercase tracking-widest text-[10px]">
                                Full Collection
                            </TabsTrigger>
                            <TabsTrigger value="about" className="rounded-xl px-10 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-bold uppercase tracking-widest text-[10px]">
                                The Artisan
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="rounded-xl px-10 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg font-bold uppercase tracking-widest text-[10px]">
                                Reviews
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2 text-zinc-500 font-mono text-sm">
                            <Clock className="h-4 w-4" />
                            Recently Restocked
                        </div>
                    </div>

                    <TabsContent value="collection" className="mt-0">
                        {products.length === 0 ? (
                            <div className="text-center py-32 space-y-6">
                                <div className="h-20 w-20 bg-zinc-100 rounded-full mx-auto flex items-center justify-center">
                                    <PackageOpen className="h-10 w-10 text-zinc-300" />
                                </div>
                                <h3 className="text-2xl font-serif italic text-zinc-400">Restocking the shelves...</h3>
                                <p className="text-sm text-zinc-500 max-w-sm mx-auto">This artisan is currently crafting new pieces. Check back soon for the latest collection.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                {products.map((product: any, i: number) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <ProductCard
                                            id={product.id}
                                            name={product.name}
                                            price={product.price}
                                            vendor={storeName}
                                            image={product.images?.[0]}
                                            inStock={product.stock > 0}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="about" className="mt-0">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-serif italic tracking-tighter">Beyond the Product.</h2>
                                    <p className="text-lg text-zinc-600 leading-relaxed font-medium">
                                        {app.storeDescription || "At our workshop, we believe that objects carry the energy of their makers. Every piece you find here is a culmination of years of practice, a respect for raw materials, and a commitment to timeless aesthetics."}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm">
                                        <div className="font-bold text-lg mb-1">Sustainable</div>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">Responsibly sourced materials with a zero-waste philosophy.</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm">
                                        <div className="font-bold text-lg mb-1">Handmade</div>
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">No mass production. True craftsmanship in every detail.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                                    <img
                                        src={profile.profileImage || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"}
                                        alt="Master Artisan"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-4 bg-white rounded-[3rem] border border-zinc-200">
                            <div className="flex -space-x-4 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-zinc-100" />
                                ))}
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Voices of the Collective</h3>
                            <p className="text-sm text-zinc-500 max-w-sm">Collectors are still receiving the latest commissions. Be the first to share your experience.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            <Footer />
        </div>
    );
}

// Minimal stub for missing PackageOpen icon
function PackageOpen(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="m2 17 10 5 10-5" />
            <path d="m2 12 10 5 10-5" />
        </svg>
    )
}
