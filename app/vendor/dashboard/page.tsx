"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	DollarSign,
	Package,
	ShoppingBag,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

import {
	useVendorStats,
	useVendorOrders
} from "@/hooks/use-vendor-orders";
import { Loader2 } from "lucide-react";

export default function VendorDashboardPage() {
	const { user } = useAuthStore();
	const { data: statsRes, isLoading: isStatsLoading } = useVendorStats();
	const { data: ordersRes, isLoading: isOrdersLoading } = useVendorOrders();

	const stats = statsRes?.data?.stats;
	const recentOrders = ordersRes?.data?.orders?.slice(0, 5) || [];
	const firstName = user?.name ? user.name.split(" ")[0] : "Vendor";

	if (isStatsLoading || isOrdersLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-primary">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
			{/* Header */}
			<div className="flex flex-col gap-1">
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Merchant Overview</p>
				<h1 className="font-bold text-4xl tracking-tighter text-zinc-900">Welcome back, {firstName}.</h1>
				<p className="text-zinc-500 text-sm font-medium italic">Your artisan store is performing beautifully today.</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-all">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
							<DollarSign className="h-6 w-6 text-white" />
						</div>
						<div>
							<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Gross Revenue</p>
							<div className="text-3xl font-bold tracking-tighter text-zinc-900">
								${stats?.totalRevenue?.toLocaleString()}
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-all">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
							<ShoppingBag className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Total Orders</p>
							<div className="text-3xl font-bold tracking-tighter text-zinc-900">
								{stats?.totalOrders || 0}
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-all">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100">
							<Package className="h-6 w-6 text-zinc-400" />
						</div>
						<div>
							<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Listed Artifacts</p>
							<div className="text-3xl font-bold tracking-tighter text-zinc-900">
								{stats?.totalProducts || 0}
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition-all">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100">
							<TrendingUp className="h-6 w-6 text-zinc-400" />
						</div>
						<div>
							<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Average Value</p>
							<div className="text-3xl font-bold tracking-tighter text-zinc-900">
								${Math.round(stats?.avgOrderValue || 0).toLocaleString()}
							</div>
						</div>
					</div>
				</Card>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Recent Orders */}
				<Card className="lg:col-span-2 overflow-hidden border-border bg-card shadow-lg shadow-zinc-200/50 rounded-[2rem]">
					<div className="p-6 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
						<h2 className="font-bold text-lg text-zinc-900 tracking-tight">Recent Acquisitions</h2>
						<Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest text-zinc-500" asChild>
							<Link href="/vendor/dashboard/orders">View All</Link>
						</Button>
					</div>

					<div className="divide-y divide-zinc-50">
						{recentOrders.length === 0 ? (
							<div className="p-12 text-center text-zinc-400 italic">
								No orders processed yet...
							</div>
						) : (
							recentOrders.map((order: any) => (
								<div key={order.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
									<div className="flex items-center gap-4">
										<div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center">
											<Package className="h-4 w-4 text-zinc-400" />
										</div>
										<div>
											<p className="font-bold text-zinc-900 text-sm">{order.orderNumber}</p>
											<p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
												{new Date(order.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-bold text-zinc-900">${order.total?.toLocaleString()}</p>
										<Badge variant="outline" className={cn(
											"text-[8px] h-5 px-2 font-bold uppercase border-none",
											order.status === "paid" ? "bg-blue-50 text-blue-600" :
												order.status === "shipped" ? "bg-purple-50 text-purple-600" :
													order.status === "delivered" ? "bg-emerald-50 text-emerald-600" :
														"bg-zinc-100 text-zinc-500"
										)}>
											{order.status}
										</Badge>
									</div>
								</div>
							))
						)}
					</div>
				</Card>

				{/* Quick Actions & Status */}
				<div className="space-y-6">
					<Card className="p-8 border-border bg-zinc-900 rounded-[2rem] text-white shadow-xl">
						<h2 className="font-bold text-lg mb-6 tracking-tight">Merchant Actions</h2>
						<div className="grid gap-3">
							<Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-bold text-xs uppercase tracking-widest" asChild>
								<Link href="/vendor/dashboard/products/new">Add New Product</Link>
							</Button>
							<Button variant="outline" className="w-full border-white/20 bg-transparent text-white hover:bg-white/5 rounded-xl h-12 font-bold text-xs uppercase tracking-widest" asChild>
								<Link href="/vendor/dashboard/orders">Ship Pending Orders</Link>
							</Button>
						</div>
					</Card>

					<Card className="p-8 border-border bg-card shadow-sm rounded-[2rem]">
						<h2 className="font-bold text-zinc-900 text-lg mb-6 tracking-tight">Operational Support</h2>
						<p className="text-sm text-zinc-500 leading-relaxed font-serif italic mb-6">
							Need assistance with and acquisition or shipment? Our elite logistics team is available 24/7.
						</p>
						<Button variant="outline" className="w-full border-border rounded-xl h-12 font-bold text-xs uppercase tracking-widest text-zinc-600">
							Contact Support
						</Button>
					</Card>
				</div>
			</div>
		</div>
	);
}


