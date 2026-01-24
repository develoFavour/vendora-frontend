"use client";

import React, { useState } from "react";
import {
	Search,
	Filter,
	Eye,
	MoreHorizontal,
	Truck,
	Clock,
	CheckCircle2,
	AlertCircle,
	Package,
	Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVendorOrders, useUpdateVendorOrderStatus } from "@/hooks/use-vendor-orders";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function VendorOrdersPage() {
	const { data: ordersData, isLoading } = useVendorOrders();
	const orders = ordersData?.data?.orders || [];
	const [searchQuery, setSearchQuery] = useState("");
	const updateStatus = useUpdateVendorOrderStatus();

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
			case "paid": return "bg-blue-100 text-blue-700 border-blue-200";
			case "confirmed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
			case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
			case "delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
			case "cancelled": return "bg-red-100 text-red-700 border-red-200";
			default: return "bg-zinc-100 text-zinc-700 border-zinc-200";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case "pending": return <Clock className="w-3 h-3" />;
			case "delivered": return <CheckCircle2 className="w-3 h-3" />;
			case "shipped": return <Truck className="w-3 h-3" />;
			default: return <AlertCircle className="w-3 h-3" />;
		}
	};

	const handleUpdateStatus = (id: string, status: string) => {
		updateStatus.mutate({ id, status });
	};

	if (isLoading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center text-primary">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-8 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">
			{/* Header / Stats Section */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-2">
					<Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
						Fulfilment Ops
					</Badge>
					<h1 className="text-5xl font-bold tracking-tighter text-zinc-900">
						Shipping <span className="italic text-primary font-serif">Manifest.</span>
					</h1>
					<p className="text-zinc-500 font-medium italic">Oversee, authorize, and dispatch artisan acquisitions.</p>
				</div>

				<div className="flex items-center gap-3">
					<Button variant="outline" className="h-12 border-border bg-card rounded-xl px-6 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:bg-muted transition-all">
						<Filter className="mr-2 h-4 w-4" />
						Sort Filters
					</Button>
				</div>
			</div>

			{/* Metrics Row */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{[
					{ label: "New Arrivals", value: orders.filter((o: any) => o.status === "paid").length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
					{ label: "In Transit", value: orders.filter((o: any) => o.status === "shipped").length, icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
					{ label: "Complete", value: orders.filter((o: any) => o.status === "delivered").length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
					{ label: "Awaiting Pay", value: orders.filter((o: any) => o.status === "pending").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
				].map((stat, i) => (
					<Card key={i} className="bg-card border-border p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
						<div className="flex items-center gap-4">
							<div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
								<stat.icon className="h-6 w-6" />
							</div>
							<div>
								<p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
								<p className="text-3xl font-bold text-zinc-900 tracking-tighter">{stat.value}</p>
							</div>
						</div>
					</Card>
				))}
			</div>

			{/* Table Area */}
			<Card className="bg-card border-border overflow-hidden rounded-[2rem] shadow-lg shadow-zinc-200/50">
				<div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50">
					<div className="relative group flex-1 max-w-md">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
						<Input
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Locate Order ID or Number..."
							className="h-12 bg-white border-border pl-12 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-primary/20 focus:border-primary/40 transition-all font-medium shadow-none"
						/>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="border-b border-border bg-zinc-50/30">
								<th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Order Ref</th>
								<th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Details</th>
								<th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Acquisition</th>
								<th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Fulfillment</th>
								<th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{orders.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-20 text-center text-zinc-400 italic font-serif text-lg">
										The manifest is currently clear...
									</td>
								</tr>
							) : (
								orders.map((order: any) => (
									<tr key={order.id} className="group hover:bg-muted/30 transition-colors">
										<td className="px-6 py-6">
											<div className="space-y-1">
												<p className="font-bold text-zinc-900 tracking-widest uppercase text-sm group-hover:text-primary transition-colors">{order.orderNumber}</p>
												<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">ID: {order.id.slice(-8)}</p>
											</div>
										</td>
										<td className="px-6 py-6">
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-lg bg-zinc-100 border border-border flex items-center justify-center overflow-hidden">
													{order.items?.[0]?.image ? (
														<img src={order.items[0].image} className="w-full h-full object-cover" />
													) : (
														<Package className="h-4 w-4 text-zinc-400" />
													)}
												</div>
												<div className="flex flex-col">
													<p className="text-xs font-bold text-zinc-800 line-clamp-1">{order.items?.[0]?.name || "Artifact"}</p>
													<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
														{order.items?.length > 1 ? `+ ${order.items.length - 1} more items` : "Single Item Acquisition"}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-6">
											<div className="space-y-1">
												<p className="text-sm font-bold text-zinc-900 tabular-nums">${order.total?.toLocaleString()}</p>
												<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Card • Paid</p>
											</div>
										</td>
										<td className="px-6 py-6">
											<Badge
												variant="outline"
												className={cn(
													"h-8 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center w-fit gap-2 border shadow-none",
													getStatusColor(order.status)
												)}
											>
												{getStatusIcon(order.status)}
												{order.status}
											</Badge>
										</td>
										<td className="px-6 py-6 text-right">
											<div className="flex items-center justify-end gap-2">
												<Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-muted hover:text-zinc-900" asChild>
													<Link href={`/vendor/dashboard/orders/${order.id}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-muted">
															<MoreHorizontal className="h-4 w-4 text-zinc-500" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-48 bg-white border-border rounded-xl shadow-xl">
														<DropdownMenuItem
															disabled={order.status === "shipped" || order.status === "delivered"}
															onClick={() => handleUpdateStatus(order.id, "shipped")}
															className="text-xs font-bold uppercase tracking-widest focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
														>
															<Truck className="mr-2 h-4 w-4" />
															Mark as Shipped
														</DropdownMenuItem>
														<DropdownMenuItem
															disabled={order.status === "delivered"}
															onClick={() => handleUpdateStatus(order.id, "delivered")}
															className="text-xs font-bold uppercase tracking-widest focus:bg-emerald-50 focus:text-emerald-600 transition-colors cursor-pointer"
														>
															<CheckCircle2 className="mr-2 h-4 w-4" />
															Confirm Delivery
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="p-6 border-t border-border flex items-center justify-between bg-zinc-50/30">
					<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Showing {orders.length} ACTIVE MANIFEST ENTRIES</p>
					<div className="flex gap-2">
						<Button variant="ghost" className="h-10 px-4 rounded-xl text-zinc-400" disabled>Previous</Button>
						<Button variant="outline" className="h-10 px-4 rounded-xl border-border bg-white text-zinc-900 shadow-sm hover:bg-zinc-50">Next</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
