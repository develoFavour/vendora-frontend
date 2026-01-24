"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Package,
	Heart,
	ShoppingBag,
	TrendingUp,
	Loader2,
	ChevronRight,
	ArrowUpRight,
	Search
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useBuyerOverview, useOrders } from "@/hooks/use-orders";
import { usePublicProducts } from "@/hooks/use-products";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CustomerDashboardPage() {
	const { user } = useAuthStore();
	const { data: overviewRes, isLoading: isOverviewLoading } = useBuyerOverview();
	const { data: ordersRes, isLoading: isOrdersLoading } = useOrders();
	const { data: productsRes, isLoading: isProductsLoading } = usePublicProducts(1, 4, "", "");
	const { data: wishlistRes, isLoading: isWishlistLoading } = useWishlist();

	const stats = overviewRes?.data?.stats;
	const recentOrders = ordersRes?.data?.orders?.slice(0, 3) || [];
	const curatedProducts = productsRes?.data?.products || [];
	const wishlistItems = wishlistRes?.data?.wishlist?.items?.slice(0, 3) || [];
	const firstName = user?.name ? user.name.split(" ")[0] : "Collector";

	if (isOverviewLoading || isOrdersLoading || isProductsLoading || isWishlistLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-primary bg-zinc-950">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-10 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
			{/* Header with Luxury Typography */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-2">
					<Badge className="bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
						Acquirer Intelligence
					</Badge>
					<h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
						Welcome <span className="italic text-primary font-serif">Back,</span> <br className="md:hidden" /> {firstName}.
					</h1>
					<p className="text-zinc-500 font-medium italic text-lg max-w-xl">
						&ldquo;Your collection is evolving. Explore the latest artisan mastery discovered in the vault today.&rdquo;
					</p>
				</div>
				<div className="flex gap-4">
					<Button variant="outline" className="h-16 px-8 rounded-2xl border-white/5 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" asChild>
						<Link href="/buyer/dashboard/marketplace">
							<Search className="mr-2 h-4 w-4" />
							Discover Artifacts
						</Link>
					</Button>
					<Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl shadow-primary/20 transition-all border-none uppercase tracking-widest text-[10px]" asChild>
						<Link href="/buyer/dashboard/marketplace">Explore Collection</Link>
					</Button>
				</div>
			</div>

			{/* Sophisticated Stats Grid */}
			<div className="grid gap-6 md:grid-cols-4">
				{[
					{ label: "Total Acquisitions", value: stats?.totalAcquisitions || 0, icon: Package, color: "text-blue-400", bg: "bg-blue-500/10" },
					{ label: "Vaulted Artifacts", value: stats?.activeWishlistCount || 0, icon: Heart, color: "text-rose-400", bg: "bg-rose-500/10" },
					{ label: "Transit Pipeline", value: recentOrders.filter((o: any) => o.status === "shipped").length, icon: ShoppingBag, color: "text-amber-400", bg: "bg-amber-500/10" },
					{ label: "Collection Value", value: `$${Math.round(stats?.totalSpent || 0).toLocaleString()}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
				].map((stat, i) => (
					<Card key={i} className="group overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8 hover:border-white/10 transition-all duration-500 relative">
						<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
						<div className="space-y-4 text-left relative z-10">
							<div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
								<stat.icon className={`h-6 w-6 ${stat.color}`} />
							</div>
							<div>
								<div className="text-4xl font-bold text-white tracking-tighter mb-1">{stat.value}</div>
								<div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{stat.label}</div>
							</div>
						</div>
					</Card>
				))}
			</div>

			<div className="grid gap-8 lg:grid-cols-12">
				{/* Recent Collection Activity */}
				<Card className="lg:col-span-8 overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2.5rem]">
					<div className="mb-10 flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-white tracking-tight italic font-serif">Recent Acquisitions</h2>
							<p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest text-[10px] font-bold">Chronicle of your latest treasure retrievals</p>
						</div>
						<Button variant="ghost" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-primary rounded-xl" asChild>
							<Link href="/buyer/dashboard/orders">View All Ledger</Link>
						</Button>
					</div>

					<div className="space-y-4">
						{recentOrders.length === 0 ? (
							<div className="py-12 text-center text-zinc-500 italic font-serif opacity-50 border-2 border-dashed border-white/5 rounded-3xl">
								Your acquisition history is currently empty...
							</div>
						) : (
							recentOrders.map((order: any, i: number) => (
								<div key={i} className="group flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
									<div className="flex items-center gap-6">
										<div className="h-16 w-16 rounded-2xl bg-zinc-800 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
											{order.items?.[0]?.image ? (
												<img src={order.items[0].image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
											) : (
												<Package className="h-6 w-6 text-zinc-700" />
											)}
											<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
										</div>
										<div className="text-left">
											<div className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{order.orderNumber}</div>
											<div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</div>
										</div>
									</div>
									<div className="text-right flex items-center gap-8">
										<div>
											<div className="text-xl font-bold text-white tracking-tight">${order.total?.toLocaleString()}</div>
											<Badge className={cn(
												"mt-1 text-[8px] h-5 px-3 font-bold uppercase border-none rounded-full",
												order.status === "paid" ? "bg-blue-500/10 text-blue-400" :
													order.status === "shipped" ? "bg-amber-500/10 text-amber-400" :
														order.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" :
															"bg-zinc-800 text-zinc-500"
											)}>
												{order.status}
											</Badge>
										</div>
										<Button size="icon" variant="ghost" className="rounded-full h-10 w-10 bg-white/5 border border-white/5 opacity-0 group-hover:opacity-100 transition-all" asChild>
											<Link href={`/buyer/dashboard/orders/${order.id}`}>
												<ChevronRight className="h-4 w-4 text-white" />
											</Link>
										</Button>
									</div>
								</div>
							))
						)}
					</div>
				</Card>

				{/* Quick Wishlist Access */}
				<Card className="lg:col-span-4 overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8 rounded-[2.5rem]">
					<div className="mb-10">
						<h2 className="text-2xl font-bold text-white tracking-tight italic font-serif">Vault Preview</h2>
						<p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Artifacts awaiting acquisition</p>
					</div>

					<div className="grid gap-4">
						{wishlistItems.length === 0 ? (
							<div className="py-8 text-center text-zinc-600 text-xs italic font-serif">Your vault is empty...</div>
						) : (
							wishlistItems.map((item: any, i: number) => (
								<div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]">
									<div className="flex items-center gap-4">
										<div className="h-16 w-16 rounded-xl bg-zinc-800 flex-shrink-0 relative overflow-hidden">
											{item.productImage && <img src={item.productImage} className="w-full h-full object-cover" />}
										</div>
										<div className="flex-1 text-left">
											<div className="text-sm font-bold text-white truncate">{item.productName}</div>
											<div className="text-xs font-bold text-primary mt-1">${item.price?.toLocaleString()}</div>
										</div>
										<Button size="icon" variant="ghost" className="rounded-full text-zinc-700 hover:text-primary transition-colors" asChild>
											<Link href={`/buyer/dashboard/marketplace/${item.productId}`}>
												<ArrowUpRight className="h-4 w-4" />
											</Link>
										</Button>
									</div>
								</div>
							))
						)}
						<Button variant="outline" className="w-full mt-4 h-14 rounded-2xl border-white/10 bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all" asChild>
							<Link href="/buyer/dashboard/wishlist">Access Complete Vault</Link>
						</Button>
					</div>
				</Card>
			</div>

			{/* Recommended Artisanry */}
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-3xl font-bold text-white tracking-tight italic font-serif">Curated Collections</h2>
						<p className="text-zinc-500 font-medium italic mt-1">Hand-selected artifacts based on your unique acquirer profile</p>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{curatedProducts.map((item: any, i: number) => (
						<Card key={i} className="group overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500 rounded-[2rem]">
							<Link href={`/buyer/dashboard/marketplace/${item.id}`}>
								<div className="aspect-square rounded-2xl bg-zinc-800 mb-5 relative overflow-hidden">
									{item.images && item.images[0] && (
										<img src={item.images[0]} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000" />
									)}
									<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-zinc-950/80 to-transparent" />
									<div className="absolute top-3 right-3">
										<div className="h-8 w-8 rounded-full bg-zinc-950/50 backdrop-blur-md border border-white/10 flex items-center justify-center">
											<Heart className="h-3 w-3 text-white/40 group-hover:text-primary transition-colors" />
										</div>
									</div>
								</div>
								<div className="text-left space-y-1">
									<div className="text-sm font-bold text-white group-hover:text-primary transition-colors tracking-tight line-clamp-1">{item.name}</div>
									<div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mastery Discovery</div>
									<div className="flex items-center justify-between pt-3">
										<div className="text-lg font-bold text-white tracking-tighter">${item.price?.toLocaleString()}</div>
										<div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
											<ChevronRight className="h-4 w-4" />
										</div>
									</div>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
