"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Eye, Star, Plus, Minus, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useCart, useAddToCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import { toast } from "sonner";

interface ProductCardProps {
	id: string;
	name: string;
	vendor: string;
	price: string | number;
	image?: string;
	inStock?: boolean;
	featured?: boolean;
	rating?: number;
	className?: string;
}

export function ProductCard({
	id,
	name,
	vendor,
	price,
	image,
	inStock = true,
	featured = false,
	rating = 4.5,
	className,
}: ProductCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const numPrice = typeof price === "string" ? parseFloat(price) : price;
	const displayPrice = typeof price === "number" ? `$${price.toLocaleString()}` : (price || "$0.00");

	// Hooks
	const { data: wishlistData } = useWishlist();
	const { data: cartData } = useCart();
	const addToWishlist = useAddToWishlist();
	const removeFromWishlist = useRemoveFromWishlist();
	const addToCart = useAddToCart();
	const updateCartQuantity = useUpdateCartQuantity();

	// Derived State
	const isWishlisted = wishlistData?.data?.wishlist?.productIds?.includes(id);

	// Safe cart access
	const cartItems = cartData?.data?.cart?.items || [];
	const cartItem = cartItems.find((item: any) => item.productId === id);
	const quantityInCart = cartItem ? cartItem.quantity : 0;

	// Note: We don't have max stock here on the card list view usually. 
	// Ideally we should pass it as prop, but if not available we can just let users add. 
	// Backend limits will prevent success if over stock.
	// For now let's assume if it is "inStock" prop (boolean), we allow adding reasonably.

	const handleWishlistToggle = (e: React.MouseEvent) => {
		e.preventDefault(); // Prevent link navigation
		if (isWishlisted) {
			removeFromWishlist.mutate(id);
		} else {
			addToWishlist.mutate(id);
		}
	};

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		addToCart.mutate({
			productId: id,
			quantity: 1,
			price: numPrice || 0,
			name: name,
		});
	};

	const handleUpdateQuantity = (e: React.MouseEvent, newQty: number) => {
		e.preventDefault();
		if (newQty < 0) return;
		// If newQty is 0, backend might handle it or we explicitly remove? 
		// Our hook doesn't auto-remove on 0 usually, but let's just allow updates >= 1 here for "calculator" style.
		// If user wants to remove, they might need a explicit remove button or go to 0. 
		// For card UI, usually - / + keeps it in cart.
		if (newQty === 0) return; // Keeping simple for card view

		updateCartQuantity.mutate({
			productId: id,
			quantity: newQty
		});
	};


	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -8 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className={cn("group h-full", className)}
		>
			<Card className="relative h-full overflow-hidden border-0 bg-transparent shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
				{/* Image Container */}
				<Link href={`/buyer/dashboard/marketplace/${id}`}>
					<div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted/20 border border-white/5">
						<AnimatePresence>
							<motion.img
								src={image || "/placeholder-product.png"}
								alt={name}
								className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
								style={{ filter: isHovered ? "brightness(0.9)" : "brightness(1)" }}
							/>
						</AnimatePresence>

						{/* Overlays & Badges */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

						<div className="absolute left-4 top-4 flex flex-col gap-2">
							{featured && (
								<Badge className="w-fit bg-primary/90 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
									Featured
								</Badge>
							)}
							{!inStock && (
								<Badge variant="secondary" className="w-fit bg-background/80 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
									Out of Stock
								</Badge>
							)}
							{quantityInCart > 0 && (
								<Badge className="w-fit bg-green-500/90 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md text-white">
									In Cart
								</Badge>
							)}
						</div>

						{/* Quick Actions Overlay (Cart logic inside) */}
						<div className="absolute bottom-4 left-4 right-4 flex translate-y-4 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
							{/* Left side actions (Quick View) */}
							<Button
								size="sm"
								className="rounded-full bg-white/10 text-white backdrop-blur-xl hover:bg-white hover:text-black border-white/20 h-9 px-3 text-xs"
							>
								<Eye className="mr-2 h-3.5 w-3.5" />
								Quick View
							</Button>

							{/* Right side actions (Wishlist & Cart) */}
							<div className="flex gap-2 items-center">
								<Button
									size="icon"
									variant="ghost"
									onClick={handleWishlistToggle}
									className={cn(
										"h-9 w-9 rounded-full backdrop-blur-xl border transition-colors",
										isWishlisted
											? "bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30"
											: "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black"
									)}
								>
									<Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
								</Button>

								{/* Cart Logic */}
								{quantityInCart > 0 ? (
									<div className="flex items-center bg-primary rounded-full h-9 px-1 shadow-xl shadow-primary/20" onClick={(e) => e.preventDefault()}>
										<button
											onClick={(e) => handleUpdateQuantity(e, quantityInCart - 1)}
											className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-black/20 text-white transition-colors"
											disabled={updateCartQuantity.isPending}
										>
											{updateCartQuantity.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
										</button>
										<span className="w-6 text-center text-xs font-bold text-white">{quantityInCart}</span>
										<button
											onClick={(e) => handleUpdateQuantity(e, quantityInCart + 1)}
											className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-black/20 text-white transition-colors"
											disabled={updateCartQuantity.isPending}
										>
											{updateCartQuantity.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
										</button>
									</div>
								) : (
									<Button
										size="icon"
										disabled={!inStock}
										onClick={handleAddToCart}
										className="h-9 w-9 rounded-full bg-primary shadow-xl shadow-primary/20 hover:bg-primary/90 text-white"
									>
										{addToCart.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
									</Button>
								)}
							</div>
						</div>
					</div>
				</Link>

				{/* Content */}
				<div className="mt-6 space-y-1 px-1">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
							{vendor}
						</span>
						<div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
							<Star className="h-3 w-3 fill-current" />
							{rating}
						</div>
					</div>

					<Link href={`/buyer/dashboard/marketplace/${id}`} className="block group/title">
						<h3 className="font-serif text-xl font-bold leading-tight decoration-primary/30 underline-offset-4 group-hover/title:underline text-zinc-200">
							{name}
						</h3>
					</Link>

					<div className="flex items-center justify-between pt-2">
						<span className="text-lg font-bold tracking-tight text-white">
							{displayPrice}
						</span>
						<div className="h-px flex-1 mx-4 bg-zinc-800" />
						<span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							Shop Now
						</span>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
