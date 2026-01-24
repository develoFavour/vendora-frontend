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
			<section className="relative overflow-hidden bg-zinc-950 py-24 px-4 text-white rounded-b-[4rem]">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
				<div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" />
				<div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[130px]" />

				<div className="mx-auto max-w-7xl relative z-10">
					<div className="text-center">
						<Badge className="mb-8 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.3em]">
							Meet the Artisans
						</Badge>
						<h1 className="text-5xl md:text-8xl tracking-tighter mb-8">
							Discover <span className="italic text-primary">Mastery.</span>
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-400 font-medium leading-relaxed italic">
							&ldquo;Curating the world&apos;s most skilled makers, so you can discover pieces that resonate with your soul.&rdquo;
						</p>
					</div>

					{/* Stats */}
					<div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-white/10 pt-16">
						{[
							{ label: "Active Artisans", value: "2,500+" },
							{ label: "Boutique Items", value: "50,000+" },
							{ label: "Average Rating", value: "4.9/5" },
							{ label: "Global Presence", value: "25+ Countries" }
						].map((stat) => (
							<div key={stat.label} className="text-center group">
								<div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 group-hover:text-primary transition-colors">
									{stat.value}
								</div>
								<div className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Search and Filter Bar */}
			<section className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						{/* Search */}
						<div className="relative flex-1 max-w-md group">
							<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
							<Input
								type="search"
								placeholder="Search boutique names..."
								className="h-14 pl-12 rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl focus:ring-primary/10 transition-all font-medium"
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
			<section className="border-t border-border/40 bg-zinc-50/30 py-24">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="text-4xl md:text-6xl mb-8 tracking-tighter">
						Ready to <span className="italic text-primary">showcase</span> <br />
						your work?
					</h2>
					<p className="mt-6 text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
						Join our elite circle of artisans and reach collectors who truly appreciate the art of the handmade.
					</p>
					<Button size="lg" className="mt-12 h-16 px-12 rounded-full font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all" asChild>
						<Link href="/auth/signup">Become an Artisan Partner</Link>
					</Button>
				</div>
			</section>

			<Footer />
		</div>
	);
}
