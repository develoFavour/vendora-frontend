"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCard } from "@/components/marketplace/product-card";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function MarketplacePage() {
	const [showFilters, setShowFilters] = useState(false);
	const [priceRange, setPriceRange] = useState([0, 500]);
	const [searchQuery, setSearchQuery] = useState("");

	const products = [
		{
			id: "1",
			name: "Handcrafted Ceramic Vase",
			price: 89.99,
			image: "https://parkergibbs.com/products/handcrafted-textured-ceramic-vase",
			vendor: "Artisan Pottery Co.",
			rating: 4.8,
			reviews: 124,
			category: "Home & Living",
		},
		{
			id: "2",
			name: "Organic Cotton Tote Bag",
			price: 34.99,
			image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
			vendor: "EcoStyle Goods",
			rating: 4.9,
			reviews: 89,
			category: "Fashion & Accessories",
		},
		{
			id: "3",
			name: "Wooden Cutting Board Set",
			price: 125.0,
			image: "https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&q=80",
			vendor: "Timber & Grain",
			rating: 5.0,
			reviews: 203,
			category: "Home & Living",
		},
		{
			id: "4",
			name: "Hand-Poured Soy Candles",
			price: 28.5,
			image: "https://images.unsplash.com/photo-1602874801006-e24b3e8d6d0d?w=800&q=80",
			vendor: "Lumière Candle Co.",
			rating: 4.7,
			reviews: 156,
			category: "Home & Living",
		},
		{
			id: "5",
			name: "Leather Messenger Bag",
			price: 189.0,
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
			vendor: "Heritage Leather Co.",
			rating: 4.9,
			reviews: 78,
			category: "Fashion & Accessories",
		},
		{
			id: "6",
			name: "Artisan Coffee Blend",
			price: 24.99,
			image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
			vendor: "Mountain Roasters",
			rating: 4.8,
			reviews: 234,
			category: "Food & Beverages",
		},
		{
			id: "7",
			name: "Handwoven Throw Blanket",
			price: 145.0,
			image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
			vendor: "Textile Traditions",
			rating: 5.0,
			reviews: 92,
			category: "Home & Living",
		},
		{
			id: "8",
			name: "Sterling Silver Necklace",
			price: 98.0,
			image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
			vendor: "Silversmith Studio",
			rating: 4.9,
			reviews: 167,
			category: "Jewelry",
		},
	];

	const categories = [
		"Home & Living",
		"Fashion & Accessories",
		"Art & Collectibles",
		"Jewelry",
		"Food & Beverages",
		"Beauty & Wellness",
	];

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Header Section */}
			<section className="relative overflow-hidden bg-zinc-950 py-24 px-4 text-white rounded-b-[4rem]">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
				<div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" />
				<div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[130px]" />

				<div className="mx-auto max-w-7xl relative z-10 text-center">
					<Badge className="mb-8 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.3em]">
						The Collectors Gallery
					</Badge>
					<h1 className="text-5xl md:text-8xl tracking-tighter mb-8 leading-[0.9]">
						The Art of <br />
						<span className="text-primary italic">Handmade.</span>
					</h1>
					<p className="mx-auto mt-8 max-w-2xl text-xl text-zinc-400 font-medium leading-relaxed italic">
						&ldquo;Beyond the ordinary. Discover a curated collection of exceptional pieces crafted with soul and purpose.&rdquo;
					</p>
				</div>
			</section>

			{/* Search and Filter Bar */}
			<section className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						{/* Search */}
						<div className="relative flex-1 max-w-md group">
							<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
							<Input
								type="search"
								placeholder="Search the collections..."
								className="h-14 pl-12 rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl focus:ring-primary/10 transition-all font-medium"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						{/* Sort and Filter */}
						<div className="flex items-center gap-3">
							<Select defaultValue="featured">
								<SelectTrigger className="h-14 w-[180px] rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl transition-all focus:ring-primary/10">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-white/80">
									<SelectItem value="featured">Featured Gallery</SelectItem>
									<SelectItem value="price-low">Price: Low to High</SelectItem>
									<SelectItem value="price-high">Price: High to Low</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="newest">New Collections</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								size="default"
								onClick={() => setShowFilters(!showFilters)}
								className="h-14 px-6 gap-3 rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl hover:bg-zinc-100 transition-all font-bold text-xs uppercase tracking-widest"
							>
								<SlidersHorizontal className="h-4 w-4 text-primary" />
								Filters
								{showFilters && <X className="h-4 w-4" />}
							</Button>
						</div>
					</div>

					{/* Active Filters */}
					<div className="mt-4 flex flex-wrap gap-2">
						<Badge variant="secondary" className="gap-1">
							Home & Living
							<X className="h-3 w-3 cursor-pointer" />
						</Badge>
						<Badge variant="secondary" className="gap-1">
							$0 - $500
							<X className="h-3 w-3 cursor-pointer" />
						</Badge>
					</div>
				</div>
			</section>

			{/* Main Content */}
			<section className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex gap-8">
						{/* Filters Sidebar */}
						{showFilters && (
							<aside className="hidden w-64 shrink-0 lg:block">
								<Card className="sticky top-24 p-6">
									<div className="space-y-6">
										{/* Category Filter */}
										<div>
											<h3 className="mb-4 font-semibold">Category</h3>
											<div className="space-y-3">
												{categories.map((category) => (
													<div
														key={category}
														className="flex items-center space-x-2"
													>
														<Checkbox id={category} />
														<Label
															htmlFor={category}
															className="text-sm font-normal cursor-pointer"
														>
															{category}
														</Label>
													</div>
												))}
											</div>
										</div>

										{/* Price Range Filter */}
										<div className="border-t border-border pt-6">
											<h3 className="mb-4 font-semibold">Price Range</h3>
											<div className="space-y-4">
												<Slider
													value={priceRange}
													onValueChange={setPriceRange}
													max={500}
													step={10}
													className="w-full"
												/>
												<div className="flex items-center justify-between text-sm text-muted-foreground">
													<span>${priceRange[0]}</span>
													<span>${priceRange[1]}</span>
												</div>
											</div>
										</div>

										{/* Rating Filter */}
										<div className="border-t border-border pt-6">
											<h3 className="mb-4 font-semibold">Rating</h3>
											<div className="space-y-3">
												{[5, 4, 3].map((rating) => (
													<div
														key={rating}
														className="flex items-center space-x-2"
													>
														<Checkbox id={`rating-${rating}`} />
														<Label
															htmlFor={`rating-${rating}`}
															className="text-sm font-normal cursor-pointer"
														>
															{rating} stars & up
														</Label>
													</div>
												))}
											</div>
										</div>

										{/* Vendor Filter */}
										<div className="border-t border-border pt-6">
											<h3 className="mb-4 font-semibold">Vendor</h3>
											<div className="space-y-3">
												<div className="flex items-center space-x-2">
													<Checkbox id="verified" />
													<Label
														htmlFor="verified"
														className="text-sm font-normal cursor-pointer"
													>
														Verified only
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<Checkbox id="local" />
													<Label
														htmlFor="local"
														className="text-sm font-normal cursor-pointer"
													>
														Local vendors
													</Label>
												</div>
											</div>
										</div>

										{/* Clear Filters */}
										<Button
											variant="outline"
											className="w-full bg-transparent"
											size="sm"
										>
											Clear All Filters
										</Button>
									</div>
								</Card>
							</aside>
						)}

						{/* Products Grid */}
						<div className="flex-1">
							<div className="mb-6 flex items-center justify-between">
								<p className="text-sm text-muted-foreground">
									Showing{" "}
									<span className="font-medium text-foreground">
										{products.length}
									</span>{" "}
									products
								</p>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{products.map((product) => (
									<ProductCard
										key={product.id}
										id={product.id}
										name={product.name}
										image={product.image}
										price={product.price.toString()}
										vendor={product.vendor}
										inStock
									/>
								))}
							</div>

							{/* Pagination */}
							<div className="mt-12 flex items-center justify-center gap-2">
								<Button variant="outline" size="sm" disabled>
									Previous
								</Button>
								<Button variant="default" size="sm">
									1
								</Button>
								<Button variant="outline" size="sm">
									2
								</Button>
								<Button variant="outline" size="sm">
									3
								</Button>
								<Button variant="outline" size="sm">
									Next
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
