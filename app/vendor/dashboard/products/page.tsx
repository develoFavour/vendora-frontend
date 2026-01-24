"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreVertical, Edit, Trash2, Loader2, PackageOpen, View } from "lucide-react";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { productAPI } from "@/lib/api";
import { toast } from "sonner";

export default function VendorProductsPage() {
	const [products, setProducts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [total, setTotal] = useState(0);

	const fetchProducts = async (query = "") => {
		setIsLoading(true);
		try {
			const response = await productAPI.listVendorProducts({
				query: query || undefined,
				limit: 20
			});
			if (response.success) {
				setProducts(response.data.products || []);
				setTotal(response.data.total || 0);
			}
		} catch (error: any) {
			console.error("Fetch products error:", error);
			toast.error("Failed to load products");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		fetchProducts(searchQuery);
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;

		try {
			const response = await productAPI.delete(id);
			if (response.success) {
				toast.success("Product deleted successfully");
				setProducts(products.filter(p => p.id !== id));
				setTotal(prev => prev - 1);
			}
		} catch (error: any) {
			console.error("Delete product error:", error);
			toast.error(error.message || "Failed to delete product");
		}
	};

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-serif text-3xl font-bold">Products</h1>
					<p className="mt-2 text-muted-foreground">
						{total} {total === 1 ? 'product' : 'products'} found in your inventory
					</p>
				</div>
				<Button asChild>
					<Link href="/vendor/dashboard/products/new">
						<Plus className="mr-2 h-5 w-5" />
						Add Product
					</Link>
				</Button>
			</div>

			{/* Search and Filters */}
			<Card className="mb-6 p-4">
				<form onSubmit={handleSearch} className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search products..."
							className="pl-10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<Button type="submit" variant="secondary">Search</Button>
					<Button variant="outline" type="button">Filter</Button>
				</form>
			</Card>

			{/* Products Table */}
			<Card className="min-h-[400px] flex flex-col">
				{isLoading ? (
					<div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
						<Loader2 className="h-8 w-8 animate-spin" />
						<p>Fetching your products...</p>
					</div>
				) : products.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
						<PackageOpen className="h-12 w-12 opacity-20" />
						<div className="text-center">
							<p className="font-medium text-foreground">No products found</p>
							<p className="text-sm">Try adding a new product or changing your search.</p>
						</div>
						<Button asChild variant="outline" className="mt-2">
							<Link href="/vendor/dashboard/products/new">Add First Product</Link>
						</Button>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="border-b border-border bg-muted/50">
								<tr>
									<th className="px-6 py-4 text-left text-sm font-semibold">
										Product
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold">
										Stock
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold">
										Price
									</th>
									<th className="px-6 py-4 text-left text-sm font-semibold">
										Status
									</th>
									<th className="px-6 py-4 text-right text-sm font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{products.map((product) => (
									<tr key={product.id} className="hover:bg-muted/50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="h-12 w-12 rounded-lg bg-muted overflow-hidden border border-border">
													{product.images?.[0] ? (
														<img src={product.images[0]} alt="" className="w-full h-full object-cover" />
													) : (
														<div className="w-full h-full flex items-center justify-center opacity-20 capitalize">
															{product.name?.[0]}
														</div>
													)}
												</div>
												<div className="flex flex-col">
													<span className="font-medium">{product.name}</span>
													<span className="text-xs text-muted-foreground">{product.brand || 'No brand'}</span>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={
													product.stock <= product.lowStockThreshold
														? "text-destructive font-medium"
														: "text-foreground"
												}
											>
												{product.stock}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-semibold">${product.price?.toLocaleString()}</span>
												{product.salePrice > 0 && product.salePrice < product.price && (
													<span className="text-[10px] text-muted-foreground line-through">${product.salePrice}</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<Badge
												variant={
													product.status === "active" ? "default" : "secondary"
												}
												className="capitalize"
											>
												{product.status}
											</Badge>
										</td>
										<td className="px-6 py-4 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="icon">
														<MoreVertical className="h-5 w-5" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link href={`/vendor/dashboard/products/${product.id}`}>
															<View className="mr-2 h-4 w-4" />
															View Details
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link href={`/vendor/dashboard/products/${product.id}/edit`}>
															<Edit className="mr-2 h-4 w-4" />
															Edit
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive"
														onClick={() => handleDelete(product.id)}
													>
														<Trash2 className="mr-2 h-4 w-4" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
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
