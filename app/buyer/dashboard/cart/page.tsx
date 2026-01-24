"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart, useRemoveFromCart, useUpdateCartQuantity, useClearCart } from "@/hooks/use-cart";
import { toast } from "sonner";

export default function CartPage() {
	const { data: cartData, isLoading } = useCart();
	const removeFromCart = useRemoveFromCart();
	const updateQuantity = useUpdateCartQuantity();
	const clearCart = useClearCart();

	const cartItems = useMemo(() => cartData?.data?.cart?.items || [], [cartData]);

	const subtotal = useMemo(() => {
		return cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
	}, [cartItems]);

	const shippingEstimate = subtotal > 500 ? 0 : 25; // Simple logic matching product page
	const total = subtotal + shippingEstimate;

	const handleUpdateQuantity = (productId: string, newQty: number) => {
		if (newQty < 1) return;
		updateQuantity.mutate({ productId, quantity: newQty });
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-pulse text-zinc-500 font-bold tracking-widest uppercase text-sm">Loading Cart...</div>
			</div>
		);
	}

	if (cartItems.length === 0) {
		return (
			<div className="min-h-screen p-6 md:p-10 flex flex-col items-center justify-center space-y-6 text-center">
				<div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
					<ShoppingCart className="h-10 w-10 text-zinc-600" />
				</div>
				<h1 className="text-4xl font-serif font-bold text-white">Your cart is empty</h1>
				<p className="text-zinc-400 max-w-md">
					Looking for inspiration? Explore our curated marketplace to find your next artisan treasure.
				</p>
				<Link href="/buyer/dashboard/marketplace">
					<Button size="lg" className="rounded-full px-8 bg-white text-black hover:bg-zinc-200">
						Explore Marketplace
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
			<header className="mb-12">
				<h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Shopping Cart</h1>
				<p className="text-zinc-400">
					You have <span className="text-primary font-bold">{cartItems.length} items</span> in your cart.
				</p>
			</header>

			<div className="grid lg:grid-cols-3 gap-12">
				{/* Cart Items List */}
				<div className="lg:col-span-2 space-y-6">
					<AnimatePresence mode="popLayout">
						{cartItems.map((item: any) => (
							<motion.div
								key={item.productId}
								layout
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, x: -100 }}
								className="group relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/5 p-4 sm:p-6 transition-all hover:border-white/10"
							>
								<div className="flex gap-6">
									{/* Product Image */}
									<div className="relative aspect-square h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
										<img
											src={item.image || "/placeholder-product.png"}
											alt={item.name}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									</div>

									{/* Content */}
									<div className="flex flex-1 flex-col justify-between">
										<div className="flex justify-between items-start gap-4">
											<div>
												<h3 className="font-bold text-lg text-white mb-1 line-clamp-1">
													<Link href={`/buyer/dashboard/marketplace/${item.productId}`} className="hover:text-primary transition-colors">
														{item.name}
													</Link>
												</h3>
												<p className="text-sm text-zinc-500 font-medium">${item.price.toLocaleString()}</p>
											</div>
											<button
												onClick={() => removeFromCart.mutate(item.productId)}
												className="text-zinc-500 hover:text-red-500 transition-colors p-1"
												disabled={removeFromCart.isPending}
											>
												<Trash2 className="h-5 w-5" />
											</button>
										</div>

										<div className="flex items-center justify-between mt-4">
											{/* Quantity Control */}
											<div className="flex items-center bg-zinc-950 rounded-xl border border-white/5 p-1">
												<button
													onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
													className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors disabled:opacity-50"
													disabled={updateQuantity.isPending || item.quantity <= 1}
												>
													<Minus className="h-3 w-3" />
												</button>
												<span className="w-10 text-center text-sm font-bold text-white tabular-nums">
													{item.quantity}
												</span>
												<button
													onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
													className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors disabled:opacity-50"
													disabled={updateQuantity.isPending}
												>
													<Plus className="h-3 w-3" />
												</button>
											</div>

											<div className="text-right">
												<span className="text-lg font-bold text-white">
													${(item.price * item.quantity).toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>

					<div className="flex justify-end pt-4">
						<Button
							variant="ghost"
							className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
							onClick={() => {
								if (confirm("Are you sure you want to clear your cart?")) {
									clearCart.mutate();
								}
							}}
							disabled={clearCart.isPending}
						>
							Clear Cart
						</Button>
					</div>
				</div>

				{/* Summary Card */}
				<div className="lg:col-span-1">
					<div className="sticky top-24 rounded-[2rem] bg-zinc-900 border border-white/5 p-8 shadow-2xl">
						<h2 className="text-2xl font-serif font-bold text-white mb-8">Order Summary</h2>

						<div className="space-y-4 mb-8">
							<div className="flex justify-between text-zinc-400">
								<span>Subtotal</span>
								<span className="text-white font-medium">${subtotal.toLocaleString()}</span>
							</div>
							<div className="flex justify-between text-zinc-400">
								<span>Shipping Estimate</span>
								<span className="text-white font-medium">
									{shippingEstimate === 0 ? "Free" : `$${shippingEstimate}`}
								</span>
							</div>
							<div className="flex justify-between text-zinc-400">
								<span>Tax Estimate</span>
								<span className="text-white font-medium">Calculated at checkout</span>
							</div>
						</div>

						<Separator className="bg-white/10 mb-8" />

						<div className="flex justify-between items-baseline mb-8">
							<span className="text-lg font-bold text-white">Total</span>
							<span className="text-3xl font-bold text-white tracking-tight">
								${total.toLocaleString()}
							</span>
						</div>

						<Button asChild className="w-full h-14 text-lg font-bold rounded-xl bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5 group">
							<Link href="/buyer/dashboard/checkout">
								Checkout
								<ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Link>
						</Button>

						<div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500 font-medium">
							<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
							Secure Encrypted Checkout
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
