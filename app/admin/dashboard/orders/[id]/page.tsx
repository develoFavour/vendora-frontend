"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminOrder } from "@/hooks/use-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
	ArrowLeft, AlertTriangle, Truck, CreditCard, Clock, 
	Package, MapPin, Receipt, CheckCircle, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    shipped: "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-purple-50 text-purple-600 border-purple-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
	const router = useRouter();

	const { data, isLoading, error } = useAdminOrder(id);
	
	if (isLoading) {
		return (
			<div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
				<p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading order map...</p>
			</div>
		);
	}

	if (error || !data?.data?.order) {
		return (
			<div className="p-8 max-w-7xl mx-auto space-y-4">
				<Button variant="outline" onClick={() => router.back()} className="mb-4">
					<ArrowLeft className="h-4 w-4 mr-2" /> Back
				</Button>
				<Card className="p-12 text-center border-red-100 bg-red-50/50 rounded-3xl">
					<AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
					<h3 className="text-lg font-bold text-red-900">Failed to load order</h3>
					<p className="text-red-600/80 text-sm mt-1">The requested order ledger could not be found or loaded.</p>
				</Card>
			</div>
		);
	}

	const o = data.data.order;

	return (
		<div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
			{/* Breadcrumbs / Back */}
			<div className="flex items-center gap-2 text-sm text-zinc-500">
				<Link href="/admin/dashboard/orders" className="hover:text-zinc-900 transition-colors">Global Orders</Link>
				<span className="text-zinc-300">/</span>
				<span className="text-zinc-900 font-medium">#{o.orderNumber || o.id.substring(18)}</span>
			</div>

			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<div className="flex items-center gap-4">
						<h1 className="text-3xl font-bold tracking-tighter text-zinc-900">Order #{o.orderNumber || o.id.substring(18)}</h1>
						<Badge variant="outline" className={cn("border-none text-[10px] uppercase tracking-widest font-bold py-1 px-3 rounded-full", STATUS_COLORS[o.status] || STATUS_COLORS.pending)}>
							{o.status || "pending"}
						</Badge>
					</div>
					<div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
						<span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {new Date(o.createdAt).toLocaleString()}</span>
						<span className="text-zinc-300">•</span>
						<span className="font-mono text-xs">{o.id}</span>
					</div>
				</div>

				{/* Admin Actions */}
				<div className="flex gap-2">
					<Button variant="outline" className="border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700">Flag Transaction</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Sidebar: Buyer & Financials */}
				<div className="space-y-6 lg:col-span-1">
					<Card className="p-6 border-zinc-200 shadow-sm rounded-3xl relative overflow-hidden">
						<div className="absolute top-0 right-0 p-4 opacity-5"><Receipt className="h-24 w-24" /></div>
						<h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
							<CreditCard className="h-4 w-4 text-primary" />
							Financial Ledger
						</h3>

						<div className="space-y-4">
							<div className="flex justify-between text-sm">
								<span className="text-zinc-500">Subtotal</span>
								<span className="font-medium text-zinc-900">${(o.subTotal || 0).toLocaleString()}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-500">Shipping</span>
								<span className="font-medium text-zinc-900">${(o.shippingFee || 0).toLocaleString()}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-zinc-500">Tax</span>
								<span className="font-medium text-zinc-900">${(o.tax || 0).toLocaleString()}</span>
							</div>
							<div className="pt-4 border-t border-dashed border-zinc-200 flex justify-between items-center">
								<span className="font-bold text-zinc-900">Total</span>
								<span className="text-2xl font-black text-primary">${(o.total || 0).toLocaleString()}</span>
							</div>
						</div>

						<div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
							<div className="flex items-center gap-2 mb-2">
								{o.paymentStatus === "completed" ? (
									<CheckCircle className="h-4 w-4 text-emerald-500" />
								) : (
									<AlertTriangle className="h-4 w-4 text-amber-500" />
								)}
								<span className="text-xs font-bold uppercase tracking-widest text-zinc-700">
									{o.paymentMethod} {o.paymentStatus}
								</span>
							</div>
							<p className="text-[10px] text-zinc-400 font-mono truncate">ID: {o.paymentId || "N/A"}</p>
						</div>
					</Card>

					<Card className="p-6 border-zinc-200 shadow-sm rounded-3xl">
						<h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
							<MapPin className="h-4 w-4 text-primary" />
							Customer Profile
						</h3>
						
						<div className="space-y-4">
							<div>
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">Identity</p>
								<Link href={`/admin/dashboard/customers/${o.buyerId}`} className="text-sm font-bold text-zinc-900 hover:text-primary hover:underline">
									{o.buyerName || "Unknown Buyer"}
								</Link>
								<p className="text-xs text-zinc-500">{o.buyerEmail || "No email"}</p>
								<p className="text-xs text-zinc-500">{o.buyerPhone || "No phone"}</p>
							</div>

							<div className="pt-4 border-t border-dashed border-zinc-200">
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Shipping Destination</p>
								<p className="text-sm text-zinc-700 leading-relaxed font-medium">
									{o.shippingAddress || <span className="italic text-zinc-400">Digital Delivery or Not Provided</span>}
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Right Sections: Items, Fulfillment */}
				<div className="space-y-6 lg:col-span-2">
					<Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden">
						<div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
							<h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
								<Package className="h-4 w-4 text-primary" />
								Line Items & Splitting
							</h3>
						</div>
						
						<div className="divide-y divide-zinc-100">
							{o.items && o.items.length > 0 ? o.items.map((item: any, idx: number) => (
								<div key={idx} className="p-6 flex items-start gap-4 hover:bg-zinc-50/50 transition-colors group">
									<div className="h-16 w-16 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
										{item.image ? (
											<Image src={item.image} alt={item.name} fill className="object-cover" />
										) : (
											<Package className="h-6 w-6 text-zinc-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<Link href={`/admin/dashboard/products/${item.productId}`} className="font-bold text-sm text-zinc-900 group-hover:text-primary transition-colors leading-tight line-clamp-1 block">
											{item.name || "Untitled Product"}
										</Link>
										<div className="flex items-center gap-2 mt-1">
											<Badge variant="secondary" className="bg-zinc-100 text-[9px] uppercase tracking-widest font-bold">{item.quantity} × ${(item.price || 0).toLocaleString()}</Badge>
										</div>
										<p className="text-[10px] text-zinc-400 font-mono mt-2 truncate w-full">Vendor: {item.vendorId}</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-zinc-900">${(item.subtotal || (item.quantity * item.price) || 0).toLocaleString()}</p>
									</div>
								</div>
							)) : (
								<div className="p-12 text-center">
									<p className="text-zinc-500 text-sm">No items found in this order payload.</p>
								</div>
							)}
						</div>
					</Card>

					<Card className="p-6 border-zinc-200 shadow-sm rounded-3xl">
						<h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
							<Truck className="h-4 w-4 text-primary" />
							Logistics & Fulfillment
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-zinc-500 font-medium tracking-wide">Courier Service</span>
									<span className="font-bold text-zinc-900">Standard</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-zinc-500 font-medium tracking-wide">Tracking Code</span>
									<span className="font-mono font-bold text-primary">{o.trackingNumber || "Pending"}</span>
								</div>
							</div>
							
							<div className="p-4 border border-zinc-100 rounded-2xl bg-white space-y-3">
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Internal Audit Trace</p>
								<div className="text-xs text-zinc-600 space-y-1">
									<p>Order Created: {new Date(o.createdAt).toISOString()}</p>
									<p>Last Modified: {new Date(o.updatedAt).toISOString()}</p>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
