import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	Store,
	ShoppingCart,
	TrendingUp,
	Shield,
	Users,
	Heart,
	MapPin,
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/marketplace/product-card";
import { VendorCard } from "@/components/marketplace/vendor-card";

export default function HomePage() {
	const featuredProducts = [
		{
			id: "1",
			name: "Handcrafted Ceramic Vase",
			price: 89.99,
			image:
				"https://parkergibbs.com/products/handcrafted-textured-ceramic-vase",
			vendor: "Artisan Pottery Co.",
			rating: 4.8,
			reviews: 124,
		},
		{
			id: "2",
			name: "Organic Cotton Tote Bag",
			price: 34.99,
			image:
				"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
			vendor: "EcoStyle Goods",
			rating: 4.9,
			reviews: 89,
		},
		{
			id: "3",
			name: "Wooden Cutting Board Set",
			price: 125.0,
			image:
				"https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=800&q=80",
			vendor: "Timber & Grain",
			rating: 5.0,
			reviews: 203,
		},
		{
			id: "4",
			name: "Hand-Poured Soy Candles",
			price: 28.5,
			image:
				"https://images.unsplash.com/photo-1602874801006-e24b3e8d6d0d?w=800&q=80",
			vendor: "Lumière Candle Co.",
			rating: 4.7,
			reviews: 156,
		},
	];

	const featuredVendors = [
		{
			id: "1",
			name: "Artisan Pottery Co.",
			description: "Handmade ceramics crafted with love and care",
			image:
				"https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
			location: "Portland, OR",
			rating: 4.9,
			products: 45,
			verified: true,
		},
		{
			id: "2",
			name: "EcoStyle Goods",
			description: "Sustainable fashion and accessories",
			image:
				"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
			location: "Austin, TX",
			rating: 4.8,
			products: 78,
			verified: true,
		},
		{
			id: "3",
			name: "Timber & Grain",
			description: "Premium woodwork and home essentials",
			image:
				"https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&q=80",
			location: "Seattle, WA",
			rating: 5.0,
			products: 32,
			verified: true,
		},
	];

	const categories = [
		{
			name: "Home & Living",
			count: 12500,
			icon: "🏠",
			color: "bg-sage/10 text-sage",
		},
		{
			name: "Fashion & Accessories",
			count: 8900,
			icon: "👗",
			color: "bg-terracotta/10 text-terracotta",
		},
		{
			name: "Art & Collectibles",
			count: 6700,
			icon: "🎨",
			color: "bg-sage/10 text-sage",
		},
		{
			name: "Jewelry",
			count: 5400,
			icon: "💎",
			color: "bg-terracotta/10 text-terracotta",
		},
		{
			name: "Food & Beverages",
			count: 3200,
			icon: "🍽️",
			color: "bg-sage/10 text-sage",
		},
		{
			name: "Beauty & Wellness",
			count: 4100,
			icon: "✨",
			color: "bg-terracotta/10 text-terracotta",
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Hero Section - Asymmetric layout */}
			<section className="relative overflow-hidden border-b border-border">
				<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						<div className="flex flex-col justify-center">
							<Badge className="mb-6 w-fit bg-accent/10 text-accent hover:bg-accent/20">
								Supporting Local Businesses
							</Badge>
							<h1 className="text-5xl md:text-7xl lg:text-8xl tracking-tighter text-balance">
								Where independent <br />
								<span className="text-primary italic">sellers thrive.</span>
							</h1>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
								Discover unique products from passionate creators. One
								marketplace, multiple vendors, endless possibilities. Shop
								consciously, support locally.
							</p>
							<div className="mt-8 flex flex-col gap-4 sm:flex-row">
								<Button size="lg" asChild className="text-base">
									<Link href="/marketplace">
										Explore Marketplace
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									asChild
									className="text-base bg-transparent"
								>
									<Link href="/auth/signup">Start Selling</Link>
								</Button>
							</div>

							{/* Trust indicators */}
							<div className="mt-12 flex flex-wrap items-center gap-8 border-t border-border pt-8">
								<div>
									<div className="text-2xl font-bold">2,500+</div>
									<div className="text-sm text-muted-foreground">
										Active Vendors
									</div>
								</div>
								<div>
									<div className="text-2xl font-bold">50K+</div>
									<div className="text-sm text-muted-foreground">
										Products Listed
									</div>
								</div>
								<div>
									<div className="text-2xl font-bold">4.8/5</div>
									<div className="text-sm text-muted-foreground">
										Average Rating
									</div>
								</div>
							</div>
						</div>

						{/* Hero visual - Bento grid of vendor cards */}
						<div className="grid grid-cols-2 gap-4">
							<Card className="col-span-2 overflow-hidden border-2 border-primary/20 p-6">
								<div className="flex items-start justify-between">
									<div>
										<div className="mb-2 flex items-center gap-2">
											<div className="h-10 w-10 rounded-full bg-primary/10" />
											<div>
												<div className="font-semibold">Artisan Crafts Co.</div>
												<div className="text-xs text-muted-foreground">
													Handmade Goods
												</div>
											</div>
										</div>
										<p className="text-sm text-muted-foreground">
											Sustainable, handcrafted home decor
										</p>
									</div>
									<Badge variant="secondary">Verified</Badge>
								</div>
								<div className="mt-4 flex items-center gap-2 text-sm">
									<MapPin className="h-4 w-4 text-accent" />
									<span className="text-muted-foreground">Portland, OR</span>
								</div>
							</Card>

							<Card className="overflow-hidden p-4">
								<div className="aspect-square rounded-md bg-muted" />
								<div className="mt-3">
									<div className="text-sm font-medium">Ceramic Vase</div>
									<div className="text-sm font-semibold text-primary">$45</div>
								</div>
							</Card>

							<Card className="overflow-hidden p-4">
								<div className="aspect-square rounded-md bg-muted" />
								<div className="mt-3">
									<div className="text-sm font-medium">Woven Basket</div>
									<div className="text-sm font-semibold text-primary">$32</div>
								</div>
							</Card>

							<Card className="col-span-2 bg-accent/5 p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
											<TrendingUp className="h-6 w-6 text-accent" />
										</div>
										<div>
											<div className="text-sm font-semibold">
												Trending This Week
											</div>
											<div className="text-xs text-muted-foreground">
												+127% sales increase
											</div>
										</div>
									</div>
									<ArrowRight className="h-5 w-5 text-accent" />
								</div>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Products Section */}
			<section className="py-16 sm:py-24 border-b border-border">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-12">
						<div>
							<Badge className="mb-4 bg-terracotta/10 text-terracotta border-terracotta/20 font-bold tracking-widest uppercase text-[10px]">
								Trending Now
							</Badge>
							<h2 className="text-4xl md:text-5xl lg:text-6xl">
								Featured <span className="italic text-primary">Products</span>
							</h2>
							<p className="mt-6 text-lg text-muted-foreground">
								Handpicked items from our top vendors
							</p>
						</div>
						<Button
							variant="outline"
							asChild
							className="hidden sm:flex bg-transparent"
						>
							<Link href="/marketplace">
								View All
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{featuredProducts.map((product) => (
							<ProductCard
								key={product.id}
								id={product.id}
								name={product.name}
								image={product.image}
								price={product.price.toString()}
								vendor={product.vendor}
							/>
						))}
					</div>

					<div className="mt-8 flex justify-center sm:hidden">
						<Button variant="outline" asChild className="w-full bg-transparent">
							<Link href="/marketplace">
								View All Products
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Categories Section */}
			<section className="py-16 sm:py-24 bg-gradient-to-br from-cream/30 to-background border-b border-border">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<Badge className="mb-4 bg-sage/10 text-sage border-sage/20 font-bold tracking-widest uppercase text-[10px]">
							Browse by Category
						</Badge>
						<h2 className="text-4xl md:text-5xl lg:text-6xl">
							Shop What You <span className="italic">Love</span>
						</h2>
						<p className="mt-6 text-lg text-muted-foreground">
							Explore thousands of unique products across categories
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						{categories.map((category) => (
							<Link
								key={category.name}
								href={`/marketplace?category=${encodeURIComponent(
									category.name
								)}`}
							>
								<Card className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-border/50">
									<div
										className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.color} mb-4 text-2xl`}
									>
										{category.icon}
									</div>
									<h3 className="font-semibold text-lg mb-1">
										{category.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{category.count.toLocaleString()} products
									</p>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Vendor Spotlight Section */}
			<section className="py-16 sm:py-24 border-b border-border">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-end justify-between mb-12">
						<div>
							<Badge className="mb-4 bg-sage/10 text-sage border-sage/20 font-bold tracking-widest uppercase text-[10px]">
								Vendor Spotlight
							</Badge>
							<h2 className="text-4xl md:text-5xl lg:text-6xl">
								Meet Our <span className="italic text-primary">Makers</span>
							</h2>
							<p className="mt-6 text-lg text-muted-foreground">
								Discover the talented artisans behind your favorite products
							</p>
						</div>
						<Button
							variant="outline"
							asChild
							className="hidden sm:flex bg-transparent"
						>
							<Link href="/vendors">
								All Vendors
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{featuredVendors.map((vendor) => (
							<VendorCard
								key={vendor.id}
								id={vendor.id}
								description={vendor.description}
								name={vendor.name}
								category={""}
								location={vendor.location}
								rating={vendor.rating}
							/>
						))}
					</div>

					<div className="mt-8 flex justify-center sm:hidden">
						<Button variant="outline" asChild className="w-full bg-transparent">
							<Link href="/vendors">
								View All Vendors
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="border-b border-border py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-4xl md:text-5xl lg:text-6xl">
							How Vendora <span className="italic">Works</span>
						</h2>
						<p className="mt-6 text-lg text-muted-foreground">
							A seamless experience for buyers and sellers alike
						</p>
					</div>

					<div className="mt-16 grid gap-8 md:grid-cols-3">
						<Card className="border-2 p-8">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<Store className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mt-6 text-xl font-semibold">
								Discover Unique Vendors
							</h3>
							<p className="mt-3 text-muted-foreground leading-relaxed">
								Browse products from independent sellers. Each vendor brings
								their unique story and craftsmanship to the marketplace.
							</p>
						</Card>

						<Card className="border-2 p-8">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
								<ShoppingCart className="h-6 w-6 text-accent" />
							</div>
							<h3 className="mt-6 text-xl font-semibold">Unified Checkout</h3>
							<p className="mt-3 text-muted-foreground leading-relaxed">
								Add items from multiple vendors to your cart and checkout once.
								We handle the complexity, you enjoy the simplicity.
							</p>
						</Card>

						<Card className="border-2 p-8">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<Heart className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mt-6 text-xl font-semibold">Support Local</h3>
							<p className="mt-3 text-muted-foreground leading-relaxed">
								Filter by location to find vendors near you. Your purchase
								directly supports small businesses and local economies.
							</p>
						</Card>
					</div>
				</div>
			</section>

			{/* For Vendors Section */}
			<section className="bg-muted/30 py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						<div>
							<Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 font-bold tracking-widest uppercase text-[10px]">
								For Vendors
							</Badge>
							<h2 className="text-4xl md:text-5xl lg:text-6xl text-balance">
								Your store, <span className="italic">your rules,</span> <br />
								our platform.
							</h2>
							<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
								Join thousands of independent sellers who trust Vendora to power
								their online business. Get the tools you need to succeed without
								the complexity.
							</p>

							<div className="mt-8 space-y-6">
								<div className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<TrendingUp className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold">Real-Time Analytics</h3>
										<p className="text-sm text-muted-foreground">
											Track sales, monitor inventory, and understand your
											customers with powerful dashboards.
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
										<Shield className="h-5 w-5 text-accent" />
									</div>
									<div>
										<h3 className="font-semibold">Secure Payments</h3>
										<p className="text-sm text-muted-foreground">
											Automatic payouts, transparent fees, and fraud protection
											built in.
										</p>
									</div>
								</div>

								<div className="flex gap-4">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
										<Users className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h3 className="font-semibold">Built-In Audience</h3>
										<p className="text-sm text-muted-foreground">
											Reach thousands of conscious consumers actively looking
											for unique products.
										</p>
									</div>
								</div>
							</div>

							<Button size="lg" className="mt-8" asChild>
								<Link href="/auth/signup">
									Start Selling Today
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>

						{/* Stats card */}
						<div className="flex items-center">
							<Card className="w-full border-2 p-8">
								<h3 className="font-serif text-2xl font-bold">
									Transparent Pricing
								</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									No hidden fees, no surprises
								</p>

								<div className="mt-8 space-y-6">
									<div className="flex items-baseline justify-between border-b border-border pb-4">
										<span className="text-muted-foreground">
											Commission per sale
										</span>
										<span className="text-2xl font-bold">5%</span>
									</div>
									<div className="flex items-baseline justify-between border-b border-border pb-4">
										<span className="text-muted-foreground">Monthly fee</span>
										<span className="text-2xl font-bold">$0</span>
									</div>
									<div className="flex items-baseline justify-between border-b border-border pb-4">
										<span className="text-muted-foreground">Setup cost</span>
										<span className="text-2xl font-bold">$0</span>
									</div>
									<div className="flex items-baseline justify-between">
										<span className="text-muted-foreground">
											Payment processing
										</span>
										<span className="text-2xl font-bold">2.9% + 30¢</span>
									</div>
								</div>

								<div className="mt-8 rounded-lg bg-primary/5 p-4">
									<p className="text-sm text-muted-foreground">
										You keep{" "}
										<span className="font-semibold text-foreground">92.1%</span>{" "}
										of every sale. That&apos;s it.
									</p>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="border-t border-border py-16 sm:py-24">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="text-4xl md:text-6xl lg:text-7xl">
						Ready to join the <br />
						<span className="italic text-primary">marketplace?</span>
					</h2>
					<p className="mt-8 text-xl text-muted-foreground max-w-2xl mx-auto">
						Whether you&apos;re looking to discover unique products or start
						selling your own, Vendora is here for you.
					</p>
					<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
						<Button size="lg" asChild>
							<Link href="/marketplace">Browse Products</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/auth/signup">Become a Vendor</Link>
						</Button>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
