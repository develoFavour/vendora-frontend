"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/marketplace/product-card";
import {
	Star,
	Heart,
	Share2,
	ShoppingCart,
	Truck,
	Shield,
	RotateCcw,
	MapPin,
	Store,
	ChevronLeft,
	Plus,
	Minus,
} from "lucide-react";
import Image from "next/image";

export default function ProductDetailPage() {
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);

	const product = {
		id: "1",
		name: "Handcrafted Ceramic Vase",
		price: 89.99,
		description:
			"This beautiful ceramic vase is handcrafted with care by skilled artisans. Each piece is unique, featuring subtle variations in glaze and form that make it truly one-of-a-kind. Perfect for displaying fresh flowers or as a standalone decorative piece.",
		images: [
			"/handcrafted-ceramic-vase-pottery.jpg",
			"/ceramic-vase-detail-texture.jpg",
			"/ceramic-vase-side-view.jpg",
			"/ceramic-vase-top-view.jpg",
		],
		vendor: {
			id: "1",
			name: "Artisan Pottery Co.",
			location: "Portland, OR",
			rating: 4.9,
			totalSales: 1240,
			verified: true,
			image: "/pottery-studio-artisan-workspace.jpg",
		},
		rating: 4.8,
		reviews: 124,
		stock: 12,
		category: "Home & Living",
		sku: "APC-VAR-001",
		dimensions: '8" H x 5" W',
		weight: "2.5 lbs",
		materials: "Stoneware clay, food-safe glaze",
	};

	const reviews = [
		{
			id: "1",
			author: "Sarah M.",
			rating: 5,
			date: "2 weeks ago",
			comment:
				"Absolutely stunning! The craftsmanship is incredible and it looks even better in person. Perfect addition to my living room.",
			verified: true,
		},
		{
			id: "2",
			author: "Michael R.",
			rating: 5,
			date: "1 month ago",
			comment:
				"Beautiful piece. The glaze has such depth and the shape is elegant. Shipping was fast and packaging was excellent.",
			verified: true,
		},
		{
			id: "3",
			author: "Emma L.",
			rating: 4,
			date: "1 month ago",
			comment:
				"Love the vase! Only giving 4 stars because it's slightly smaller than I expected, but still gorgeous.",
			verified: true,
		},
	];

	const relatedProducts = [
		{
			id: "2",
			name: "Ceramic Bowl Set",
			price: 65.0,
			image: "/ceramic-bowl-set-handmade.jpg",
			vendor: "Artisan Pottery Co.",
			rating: 4.9,
			reviews: 89,
		},
		{
			id: "3",
			name: "Stoneware Planter",
			price: 45.0,
			image: "/stoneware-planter-ceramic.jpg",
			vendor: "Artisan Pottery Co.",
			rating: 4.7,
			reviews: 56,
		},
		{
			id: "4",
			name: "Decorative Plate",
			price: 38.0,
			image: "/decorative-plate-ceramic-art.jpg",
			vendor: "Artisan Pottery Co.",
			rating: 5.0,
			reviews: 72,
		},
	];

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Breadcrumb */}
			<div className="border-b border-border">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground">
							Home
						</Link>
						<span>/</span>
						<Link href="/marketplace" className="hover:text-foreground">
							Marketplace
						</Link>
						<span>/</span>
						<Link
							href={`/marketplace?category=${product.category}`}
							className="hover:text-foreground"
						>
							{product.category}
						</Link>
						<span>/</span>
						<span className="text-foreground">{product.name}</span>
					</div>
				</div>
			</div>

			{/* Product Details */}
			<section className="flex-1 py-8 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
						<Link href="/marketplace">
							<ChevronLeft className="mr-1 h-4 w-4" />
							Back to Marketplace
						</Link>
					</Button>

					<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
						{/* Images */}
						<div className="space-y-4">
							<div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
								<Image
									height={100}
									width={100}
									src={product.images[selectedImage] || "/placeholder.svg"}
									alt={product.name}
									className="h-full w-full object-cover"
								/>
							</div>
							<div className="grid grid-cols-4 gap-4">
								{product.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedImage === index
												? "border-primary"
												: "border-border"
											}`}
									>
										<Image
											height={100}
											width={100}
											src={image || "/placeholder.svg"}
											alt={`${product.name} ${index + 1}`}
											className="h-full w-full object-cover"
										/>
									</button>
								))}
							</div>
						</div>

						{/* Product Info */}
						<div className="space-y-6">
							<div>
								<div className="mb-4 flex items-center gap-3">
									<Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors py-1 px-4 text-[10px] font-bold uppercase tracking-widest">
										{product.category}
									</Badge>
									{product.stock < 15 && (
										<Badge
											variant="outline"
											className="border-amber-500/30 bg-amber-500/5 text-amber-600 py-1 px-4 text-[10px] font-bold uppercase tracking-widest animate-pulse"
										>
											Limited Edition: Only {product.stock} left
										</Badge>
									)}
								</div>
								<h1 className="text-4xl md:text-6xl tracking-tighter leading-[1.1] mb-6">
									{product.name}
								</h1>
								<div className="mt-4 flex items-center gap-6">
									<div className="flex items-center gap-1.5 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 shadow-sm">
										<Star className="h-4 w-4 fill-primary text-primary" />
										<span className="text-sm font-bold tracking-tight">{product.rating}</span>
									</div>
									<span className="text-sm text-zinc-400 font-medium tracking-wide">
										{product.reviews} Artisan Reviews
									</span>
								</div>
							</div>

							<div className="flex items-baseline gap-4 py-4">
								<span className="text-5xl font-bold tracking-tighter">${product.price}</span>
								<span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
									Ref: {product.sku}
								</span>
							</div>

							<p className="text-lg text-muted-foreground leading-[1.8] font-medium italic">
								&ldquo;{product.description}&rdquo;
							</p>

							{/* Vendor Info */}
							<Card className="border-2 p-4">
								<div className="flex items-start justify-between">
									<div className="flex gap-3">
										<div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
											<Image
												height={100}
												width={100}
												src={product.vendor.image || "/placeholder.svg"}
												alt={product.vendor.name}
												className="h-full w-full object-cover"
											/>
										</div>
										<div>
											<div className="flex items-center gap-2">
												<Link
													href={`/vendors/${product.vendor.id}`}
													className="font-semibold hover:underline"
												>
													{product.vendor.name}
												</Link>
												{product.vendor.verified && (
													<Badge variant="secondary" className="text-xs">
														Verified
													</Badge>
												)}
											</div>
											<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<MapPin className="h-3 w-3" />
													{product.vendor.location}
												</div>
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3 fill-primary text-primary" />
													{product.vendor.rating}
												</div>
											</div>
										</div>
									</div>
									<Button variant="outline" size="sm" asChild>
										<Link href={`/vendors/${product.vendor.id}`}>
											<Store className="mr-2 h-4 w-4" />
											Visit Store
										</Link>
									</Button>
								</div>
							</Card>

							{/* Quantity and Add to Cart */}
							<div className="space-y-4">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium">Quantity:</span>
										<div className="flex items-center border border-border rounded-md">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setQuantity(Math.max(1, quantity - 1))}
												disabled={quantity <= 1}
											>
												<Minus className="h-4 w-4" />
											</Button>
											<span className="w-12 text-center">{quantity}</span>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													setQuantity(Math.min(product.stock, quantity + 1))
												}
												disabled={quantity >= product.stock}
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>

								<div className="flex gap-3">
									<Button size="lg" className="flex-1">
										<ShoppingCart className="mr-2 h-5 w-5" />
										Add to Cart
									</Button>
									<Button size="lg" variant="outline">
										<Heart className="h-5 w-5" />
									</Button>
									<Button size="lg" variant="outline">
										<Share2 className="h-5 w-5" />
									</Button>
								</div>
							</div>

							{/* Shipping Info - High End Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
								{[
									{ icon: Truck, title: "Sovereign Shipping", desc: "Global delivery expertise." },
									{ icon: Shield, title: "Artisan Quality", desc: "Verified craftsmanship." },
									{ icon: RotateCcw, title: "Master Return", desc: "30-day elite guarantee." }
								].map((item, idx) => (
									<div key={idx} className="group p-6 rounded-3xl border border-border/40 bg-zinc-50/50 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
										<item.icon className="h-6 w-6 text-primary mb-4" />
										<div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{item.title}</div>
										<div className="text-[10px] text-zinc-400 font-medium">{item.desc}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Tabs Section */}
					<div className="mt-16">
						<Tabs defaultValue="details" className="w-full">
							<TabsList className="w-full justify-start border-b border-border rounded-none h-auto p-0 bg-transparent">
								<TabsTrigger
									value="details"
									className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
								>
									Product Details
								</TabsTrigger>
								<TabsTrigger
									value="reviews"
									className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
								>
									Reviews ({product.reviews})
								</TabsTrigger>
								<TabsTrigger
									value="shipping"
									className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
								>
									Shipping & Returns
								</TabsTrigger>
							</TabsList>

							<TabsContent value="details" className="mt-8">
								<div className="grid gap-8 md:grid-cols-2">
									<div>
										<h3 className="mb-4 text-lg font-semibold">
											Specifications
										</h3>
										<dl className="space-y-3">
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Dimensions</dt>
												<dd className="font-medium">{product.dimensions}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Weight</dt>
												<dd className="font-medium">{product.weight}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Materials</dt>
												<dd className="font-medium">{product.materials}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Category</dt>
												<dd className="font-medium">{product.category}</dd>
											</div>
										</dl>
									</div>
									<div>
										<h3 className="mb-4 text-lg font-semibold">
											Care Instructions
										</h3>
										<ul className="space-y-2 text-muted-foreground">
											<li>• Hand wash with mild soap and warm water</li>
											<li>• Not dishwasher safe</li>
											<li>• Avoid extreme temperature changes</li>
											<li>• Handle with care to prevent chipping</li>
											<li>• Wipe dry after washing</li>
										</ul>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="reviews" className="mt-8">
								<div className="space-y-6">
									{/* Review Summary */}
									<Card className="p-6">
										<div className="flex items-start gap-8">
											<div className="text-center">
												<div className="text-5xl font-bold">
													{product.rating}
												</div>
												<div className="mt-2 flex items-center justify-center gap-1">
													{Array.from({ length: 5 }).map((_, i) => (
														<Star
															key={i}
															className={`h-4 w-4 ${i < Math.floor(product.rating)
																	? "fill-primary text-primary"
																	: "fill-muted text-muted-foreground"
																}`}
														/>
													))}
												</div>
												<div className="mt-1 text-sm text-muted-foreground">
													{product.reviews} reviews
												</div>
											</div>
											<div className="flex-1 space-y-2">
												{[5, 4, 3, 2, 1].map((stars) => (
													<div key={stars} className="flex items-center gap-3">
														<span className="w-12 text-sm text-muted-foreground">
															{stars} star
														</span>
														<div className="h-2 flex-1 rounded-full bg-muted">
															<div
																className="h-full rounded-full bg-primary"
																style={{
																	width: `${stars === 5 ? 75 : stars === 4 ? 20 : 5
																		}%`,
																}}
															/>
														</div>
														<span className="w-12 text-right text-sm text-muted-foreground">
															{stars === 5 ? 93 : stars === 4 ? 25 : 6}
														</span>
													</div>
												))}
											</div>
										</div>
									</Card>

									{/* Individual Reviews */}
									<div className="space-y-6">
										{reviews.map((review) => (
											<Card key={review.id} className="p-6">
												<div className="flex items-start justify-between">
													<div>
														<div className="flex items-center gap-2">
															<span className="font-semibold">
																{review.author}
															</span>
															{review.verified && (
																<Badge variant="secondary" className="text-xs">
																	Verified Purchase
																</Badge>
															)}
														</div>
														<div className="mt-1 flex items-center gap-2">
															<div className="flex items-center gap-1">
																{Array.from({ length: 5 }).map((_, i) => (
																	<Star
																		key={i}
																		className={`h-4 w-4 ${i < review.rating
																				? "fill-primary text-primary"
																				: "fill-muted text-muted-foreground"
																			}`}
																	/>
																))}
															</div>
															<span className="text-sm text-muted-foreground">
																{review.date}
															</span>
														</div>
													</div>
												</div>
												<p className="mt-4 text-muted-foreground leading-relaxed">
													{review.comment}
												</p>
											</Card>
										))}
									</div>

									<Button variant="outline" className="w-full bg-transparent">
										Load More Reviews
									</Button>
								</div>
							</TabsContent>

							<TabsContent value="shipping" className="mt-8">
								<div className="grid gap-8 md:grid-cols-2">
									<div>
										<h3 className="mb-4 text-lg font-semibold">
											Shipping Information
										</h3>
										<div className="space-y-4 text-muted-foreground">
											<p>
												<strong className="text-foreground">
													Standard Shipping:
												</strong>{" "}
												5-7 business days - Free on orders over $50
											</p>
											<p>
												<strong className="text-foreground">
													Express Shipping:
												</strong>{" "}
												2-3 business days - $15
											</p>
											<p>
												<strong className="text-foreground">Overnight:</strong>{" "}
												1 business day - $30
											</p>
											<p>
												Orders are processed within 1-2 business days. You will
												receive a tracking number once your order ships.
											</p>
										</div>
									</div>
									<div>
										<h3 className="mb-4 text-lg font-semibold">
											Return Policy
										</h3>
										<div className="space-y-4 text-muted-foreground">
											<p>
												We offer a 30-day return policy for most items. Products
												must be returned in their original condition with all
												packaging.
											</p>
											<p>
												<strong className="text-foreground">
													To initiate a return:
												</strong>
											</p>
											<ul className="space-y-2">
												<li>• Contact the vendor through your order page</li>
												<li>• Receive return authorization and instructions</li>
												<li>• Ship the item back with tracking</li>
												<li>• Refund processed within 5-7 business days</li>
											</ul>
										</div>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>

					<div className="mt-32">
						<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border/40 pb-10">
							<div>
								<Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-bold tracking-widest uppercase text-[10px]">
									Boutique Curation
								</Badge>
								<h2 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter">
									More from <span className="italic text-primary">{product.vendor.name}</span>
								</h2>
							</div>
							<Button variant="ghost" className="hidden md:flex font-bold tracking-widest text-xs uppercase text-zinc-400 hover:text-primary transition-colors" asChild>
								<Link href={`/vendors/${product.vendor.id}`}>View Full Gallery</Link>
							</Button>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{relatedProducts.map((relatedProduct) => (
								<ProductCard
									key={relatedProduct.id}
									id={relatedProduct.id}
									name={relatedProduct.name}
									image={relatedProduct.image}
									price={relatedProduct.price.toString()}
									vendor={relatedProduct.vendor}
								/>
							))}
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
