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
	Loader2,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/auth-store";
import { useAddToCart } from "@/hooks/use-cart";
import { useGuestCartStore } from "@/stores/guest-cart-store";
import { toast } from "sonner";
import { usePublicCategories, usePublicProductById, useSimilarProducts, useProductReviews } from "@/hooks/use-public-products";

export default function ProductDetailPage() {
	const params = useParams();
	const id = params.id as string;
	const { data: product, isLoading: productLoading, isError: productError } = usePublicProductById(id);
	const { data: similarRes, isLoading: similarLoading } = useSimilarProducts(id);
	const { data: reviewRes, isLoading: reviewsLoading } = useProductReviews(id);

	const relatedProducts = similarRes?.data?.products || [];
	const productReviews = reviewRes?.data?.reviews || [];

	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);

	const { data: categoriesRes } = usePublicCategories();
	const categories = categoriesRes?.data?.categories || [];

	// Cart Hooks
	const { isAuthenticated } = useAuthStore();
	const addToCart = useAddToCart();
	const guestCart = useGuestCartStore();

	if (productLoading) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center space-y-4">
				<Loader2 className="h-12 w-12 animate-spin text-primary" />
				<p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Curating specifications...</p>
			</div>
		);
	}

	if (productError || !product) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center space-y-4">
				<Loader2 className="h-12 w-12 text-destructive" />
				<p className="text-destructive font-bold">Failed to load product details.</p>
				<Button variant="link" asChild><Link href="/marketplace">Back to Marketplace</Link></Button>
			</div>
		);
	}

	const categoryName = categories.find((c: any) => c.id === product.categoryId)?.name || "The Collection";

	const handleAddToCart = () => {
		if (isAuthenticated) {
			addToCart.mutate({
				productId: product.id,
				quantity,
				price: product.price,
				name: product.name
			});
		} else {
			guestCart.addItem({
				productId: product.id,
				name: product.name,
				price: product.price,
				quantity,
				image: product.images?.[0] || "/placeholder.svg",
				vendor: product.vendorName || "Artisan"
			});
			toast.success("Added to bag — sign in to checkout!");
		}
	};





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
							href={`/marketplace?category=${product.categoryId}`}
							className="hover:text-foreground"
						>
							{categoryName}
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
						<div className="space-y-4">
							<div className="aspect-square overflow-hidden rounded-lg border border-border bg-muted">
								<Image
									height={800}
									width={800}
									src={product.images?.[selectedImage] || "/placeholder.svg"}
									alt={product.name}
									className="h-full w-full object-cover transition-all duration-500"
								/>
							</div>
							{product.images?.length > 1 && (
								<div className="grid grid-cols-4 gap-4">
									{product.images.map((image, index) => (
										<button
											key={index}
											onClick={() => setSelectedImage(index)}
											className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${selectedImage === index
												? "border-primary"
												: "border-border hover:border-primary/50"
												}`}
										>
											<Image
												height={200}
												width={200}
												src={image || "/placeholder.svg"}
												alt={`${product.name} ${index + 1}`}
												className="h-full w-full object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Product Info */}
						<div className="space-y-6">
							<div>
								<div className="mb-4 flex items-center gap-3">
									<Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors py-1 px-4 text-[10px] font-bold uppercase tracking-widest">
										{categoryName}
									</Badge>
									{product.stock && product.stock < 15 && product.stock > 0 && (
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
										<span className="text-sm font-bold tracking-tight">{product.rating || "4.5"}</span>
									</div>
									<span className="text-sm text-zinc-400 font-medium tracking-wide">
										{product.reviewCount || "0"} Artisan Reviews
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
											<div className="h-full w-full bg-primary/10 flex items-center justify-center font-bold text-primary">
												{product.vendorName?.[0] || "V"}
											</div>
										</div>
										<div>
											<div className="flex items-center gap-2">
												<Link
													href={`/vendors/${product.vendorId}`}
													className="font-semibold hover:underline"
												>
													{product.vendorName || "Artisan"}
												</Link>
												<Badge variant="secondary" className="text-[9px] font-bold uppercase py-0 px-2 tracking-widest opacity-70">
													Verified
												</Badge>
											</div>
											<div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<MapPin className="h-3 w-3" />
													{product.vendorLocation || "The World"}
												</div>
												<div className="flex items-center gap-1">
													<Star className="h-3 w-3 fill-primary text-primary" />
													4.9
												</div>
											</div>
										</div>
									</div>
									<Button variant="outline" size="sm" asChild className="rounded-xl">
										<Link href={`/vendors/${product.vendorId}`}>
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
									<Button
										size="lg"
										className="flex-1 rounded-2xl h-14 font-bold tracking-widest uppercase text-xs shadow-xl shadow-primary/20"
										onClick={handleAddToCart}
										disabled={addToCart.isPending || product.stock === 0}
									>
										{addToCart.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
										{product.stock === 0 ? "Out of Stock" : "Add to Cart"}
									</Button>
									<Button size="lg" variant="outline" className="h-14 w-14 rounded-2xl border-border/40 bg-zinc-50/50">
										<Heart className="h-5 w-5" />
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
												<dt className="text-muted-foreground">Dimensions (H x W x L)</dt>
												<dd className="font-medium">
													{product.dimensions?.height || 0} x {product.dimensions?.width || 0} x {product.dimensions?.length || 0} cm
												</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Weight</dt>
												<dd className="font-medium">{product.dimensions?.weight || 0} kg</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Materials</dt>
												<dd className="font-medium">{product.brand || "Artisan Grade"}</dd>
											</div>
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Category</dt>
												<dd className="font-medium">{categoryName}</dd>
											</div>
										</dl>
									</div>
									{/* <div>
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
									</div> */}
								</div>
							</TabsContent>
							<TabsContent value="reviews" className="mt-8">
								<div className="grid gap-12 lg:grid-cols-3">
									<div className="lg:col-span-1">
										<h2 className="text-3xl font-bold tracking-tight mb-4">Artisan Reviews</h2>
										<div className="flex items-center gap-4 mb-6">
											<div className="text-5xl font-bold">{product.rating || "0.0"}</div>
											<div>
												<div className="flex mb-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`h-4 w-4 ${i < Math.floor(product.rating || 0)
																? "fill-primary text-primary"
																: "fill-muted text-muted-foreground"
																}`}
														/>
													))}
												</div>
												<p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
													Based on {product.reviewCount || 0} reviews
												</p>
											</div>
										</div>
										<Button className="w-full rounded-2xl h-12 font-bold tracking-widest uppercase text-xs">Share Your Experience</Button>
									</div>

									<div className="lg:col-span-2">
										<div className="space-y-10">
											{productReviews.length > 0 ? (
												productReviews.map((review: any) => (
													<div
														key={review.id}
														className="border-b border-border pb-10 last:border-0"
													>
														<div className="flex items-center justify-between mb-4">
															<div className="flex items-center gap-3">
																<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs uppercase">
																	{review.userName?.[0] || "U"}
																</div>
																<div>
																	<h4 className="font-bold text-sm tracking-tight text-black">
																		{review.userName}
																	</h4>
																	<div className="flex mt-0.5">
																		{[...Array(5)].map((_, i) => (
																			<Star
																				key={i}
																				className={`h-3 w-3 ${i < review.rating
																					? "fill-primary text-primary"
																					: "fill-muted text-muted-foreground"
																					}`}
																			/>
																		))}
																	</div>
																</div>
															</div>
															<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
																{formatDistanceToNow(new Date(review.createdAt))} ago
															</span>
														</div>
														<p className="text-zinc-400 leading-relaxed italic font-medium">
															&quot;{review.comment}&quot;
														</p>
														{review.response && (
															<div className="mt-6 ml-6 p-4 rounded-2xl bg-zinc-800/30 border-l-2 border-primary/40">
																<div className="flex items-center gap-2 mb-2">
																	<Store className="h-3 w-3 text-primary" />
																	<span className="text-[10px] font-bold uppercase tracking-widest text-primary">Artisan Response</span>
																</div>
																<p className="text-sm text-zinc-500 italic">&quot;{review.response}&quot;</p>
															</div>
														)}
													</div>
												))
											) : (
												<div className="py-20 text-center bg-muted/20 rounded-3xl border border-dashed border-border">
													<p className="text-muted-foreground font-medium italic">No artisan reviews yet for this masterpiece.</p>
												</div>
											)}
										</div>
									</div>
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
											<ul className="space-y-2 text-sm">
												<li className="flex gap-2"><span>-</span> <span>Contact the vendor through your order page</span></li>
												<li className="flex gap-2"><span>-</span> <span>Receive return authorization and instructions</span></li>
												<li className="flex gap-2"><span>-</span> <span>Ship the item back with tracking</span></li>
												<li className="flex gap-2"><span>-</span> <span>Refund processed within 5-7 business days</span></li>
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
									More from <span className="italic text-primary">{product.vendorName || "Artisan"}</span>
								</h2>
							</div>
							<Button variant="ghost" className="hidden md:flex font-bold tracking-widest text-xs uppercase text-zinc-400 hover:text-primary transition-colors" asChild>
								<Link href={`/vendors/${product.vendorId}`}>View Full Gallery</Link>
							</Button>
						</div>
						{relatedProducts.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{relatedProducts.map((relatedProduct) => (
									<ProductCard
										key={relatedProduct.id}
										id={relatedProduct.id}
										name={relatedProduct.name}
										image={relatedProduct.images?.[0] || "/placeholder.svg"}
										price={relatedProduct.price.toString()}
										vendor={product.vendorName || "Artisan"}
									/>
								))}
							</div>
						) : (
							<div className="py-20 text-center bg-muted/10 rounded-3xl border border-dashed border-border/40">
								<p className="text-muted-foreground font-medium italic">No similar pieces found in this curation.</p>
							</div>
						)}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
