"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Flag, Package, Loader2, Store } from "lucide-react";
import { useAdminProducts } from "@/hooks/use-admin";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminProductsPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const { data: productsRes, isLoading } = useAdminProducts({
		search: search || undefined,
		status: statusFilter === "all" ? undefined : statusFilter,
	});

	const products = productsRes?.data?.products || [];

	return (
		<div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">Moderation</p>
				<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">Product Management</h1>
				<p className="text-zinc-500 text-sm mt-1">Monitor, review and moderate all listings on Vendora.</p>
			</div>

			{/* Controls */}
			<Card className="p-4 border-border bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
						<Input
							placeholder="Search by product name..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-12 rounded-xl bg-zinc-50 border-zinc-100 h-11"
						/>
					</div>
					<div className="flex gap-2">
						{["all", "active", "draft", "flagged"].map((status) => (
							<Button
								key={status}
								variant={statusFilter === status ? "default" : "outline"}
								onClick={() => setStatusFilter(status)}
								className="rounded-xl h-11 px-6 text-[10px] font-bold uppercase tracking-widest"
							>
								{status}
							</Button>
						))}
					</div>
				</div>
			</Card>

			{/* Table */}
			<Card className="overflow-hidden border-border bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm">
				{isLoading ? (
					<div className="p-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>
				) : products.length === 0 ? (
					<div className="p-20 text-center">
						<Package className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
						<p className="text-zinc-400 font-medium italic">No products found.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="border-b border-border bg-zinc-50 dark:bg-zinc-800/50">
								<tr>
									{["Product", "Vendor", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
										<th key={h} className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-widest text-zinc-400">{h}</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{products.map((p: any) => (
									<tr key={p.id || p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center gap-4">
												<div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative border border-border">
													{p.images?.[0] ? (
														<Image src={p.images[0]} alt={p.name} fill className="object-cover" />
													) : (
														<Package className="h-5 w-5 text-zinc-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
													)}
												</div>
												<div>
													<p className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">{p.name}</p>
													<p className="text-[10px] text-zinc-400 font-medium mt-0.5">ID: {p.id || p._id}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<Store className="h-3.5 w-3.5 text-zinc-400" />
												<span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{p.vendorName || "Active Vendor"}</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<Badge variant="outline" className="border-border text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full">
												{p.category || "General"}
											</Badge>
										</td>
										<td className="px-6 py-4 font-bold text-sm text-zinc-800 dark:text-zinc-200">
											${(p.price || 0).toLocaleString()}
										</td>
										<td className="px-6 py-4">
											<span className={cn("text-xs font-bold", p.stock < 10 ? "text-amber-500" : "text-zinc-500")}>
												{p.stock || 0}
											</span>
										</td>
										<td className="px-6 py-4">
											<Badge className={cn(
												"border-none text-[8px] uppercase tracking-widest font-bold py-1 px-3 rounded-full",
												p.status === "active" ? "bg-emerald-50 text-emerald-600" :
													p.status === "flagged" ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-600"
											)}>
												{p.status || "active"}
											</Badge>
										</td>
										<td className="px-6 py-4 text-right">
											<Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg" asChild>
												<Link href={`/admin/dashboard/products/${p.id || p._id}`}>
													<Eye className="h-4 w-4 text-zinc-400" />
												</Link>
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Card>
		</div>
	);
}
