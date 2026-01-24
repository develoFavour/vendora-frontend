"use client";

import React, { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Heart,
	ShoppingCart,
	ChevronLeft,
	ShieldCheck,
	Truck,
	RotateCcw,
	Star,
	Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePublicProductById } from "@/hooks/use-products";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart, useCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	// Data Fetching
	const { data: product, isLoading: isProductLoading } = usePublicProductById(id);
	const { data: wishlist } = useWishlist();
	const { data: cart } = useCart();

	// Mutations
	const addToWishlist = useAddToWishlist();
	const removeFromWishlist = useRemoveFromWishlist();
	const addToCart = useAddToCart();
	const updateCartQuantity = useUpdateCartQuantity();

	// Local State
	const [activeImage, setActiveImage] = useState(0);
	const [selectedVariant, setSelectedVariant] = useState<any>(null); // To store selected variant object

	// Derived State
	const isWishlisted = wishlist?.data?.wishlist?.productIds?.includes(id);

	// Determine if item is in cart
	// Backend response structure: { success: true, message: "...", data: { cart: { items: [] } } }
	// So `cart` variable (from useQuery) is the top level object.
	const cartItems = cart?.data?.cart?.items || [];
	const cartItem = cartItems.find((item: any) => item.productId === id);
	const quantityInCart = cartItem ? cartItem.quantity : 0;

	useEffect(() => {
		if (product && product.hasVariants && product.variants?.length > 0) {
			setSelectedVariant(product.variants[0]);
		}
	}, [product]);

	if (isProductLoading) {
		return (
			<div className="min-h-screen bg-transparent p-4 md:p-8 flex items-center justify-center">
				<div className="text-white">Loading artifact...</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-transparent p-4 md:p-8 flex flex-col items-center justify-center text-white space-y-4">
				<h1 className="text-3xl font-bold">Artifact Not Found</h1>
				<Link href="/buyer/dashboard/marketplace">
					<Button variant="outline">Return to Marketplace</Button>
				</Link>
			</div>
		);
	}

	const handleWishlistToggle = () => {
		if (isWishlisted) {
			removeFromWishlist.mutate(id);
		} else {
			addToWishlist.mutate(id);
		}
	};

	const currentPrice = selectedVariant ? selectedVariant.price : product.price;
	const isStockAvailable = selectedVariant
		? selectedVariant.stock > 0
		: product.stock > 0;

	const maxStock = selectedVariant ? selectedVariant.stock : product.stock;

	const handleAddToCart = () => {
		if (quantityInCart >= maxStock) {
			toast.error("Max available stock reached");
			return;
		}
		addToCart.mutate({
			productId: id,
			quantity: 1,
			price: currentPrice,
			name: product.name,
		});
	};

	const handleUpdateQuantity = (newQty: number) => {
		if (newQty > maxStock) {
			toast.error("Cannot add more than available stock");
			return;
		}
		if (newQty < 1) return;
		updateCartQuantity.mutate({
			productId: id,
			quantity: newQty
		});
	};

	return (
		<div className="min-h-screen bg-transparent p-4 md:p-8">
			{/* Breadcrumbs / Back */}
			<div className="mb-8 flex items-center justify-between">
				<Button variant="ghost" asChild className="rounded-full group text-zinc-300 hover:text-white hover:bg-white/10">
					<Link href="/buyer/dashboard/marketplace">
						<ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
						Back to Marketplace
					</Link>
				</Button>
				<div className="flex gap-2">
					<Button
						size="icon"
						variant="outline"
						className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
							toast.success("Link copied to clipboard");
						}}
					>
						<Share2 className="h-4 w-4" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						className={cn(
							"rounded-full border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white",
							isWishlisted && "bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20"
						)}
						onClick={handleWishlistToggle}
						disabled={addToWishlist.isPending || removeFromWishlist.isPending}
					>
						<Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
					</Button>
				</div>
			</div>

			<div className="grid gap-12 lg:grid-cols-2">
				{/* Immersive Gallery Section */}
				<section className="space-y-6">
					<div className="group relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-zinc-900 border border-white/5 shadow-2xl">
						<AnimatePresence mode="wait">
							<motion.img
								key={activeImage}
								src={product.images && product.images.length > 0 ? product.images[activeImage] : ""}
								alt={product.name}
								initial={{ opacity: 0, scale: 1.1 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.9 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className="h-full w-full object-cover"
							/>
						</AnimatePresence>

						{product.images && product.images.length > 1 && (
							<div className="absolute inset-x-4 bottom-8 flex justify-center gap-2">
								{product.images.map((_: any, idx: number) => (
									<button
										key={idx}
										onClick={() => setActiveImage(idx)}
										className={cn(
											"h-1.5 rounded-full transition-all duration-300",
											activeImage === idx
												? "w-8 bg-white shadow-lg"
												: "w-2 bg-white/40 hover:bg-white/60"
										)}
									/>
								))}
							</div>
						)}
					</div>

					{product.images && product.images.length > 1 && (
						<div className="grid grid-cols-4 gap-4">
							{product.images.map((img: string, idx: number) => (
								<button
									key={idx}
									onClick={() => setActiveImage(idx)}
									className={cn(
										"relative aspect-square overflow-hidden rounded-2xl border-2 transition-all bg-zinc-900",
										activeImage === idx
											? "border-primary opacity-100 scale-95"
											: "border-transparent opacity-60 hover:opacity-100 hover:border-white/20"
									)}
								>
									<img src={img} alt="" className="h-full w-full object-cover" />
								</button>
							))}
						</div>
					)}
				</section>

				{/* Intelligent Product Info Section */}
				<section className="flex flex-col text-white">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-8"
					>
						{/* Vendor Header */}
						<div className="flex items-center justify-between">
							<Link
								href={`/buyer/dashboard/marketplace/vendors/${product.vendorId}`}
								className="flex items-center gap-3 group"
							>
								{/* Placeholder for Vendor Avatar if not available in product data directly */}
								<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-primary/20">
									V
								</div>
								<div>
									<div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
										Certified Boutique
									</div>
									<div className="font-serif text-lg font-bold group-hover:text-primary transition-colors text-zinc-200">
										View Vendor Store
									</div>
								</div>
							</Link>
							<div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-bold text-amber-500 border border-amber-500/20">
								<Star className="h-3 w-3 fill-current" />
								{product.rating || "New"}
								<span className="text-amber-500/50 mx-1">|</span>
								{product.reviewCount || 0} Reviews
							</div>
						</div>

						{/* Product Title & Price */}
						<div className="space-y-4">
							<h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
								{product.name}
							</h1>
							<div className="flex items-baseline gap-4">
								<span className="text-4xl font-bold tracking-tighter text-white">
									${currentPrice.toLocaleString()}
								</span>
								{isStockAvailable ? (
									<Badge
										variant="outline"
										className="border-primary/20 bg-primary/10 text-primary rounded-full px-4 py-1 font-bold"
									>
										In Stock • Limited Quantity
									</Badge>

								) : (
									<Badge
										variant="outline"
										className="border-red-500/20 bg-red-500/10 text-red-500 rounded-full px-4 py-1 font-bold"
									>
										Sold Out
									</Badge>
								)}

							</div>
						</div>

						<div className="text-lg text-zinc-400 leading-relaxed italic border-l-2 border-primary/30 pl-6 py-2">
							{product.description}
						</div>

						{/* Variant Selector */}
						{product.hasVariants && product.variants && (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
										Select Option
									</h3>
									<span className="text-xs font-medium text-zinc-500">
										{selectedVariant?.options && Object.values(selectedVariant.options).join(" / ")}
									</span>
								</div>
								<div className="flex flex-wrap gap-3">
									{product.variants.map((v: any) => (
										<button
											key={v.id}
											disabled={v.stock <= 0}
											onClick={() => setSelectedVariant(v)}
											className={cn(
												"relative flex h-14 min-w-[120px] items-center justify-center rounded-2xl border-2 px-6 transition-all",
												selectedVariant?.id === v.id
													? "border-primary bg-primary/10 text-white shadow-lg shadow-primary/10"
													: "border-white/10 text-zinc-400 hover:border-primary/40 hover:text-white",
												v.stock <= 0 &&
												"opacity-40 grayscale cursor-not-allowed border-dashed"
											)}
										>
											<span className="font-bold text-sm tracking-tight">
												{v.options && Object.values(v.options).join(" / ")}
											</span>
											{v.stock <= 0 && (
												<div className="absolute -top-2 -right-2 bg-zinc-800 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-zinc-700">
													Sold Out
												</div>
											)}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							{quantityInCart > 0 ? (
								<div className="flex items-center h-16 flex-1 rounded-2xl border border-primary/20 bg-primary/5 px-4 justify-between">
									<span className="text-sm font-bold text-primary uppercase tracking-wider pl-2">In your cart</span>
									<div className="flex items-center gap-3 bg-zinc-900 rounded-xl p-1.5 border border-white/10">
										<button
											onClick={() => handleUpdateQuantity(quantityInCart - 1)}
											className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white"
										>
											<span className="text-lg font-bold">-</span>
										</button>
										<span className="text-lg font-bold w-4 text-center text-white">{quantityInCart}</span>
										<button
											onClick={() => handleUpdateQuantity(quantityInCart + 1)}
											disabled={quantityInCart >= maxStock}
											className={cn(
												"h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors text-white",
												quantityInCart >= maxStock && "opacity-50 cursor-not-allowed"
											)}

										>
											<span className="text-lg font-bold">+</span>
										</button>
									</div>
								</div>
							) : (
								<Button
									size="lg"
									className="h-16 flex-1 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 group bg-primary hover:bg-primary/90 text-white"
									onClick={handleAddToCart}
									disabled={!isStockAvailable || addToCart.isPending}
								>
									<ShoppingCart className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
									{addToCart.isPending ? "Adding..." : "Add to cart"}
								</Button>
							)}

							<Button
								size="lg"
								variant="outline"
								className="h-16 flex-1 rounded-2xl text-lg font-bold border-white/10 hover:bg-white/5 text-zinc-300 transition-colors bg-transparent"
							>
								Buy Now
							</Button>
						</div>

						{/* Trust Features */}
						<div className="grid grid-cols-3 gap-4 pt-8">
							<div className="flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/5 text-center space-y-3">
								<Truck className="h-6 w-6 text-primary" />
								<div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
									Free Shipping
								</div>
								<div className="text-xs font-semibold text-zinc-300">Over $500</div>
							</div>
							<div className="flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/5 text-center space-y-3">
								<ShieldCheck className="h-6 w-6 text-primary" />
								<div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
									Authentic
								</div>
								<div className="text-xs font-semibold text-zinc-300">100% Quality</div>
							</div>
							<div className="flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/5 text-center space-y-3">
								<RotateCcw className="h-6 w-6 text-primary" />
								<div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
									Easy Returns
								</div>
								<div className="text-xs font-semibold text-zinc-300">30 Days</div>
							</div>
						</div>
					</motion.div>

					{/* Extended Info Tabs */}
					<div className="mt-12 pt-12 border-t border-white/10">
						<Tabs defaultValue="details" className="w-full">
							<TabsList className="w-full justify-start rounded-none border-b border-white/5 bg-transparent p-0">
								<TabsTrigger
									value="details"
									className="rounded-none border-b-2 border-transparent px-8 pb-4 text-sm font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white hover:text-zinc-300"
								>
									Details
								</TabsTrigger>
								<TabsTrigger
									value="process"
									className="rounded-none border-b-2 border-transparent px-8 pb-4 text-sm font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-white hover:text-zinc-300"
								>
									Process
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value="details"
								className="mt-8 space-y-4 text-zinc-400 leading-relaxed"
							>
								{product.variantOptions && product.variantOptions.length > 0 && (
									<div className="mb-4">
										<h4 className="font-bold text-zinc-200 mb-2">Specifications</h4>
										<ul className="list-disc pl-5">
											{product.variantOptions.map((opt: any, idx: number) => (
												<li key={idx}>
													<span className="text-zinc-300">{opt.name}:</span> {opt.values.join(", ")}
												</li>
											))}
										</ul>
									</div>
								)}
								{product.dimensions && (
									<div className="mb-4">
										<h4 className="font-bold text-zinc-200 mb-2">Dimensions</h4>
										<p className="text-sm">
											{product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
										</p>
									</div>
								)}
							</TabsContent>
							<TabsContent
								value="process"
								className="mt-8 text-sm text-zinc-400 leading-relaxed"
							>
								Our artisans take immense pride in their craft. Every order
								undergoes a rigorous quality check before being carefully
								nestled in our sustainable, eco-friendly packaging. We ship
								within 2-4 business days via global luxury couriers to ensure
								your treasure arrives in perfect condition.
							</TabsContent>
						</Tabs>
					</div>
				</section>
			</div>

			{/* Sticky Buy Bar for Mobile */}
			<div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
				<Card className="flex items-center justify-between p-4 bg-zinc-950 text-white rounded-[2rem] shadow-2xl border-white/10 backdrop-blur-xl bg-opacity-90">
					<div className="flex flex-col pl-2">
						<span className="text-xs font-bold uppercase tracking-widest opacity-60">
							Collect Now
						</span>
						<span className="text-xl font-bold">${currentPrice.toLocaleString()}</span>
					</div>
					<Button
						className="rounded-full px-8 font-bold h-12 shadow-xl shadow-primary/20 bg-primary text-white"
						onClick={handleAddToCart}
						disabled={!isStockAvailable || addToCart.isPending}
					>
						Add to Bag
					</Button>
				</Card>
			</div>
		</div>
	);
}
