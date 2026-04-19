"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/marketplace/product-card";
import { Search, SlidersHorizontal, X, Loader2, ChevronLeft, ChevronRight, PackageOpen } from "lucide-react";
import { usePublicProducts, usePublicCategories } from "@/hooks/use-public-products";

export default function MarketplacePage() {
	const [showFilters, setShowFilters] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>("newest");
	const [page, setPage] = useState(1);
	const limit = 12;

	// API Hooks
	const { data: categoriesRes } = usePublicCategories();
	const { data: productsRes, isLoading, isError } = usePublicProducts({
		page,
		limit,
		query: searchQuery,
		category: selectedCategory,
		sort: sortBy,
	});

	const products = productsRes?.data?.products || [];
	const meta = productsRes?.data?.meta || { total: 0, page: 1, limit: 12 };
	const categories = categoriesRes?.data?.categories || [];

	const totalPages = Math.ceil(meta.total / limit);

	const handleCategoryChange = (categoryId: string) => {
		setSelectedCategory(prev => prev === categoryId ? undefined : categoryId);
		setPage(1); // Reset to first page on filter change
	};

	const clearFilters = () => {
		setSelectedCategory(undefined);
		setSearchQuery("");
		setPage(1);
	};

	const activeCategoryName = useMemo(() => {
		if (!selectedCategory) return null;
		return categories.find((c: any) => c.id === selectedCategory)?.name;
	}, [selectedCategory, categories]);

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Header Section */}
			<section className="relative overflow-hidden bg-zinc-950 py-24 px-4 text-white rounded-b-[4rem] md:rounded-b-[4rem]">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
				<div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" />
				<div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[130px]" />

				<div className="mx-auto max-w-7xl relative z-10 text-center">
					<Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.3em]">
						The Collectors Gallery
					</Badge>
					<h1 className="text-4xl md:text-7xl tracking-tighter mb-6 leading-tight font-serif italic">
						Curated <span className="text-primary not-italic">Excellence.</span>
					</h1>
					<p className="mx-auto max-w-2xl text-lg text-zinc-400 font-medium leading-relaxed italic opacity-80">
						Explore handcrafted treasures from world-class artisans.
					</p>
				</div>
			</section>

			{/* Search and Filter Bar */}
			<section className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 shadow-sm">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						{/* Search */}
						<div className="relative flex-1 max-w-md group">
							<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
							<Input
								type="search"
								placeholder="Search the collections..."
								className="h-14 pl-12 rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl focus:ring-primary/10 transition-all font-medium"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
							/>
						</div>

						{/* Sort and Filter */}
						<div className="flex items-center gap-3">
							<Select value={sortBy} onValueChange={(val) => {
								setSortBy(val);
								setPage(1);
							}}>
								<SelectTrigger className="h-14 w-[160px] md:w-[180px] rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl transition-all focus:ring-primary/10">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-white/80">
									<SelectItem value="newest">New Collections</SelectItem>
									<SelectItem value="price-low">Price: Low to High</SelectItem>
									<SelectItem value="price-high">Price: High to Low</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								size="default"
								onClick={() => setShowFilters(!showFilters)}
								className={`h-14 px-6 gap-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${showFilters ? "bg-primary text-white border-primary" : "border-border/40 bg-zinc-50/50 backdrop-blur-xl"
									}`}
							>
								<SlidersHorizontal className="h-4 w-4" />
								{showFilters ? "Hide Filters" : "Filters"}
							</Button>
						</div>
					</div>

					{/* Active Filter Chips */}
					{(selectedCategory || searchQuery) && (
						<div className="mt-4 flex flex-wrap gap-2 items-center">
							<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">Active:</span>
							{activeCategoryName && (
								<Badge variant="secondary" className="gap-2 py-1.5 px-3 rounded-full bg-primary/10 text-primary border-primary/20">
									{activeCategoryName}
									<X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setSelectedCategory(undefined)} />
								</Badge>
							)}
							{searchQuery && (
								<Badge variant="secondary" className="gap-2 py-1.5 px-3 rounded-full bg-zinc-100 text-zinc-900 border-zinc-200">
									&ldquo;{searchQuery}&rdquo;
									<X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setSearchQuery("")} />
								</Badge>
							)}
							<button
								onClick={clearFilters}
								className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary ml-2 underline underline-offset-4"
							>
								Clear All
							</button>
						</div>
					)}
				</div>
			</section>

			{/* Main Content */}
			<section className="flex-1 min-h-[600px]">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Filters Sidebar */}
						{showFilters && (
							<aside className="w-full lg:w-64 shrink-0 lg:block animate-in fade-in slide-in-from-left-4 duration-300">
								<Card className="sticky top-28 p-6 rounded-3xl border-border/40 bg-white/50 backdrop-blur-xl">
									<div className="space-y-8">
										{/* Category Filter */}
										<div>
											<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Categories</h3>
											<div className="space-y-3">
												{categories.map((category: any) => (
													<div
														key={category.id}
														className="flex items-center space-x-3 group cursor-pointer"
														onClick={() => handleCategoryChange(category.id)}
													>
														<Checkbox
															id={category.id}
															checked={selectedCategory === category.id}
															className="data-[state=checked]:bg-primary rounded-md"
														/>
														<Label
															htmlFor={category.id}
															className={`text-sm font-medium cursor-pointer transition-colors group-hover:text-primary ${selectedCategory === category.id ? "text-primary" : "text-foreground"
																}`}
														>
															{category.name}
														</Label>
													</div>
												))}
											</div>
										</div>

										{/* Help Box */}
										<div className="pt-6 border-t border-border/40">
											<div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
												<p className="text-xs text-muted-foreground font-medium italic italic leading-relaxed">
													Need help finding something specific? Contact our concierge service.
												</p>
											</div>
										</div>
									</div>
								</Card>
							</aside>
						)}

						{/* Products Container */}
						<div className="flex-1">
							{isLoading ? (
								<div className="flex flex-col items-center justify-center py-32 space-y-4">
									<Loader2 className="h-10 w-10 animate-spin text-primary" />
									<p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Opening the gallery...</p>
								</div>
							) : isError ? (
								<div className="flex flex-col items-center justify-center py-32 text-center">
									<p className="text-destructive font-bold">Failed to load collections.</p>
									<Button variant="link" onClick={() => window.location.reload()}>Try again</Button>
								</div>
							) : products.length === 0 ? (
								<div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
									<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
										<PackageOpen className="h-8 w-8 text-muted-foreground" />
									</div>
									<h2 className="text-xl font-serif italic text-muted-foreground">No pieces found.</h2>
									<p className="text-sm text-zinc-500 max-w-xs">We couldn't find any products matching your current filters.</p>
									<Button variant="outline" onClick={clearFilters} className="rounded-xl">Clear filters</Button>
								</div>
							) : (
								<>
									<div className="mb-8 flex items-center justify-between">
										<p className="text-sm font-medium text-muted-foreground">
											<span className="font-bold text-foreground">{meta.total}</span> pieces curated for you
										</p>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
										{products.map((product: any) => (
											<div key={product.id} className="animate-in fade-in duration-500">
												<ProductCard
													id={product.id}
													name={product.name}
													image={product.images?.[0] || product.image || "/placeholder.svg"}
													price={product.price.toString()}
													vendor={product.vendorName || "Artisan"}
													inStock={product.stock > 0}
												/>
											</div>
										))}
									</div>

									{/* Pagination */}
									{totalPages > 1 && (
										<div className="mt-20 flex items-center justify-center gap-3">
											<Button
												variant="ghost"
												size="icon"
												className="rounded-xl disabled:opacity-30"
												onClick={() => setPage(prev => Math.max(1, prev - 1))}
												disabled={page === 1}
											>
												<ChevronLeft className="h-5 w-5" />
											</Button>

											{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
												<Button
													key={p}
													variant={page === p ? "default" : "ghost"}
													size="sm"
													className={`w-10 h-10 rounded-xl font-bold transition-all ${page === p ? "shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground"
														}`}
													onClick={() => setPage(p)}
												>
													{p}
												</Button>
											))}

											<Button
												variant="ghost"
												size="icon"
												className="rounded-xl disabled:opacity-30"
												onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
												disabled={page === totalPages}
											>
												<ChevronRight className="h-5 w-5" />
											</Button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
