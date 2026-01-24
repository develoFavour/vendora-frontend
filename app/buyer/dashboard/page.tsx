"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Heart, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";

export default function CustomerDashboardPage() {
	const { user } = useAuthStore();
	const firstName = user?.name ? user.name.split(" ")[0] : "Collector";

	return (
		<div className="p-10 max-w-[1600px] mx-auto space-y-12">
			{/* Header with Luxury Typography */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
				<div>
					<Badge className="mb-4 bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
						Curated Dashboard
					</Badge>
					<h1 className="text-5xl md:text-6xl tracking-tight text-white mb-4">
						Welcome <span className="italic text-primary">Back,</span> <br className="md:hidden" /> {firstName}.
					</h1>
					<p className="text-zinc-400 font-medium italic text-lg max-w-xl">
						&ldquo;Your collection is waiting. Discover the latest mastery from our global artisan community.&rdquo;
					</p>
				</div>
				<div className="flex gap-4">
					<Button className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all">
						Edit Profile
					</Button>
					<Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 transition-all border-none">
						Continue Shopping
					</Button>
				</div>
			</div>

			{/* Sophisticated Stats Grid */}
			<div className="grid gap-6 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
				{[
					{ label: "Total Orders", value: "12", icon: Package, color: "text-primary", bg: "bg-primary/5" },
					{ label: "In Transit", value: "03", icon: ShoppingBag, color: "text-accent", bg: "bg-accent/5" },
					{ label: "Saved Items", value: "24", icon: Heart, color: "text-primary", bg: "bg-primary/5" },
					{ label: "Collection Value", value: "$1,248", icon: TrendingUp, color: "text-accent", bg: "bg-accent/5" },
				].map((stat, i) => (
					<Card key={i} className="group overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8 hover:border-white/10 transition-all duration-500">
						<div className="flex items-center justify-between">
							<div className="space-y-4 text-left">
								<div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
									<stat.icon className={`h-6 w-6 ${stat.color}`} />
								</div>
								<div>
									<div className="text-4xl font-bold text-white tracking-tighter mb-1">{stat.value}</div>
									<div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{stat.label}</div>
								</div>
							</div>
							<div className="h-16 w-1 bg-gradient-to-b from-transparent via-white/5 to-transparent rounded-full" />
						</div>
					</Card>
				))}
			</div>

			<div className="grid gap-8 lg:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
				{/* Recent Collection Activity */}
				<Card className="lg:col-span-8 overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8">
					<div className="mb-10 flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-white tracking-tight">Recent Acquisitions</h2>
							<p className="text-zinc-500 text-sm mt-1">Track your latest artisan orders</p>
						</div>
						<Button variant="ghost" className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-primary" asChild>
							<Link href="/buyer/dashboard/orders">View Ledger</Link>
						</Button>
					</div>

					<div className="space-y-6">
						{[
							{ id: "ORD-3492", vendor: "Artisan Crafts Co.", date: "Dec 15", total: "$124.00", status: "Delivered", color: "text-emerald-500" },
							{ id: "ORD-3487", vendor: "Handmade Haven", date: "Dec 12", total: "$89.50", status: "Processing", color: "text-primary" },
							{ id: "ORD-3482", vendor: "Local Makers Studio", date: "Dec 08", total: "$156.00", status: "Delivered", color: "text-emerald-500" },
						].map((order, i) => (
							<div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all duration-300">
								<div className="flex items-center gap-6">
									<div className="h-16 w-16 rounded-xl bg-zinc-800 flex-shrink-0 relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
									</div>
									<div className="text-left">
										<div className="text-sm font-bold text-white mb-1">{order.id}</div>
										<div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{order.vendor}</div>
										<div className="mt-1 text-[10px] font-bold text-zinc-600">{order.date}</div>
									</div>
								</div>
								<div className="text-right flex flex-col items-end gap-2">
									<div className="text-lg font-bold text-white">{order.total}</div>
									<Badge variant="outline" className={`h-6 px-3 rounded-full bg-white/5 border-white/10 ${order.color} text-[8px] font-bold uppercase tracking-widest`}>
										{order.status}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Quick Wishlist Access */}
				<Card className="lg:col-span-4 overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8">
					<div className="mb-10 text-left">
						<h2 className="text-2xl font-bold text-white tracking-tight text-left">Vault Preview</h2>
						<p className="text-zinc-500 text-sm mt-1">Items saved for later</p>
					</div>

					<div className="grid gap-4">
						{[
							{ name: "Ceramic Vase", price: "$45.00" },
							{ name: "Woven Basket", price: "$32.00" },
							{ name: "Linen Throw", price: "$68.00" },
						].map((item, i) => (
							<div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:bg-white/[0.05]">
								<div className="flex items-center gap-4">
									<div className="h-16 w-16 rounded-xl bg-zinc-800" />
									<div className="flex-1 text-left">
										<div className="text-sm font-bold text-white">{item.name}</div>
										<div className="text-xs font-bold text-primary mt-1">{item.price}</div>
									</div>
									<Button size="icon" variant="ghost" className="rounded-full text-zinc-500 hover:text-red-500">
										<Heart className="h-4 w-4" />
									</Button>
								</div>
							</div>
						))}
						<Button variant="outline" className="w-full mt-4 h-14 rounded-2xl border-white/10 bg-transparent text-zinc-400 font-bold uppercase tracking-widest text-xs hover:bg-white/5" asChild>
							<Link href="/buyer/dashboard/wishlist">Enter The Vault</Link>
						</Button>
					</div>
				</Card>
			</div>

			{/* Recommended Artisanry */}
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
				<div className="flex items-center justify-between mb-8">
					<div className="text-left">
						<h2 className="text-3xl font-bold text-white tracking-tight">Curated For You</h2>
						<p className="text-zinc-500 font-medium italic">Hand-selected based on your unique aesthetic</p>
					</div>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{ name: "Hand-painted Mug", vendor: "Ceramic Studio", price: "$28.00" },
						{ name: "Wall Hanging", vendor: "Fiber Arts Co.", price: "$42.00" },
						{ name: "Scented Candle", vendor: "Artisan Crafts Co.", price: "$36.00" },
						{ name: "Leather Journal", vendor: "Bookbinding Co.", price: "$54.00" },
					].map((item, i) => (
						<Card key={i} className="group overflow-hidden border-white/5 bg-zinc-900/40 backdrop-blur-xl p-5 hover:border-primary/30 transition-all duration-500">
							<div className="aspect-square rounded-2xl bg-zinc-800 mb-5 relative overflow-hidden">
								<div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
								<Button size="icon" className="absolute top-3 right-3 rounded-full bg-zinc-950/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
									<Heart className="h-4 w-4" />
								</Button>
							</div>
							<div className="text-left space-y-1">
								<div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.name}</div>
								<div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.vendor}</div>
								<div className="flex items-center justify-between pt-3">
									<div className="text-lg font-bold text-white">{item.price}</div>
									<Button size="sm" className="rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-all border-none text-[10px] font-bold uppercase tracking-widest">
										View
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
