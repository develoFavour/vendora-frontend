"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminProduct, useFlagProduct, useApproveProduct } from "@/hooks/use-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft, Package, Store, Box, AlertTriangle, CheckCircle2,
	Tag, Image as ImageIcon, BarChart3, Truck, ShieldAlert,
	FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function AdminProductProfilePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const router = useRouter();

	const { data, isLoading, error } = useAdminProduct(id);
	const flagProduct = useFlagProduct();
	const approveProduct = useApproveProduct();

	if (isLoading) {
		return (
			<div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
				<p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading product...</p>
			</div>
		);
	}

	if (error || !data?.data) {
		return (
			<div className="p-8 max-w-7xl mx-auto space-y-4">
				<Button variant="outline" onClick={() => router.back()} className="mb-4">
					<ArrowLeft className="h-4 w-4 mr-2" /> Back
				</Button>
				<Card className="p-12 text-center border-red-100 bg-red-50/50">
					<AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
					<h3 className="text-lg font-bold text-red-900">Failed to load product</h3>
					<p className="text-red-600/80 text-sm mt-1">The requested product could not be found or loaded.</p>
				</Card>
			</div>
		);
	}

	const product = data.data.product || {};
	const vendor = data.data.vendor || {};

	return (
		<div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
			{/* Breadcrumbs / Back */}
			<div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
				<Link href="/admin/dashboard/products" className="hover:text-zinc-900 transition-colors">Products</Link>
				<span className="text-zinc-300">/</span>
				<span className="text-zinc-900 font-medium">{product.name || "Unknown Product"}</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Sidebar: Product Media & Identity */}
				<div className="space-y-6 lg:col-span-1">
					<Card className="p-6 border-zinc-200 shadow-sm relative overflow-hidden">
						{/* Main Image */}
						<div className="aspect-square bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden relative mb-6">
							{product.images?.[0] ? (
								<Image src={product.images[0]} alt={product.name} fill className="object-cover" />
							) : (
								<div className="flex items-center justify-center h-full w-full bg-zinc-50 text-zinc-300">
									<ImageIcon className="h-12 w-12" />
								</div>
							)}
						</div>

						{/* Identity */}
						<div>
							<h2 className="text-xl font-bold text-zinc-900 leading-tight">{product.name}</h2>
							<div className="flex items-center gap-2 mt-3">
								<Badge className={cn(
									"border-none text-[10px] uppercase tracking-widest font-bold px-3 rounded-full",
									product.status === "active" ? "bg-emerald-100 text-emerald-700" :
										product.status === "flagged" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600"
								)}>
									{product.status || "draft"}
								</Badge>
								<span className="text-sm font-black text-primary">${(product.price || 0).toLocaleString()}</span>
							</div>
						</div>

						<div className="mt-8 pt-6 border-t border-dashed border-zinc-200">
							<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Vendor Information</p>
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 font-bold">
									{vendor.storeName?.charAt(0) || <Store className="h-5 w-5" />}
								</div>
								<div>
									<Link href={`/admin/dashboard/vendors/${vendor.userID}`} className="font-bold text-sm text-zinc-900 hover:text-primary transition-colors hover:underline">
										{vendor.storeName || "Unknown Vendor"}
									</Link>
									<p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{vendor.tier || "individual"}</p>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Right Sections: Details, Inventory, Flags */}
				<div className="space-y-6 lg:col-span-2">

					{/* Key Metrics */}
					<div className="grid grid-cols-3 gap-4">
						<Card className="p-5 flex flex-col justify-center border-zinc-200 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4 opacity-5"><BarChart3 className="h-16 w-16" /></div>
							<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Sales</p>
							<p className="text-2xl font-black text-zinc-900 mt-2">{product.totalSales || 0}</p>
						</Card>
						<Card className="p-5 flex flex-col justify-center border-zinc-200 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4 opacity-5"><Box className="h-16 w-16" /></div>
							<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Current Stock</p>
							<p className={cn("text-2xl font-black mt-2", (product.stock || 0) < 10 ? "text-amber-500" : "text-zinc-900")}>
								{product.stock || 0}
							</p>
						</Card>
						<Card className="p-5 flex flex-col justify-center border-zinc-200 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4 opacity-5"><Tag className="h-16 w-16" /></div>
							<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Brand</p>
							<p className="text-lg font-black text-zinc-900 mt-2 truncate">{product.brand || "Unbranded"}</p>
						</Card>
					</div>

					{/* Metadata & Description */}
					<Card className="p-6 border-zinc-200 shadow-sm">
						<h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
							<FileText className="h-4 w-4 text-primary" />
							Listing Details
						</h3>

						<div className="space-y-6">
							<div>
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Description</p>
								<div className="text-sm text-zinc-600 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
									{product.description || <span className="italic">No description provided.</span>}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-6 pb-6 border-b border-dashed border-zinc-200">
								<div>
									<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Identifiers</p>
									<ul className="text-sm space-y-2 text-zinc-600">
										<li className="flex justify-between">
											<span>Product ID</span>
											<span className="font-mono text-zinc-400 text-xs">{product.id}</span>
										</li>
										<li className="flex justify-between">
											<span>SKU</span>
											<span className="font-mono text-zinc-900 font-bold">{product.sku || "N/A"}</span>
										</li>
										<li className="flex justify-between">
											<span>Barcode</span>
											<span className="font-mono text-zinc-900 font-bold">{product.barcode || "N/A"}</span>
										</li>
									</ul>
								</div>
								<div>
									<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Tags</p>
									<div className="flex flex-wrap gap-2">
										{product.tags && product.tags.length > 0 ? (
											product.tags.map((t: string) => (
												<Badge key={t} variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 rounded-md">#{t}</Badge>
											))
										) : (
											<span className="text-sm text-zinc-400 italic">No tags specified</span>
										)}
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div>
									<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2 flex items-center gap-2">
										<Truck className="h-3.5 w-3.5" /> Shipping Profile
									</p>
									<p className="text-sm text-zinc-700 font-medium">Class: {product.shippingClass || "Standard"}</p>
									{product.dimensions && (
										<p className="text-xs text-zinc-500 mt-1">
											{product.dimensions.length}x{product.dimensions.width}x{product.dimensions.height} cm • {product.dimensions.weight} kg
										</p>
									)}
								</div>
								<div>
									<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2 flex items-center gap-2">
										<ShieldAlert className="h-3.5 w-3.5" /> Moderation Tools
									</p>
									<div className="flex flex-wrap gap-2">
										{product.status === "flagged" ? (
											<Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50" onClick={() => approveProduct.mutate(id)} disabled={approveProduct.isPending}>Approve Listing</Button>
										) : (
											<Button size="sm" variant="outline" className="border-red-200 text-red-600 bg-red-50" onClick={() => flagProduct.mutate(id)} disabled={flagProduct.isPending}>Flag Listing</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
