"use client";

import Link from "next/link";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { VendorCard } from "@/components/marketplace/vendor-card";
import { Search, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VendorsPage() {
	const [searchQuery, setSearchQuery] = useState("");

	const vendors = [
		{
			id: "1",
			name: "Artisan Pottery Co.",
			description:
				"Handmade ceramics crafted with love and care. Each piece tells a unique story.",
			image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
			location: "Portland, OR",
			rating: 4.9,
			products: 45,
			verified: true,
			category: "Home & Living",
		},
		{
			id: "2",
			name: "EcoStyle Goods",
			description:
				"Sustainable fashion and accessories for the conscious consumer.",
			image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
			location: "Austin, TX",
			rating: 4.8,
			products: 78,
			verified: true,
			category: "Fashion",
		},
		{
			id: "3",
			name: "Timber & Grain",
			description:
				"Premium woodwork and home essentials handcrafted from sustainable materials.",
			image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
			location: "Seattle, WA",
			rating: 5.0,
			products: 32,
			verified: true,
			category: "Home & Living",
		},
		{
			id: "4",
			name: "Lumière Candle Co.",
			description:
				"Hand-poured soy candles with natural fragrances for your home sanctuary.",
			image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80",
			location: "Nashville, TN",
			rating: 4.7,
			products: 24,
			verified: true,
			category: "Home & Living",
		},
		{
			id: "5",
			name: "Heritage Leather Co.",
			description:
				"Traditional leather goods made with time-honored techniques.",
			image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80",
			location: "Denver, CO",
			rating: 4.9,
			products: 56,
			verified: true,
			category: "Fashion",
		},
		{
			id: "6",
			name: "Mountain Roasters",
			description:
				"Small-batch coffee roasted to perfection from ethically sourced beans.",
			image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
			location: "Boulder, CO",
			rating: 4.8,
			products: 18,
			verified: true,
			category: "Food & Beverages",
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Header */}
			<section className="border-b border-border bg-gradient-to-br from-sage/10 to-background">
				<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<div className="text-center">
						<Badge className="mb-6 bg-sage/10 text-sage border-sage/20">
							Meet Our Community
						</Badge>
						<h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
							Discover Independent Sellers
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
							Browse our curated collection of verified vendors. Each brings
							their unique craftsmanship and passion to the marketplace.
						</p>
					</div>

					{/* Stats */}
					<div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
						<div className="text-center">
							<div className="text-3xl font-bold text-primary">2,500+</div>
							<div className="mt-1 text-sm text-muted-foreground">
								Active Vendors
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-primary">50K+</div>
							<div className="mt-1 text-sm text-muted-foreground">Products</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-primary">4.8/5</div>
							<div className="mt-1 text-sm text-muted-foreground">
								Avg Rating
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl font-bold text-primary">98%</div>
							<div className="mt-1 text-sm text-muted-foreground">
								Satisfaction
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Search and Filter Bar */}
			<section className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search vendors..."
								className="pl-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						{/* Filters */}
						<div className="flex items-center gap-3">
							<Select defaultValue="all">
								<SelectTrigger className="w-[160px]">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									<SelectItem value="home">Home & Living</SelectItem>
									<SelectItem value="fashion">Fashion</SelectItem>
									<SelectItem value="food">Food & Beverages</SelectItem>
									<SelectItem value="art">Art & Collectibles</SelectItem>
								</SelectContent>
							</Select>

							<Select defaultValue="all">
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Location" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Locations</SelectItem>
									<SelectItem value="local">Near Me</SelectItem>
									<SelectItem value="west">West Coast</SelectItem>
									<SelectItem value="east">East Coast</SelectItem>
									<SelectItem value="midwest">Midwest</SelectItem>
									<SelectItem value="south">South</SelectItem>
								</SelectContent>
							</Select>

							<Select defaultValue="featured">
								<SelectTrigger className="w-[140px]">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="featured">Featured</SelectItem>
									<SelectItem value="rating">Highest Rated</SelectItem>
									<SelectItem value="products">Most Products</SelectItem>
									<SelectItem value="newest">Newest</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</section>

			{/* Vendors Grid */}
			<section className="flex-1 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-6 flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Showing{" "}
							<span className="font-medium text-foreground">
								{vendors.length}
							</span>{" "}
							vendors
						</p>
						<Button variant="ghost" size="sm" className="gap-2">
							<MapPin className="h-4 w-4" />
							View Map
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{vendors.map((vendor) => (
							<VendorCard
								key={vendor.id}
								id={vendor.id}
								category={vendor.category}
								description={vendor.description}
								rating={vendor.rating}
								verified={vendor.verified}
								location={vendor.location}
								name={vendor.name}
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
			</section>

			{/* CTA Section */}
			<section className="border-t border-border bg-muted/30 py-16">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
						Want to join our community?
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Start selling your products and reach thousands of conscious
						consumers.
					</p>
					<Button size="lg" className="mt-8" asChild>
						<Link href="/auth/signup">Become a Vendor</Link>
					</Button>
				</div>
			</section>

			<Footer />
		</div>
	);
}
