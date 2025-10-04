"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
	X,
	Plus,
	Minus,
	Store,
	ShoppingBag,
	ArrowRight,
	Tag,
} from "lucide-react";
import Image from "next/image";

interface CartItem {
	id: string;
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
	stock: number;
}

export default function CartPage() {
	const [promoCode, setPromoCode] = useState("");

	// Cart items grouped by vendor
	const cartByVendor = [
		{
			vendor: {
				id: "1",
				name: "Artisan Pottery Co.",
				location: "Portland, OR",
			},
			items: [
				{
					id: "1",
					productId: "1",
					name: "Handcrafted Ceramic Vase",
					price: 89.99,
					quantity: 1,
					image:
						"https://parkergibbs.com/products/handcrafted-textured-ceramic-vase",
					stock: 12,
				},
				{
					id: "2",
					productId: "2",
					name: "Ceramic Bowl Set",
					price: 65.0,
					quantity: 2,
					image:
						"https://rusticreach.com/products/white-textured-porcelain-ceramic-jar-vase",
					stock: 8,
				},
			],
		},
		{
			vendor: {
				id: "2",
				name: "EcoStyle Goods",
				location: "Austin, TX",
			},
			items: [
				{
					id: "3",
					productId: "3",
					name: "Organic Cotton Tote Bag",
					price: 34.99,
					quantity: 1,
					image:
						"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80",
					stock: 25,
				},
			],
		},
	];

	const calculateVendorSubtotal = (items: CartItem[]) => {
		return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	};

	const calculateTotal = () => {
		return cartByVendor.reduce(
			(sum, vendor) => sum + calculateVendorSubtotal(vendor.items),
			0
		);
	};

	const totalItems = cartByVendor.reduce(
		(sum, vendor) =>
			sum + vendor.items.reduce((s, item) => s + item.quantity, 0),
		0
	);

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Header */}
			<section className="border-b border-border bg-muted/30">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
						Shopping Cart
					</h1>
					<p className="mt-2 text-muted-foreground">
						{totalItems} {totalItems === 1 ? "item" : "items"} from{" "}
						{cartByVendor.length}{" "}
						{cartByVendor.length === 1 ? "vendor" : "vendors"}
					</p>
				</div>
			</section>

			{/* Cart Content */}
			<section className="flex-1 py-8 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-3">
						{/* Cart Items */}
						<div className="lg:col-span-2 space-y-6">
							{cartByVendor.map((vendorGroup) => (
								<Card key={vendorGroup.vendor.id} className="p-6">
									{/* Vendor Header */}
									<div className="mb-6 flex items-center justify-between border-b border-border pb-4">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<Store className="h-5 w-5 text-primary" />
											</div>
											<div>
												<Link
													href={`/vendors/${vendorGroup.vendor.id}`}
													className="font-semibold hover:underline"
												>
													{vendorGroup.vendor.name}
												</Link>
												<p className="text-sm text-muted-foreground">
													{vendorGroup.vendor.location}
												</p>
											</div>
										</div>
										<Badge variant="secondary">
											Subtotal: $
											{calculateVendorSubtotal(vendorGroup.items).toFixed(2)}
										</Badge>
									</div>

									{/* Vendor Items */}
									<div className="space-y-4">
										{vendorGroup.items.map((item) => (
											<div key={item.id}>
												<div className="flex gap-4">
													{/* Product Image */}
													<Link
														href={`/products/${item.productId}`}
														className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border"
													>
														<Image
															height={100}
															width={100}
															src={item.image || "/placeholder.svg"}
															alt={item.name}
															className="h-full w-full object-cover"
														/>
													</Link>

													{/* Product Details */}
													<div className="flex flex-1 flex-col justify-between">
														<div className="flex justify-between">
															<div>
																<Link
																	href={`/products/${item.productId}`}
																	className="font-medium hover:underline"
																>
																	{item.name}
																</Link>
																<p className="mt-1 text-sm text-muted-foreground">
																	${item.price.toFixed(2)} each
																</p>
															</div>
															<Button
																variant="ghost"
																size="sm"
																className="h-8 w-8 p-0"
															>
																<X className="h-4 w-4" />
															</Button>
														</div>

														<div className="flex items-center justify-between">
															{/* Quantity Controls */}
															<div className="flex items-center gap-2">
																<div className="flex items-center border border-border rounded-md">
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-8 w-8 p-0"
																	>
																		<Minus className="h-3 w-3" />
																	</Button>
																	<span className="w-10 text-center text-sm">
																		{item.quantity}
																	</span>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-8 w-8 p-0"
																	>
																		<Plus className="h-3 w-3" />
																	</Button>
																</div>
																{item.stock < 10 && (
																	<span className="text-xs text-accent">
																		Only {item.stock} left
																	</span>
																)}
															</div>

															{/* Item Total */}
															<span className="font-semibold">
																${(item.price * item.quantity).toFixed(2)}
															</span>
														</div>
													</div>
												</div>
												{vendorGroup.items.indexOf(item) <
													vendorGroup.items.length - 1 && (
													<Separator className="mt-4" />
												)}
											</div>
										))}
									</div>
								</Card>
							))}

							{/* Continue Shopping */}
							<Button
								variant="outline"
								asChild
								className="w-full bg-transparent"
							>
								<Link href="/marketplace">
									<ShoppingBag className="mr-2 h-4 w-4" />
									Continue Shopping
								</Link>
							</Button>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<Card className="sticky top-24 p-6">
								<h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

								<div className="space-y-4">
									{/* Promo Code */}
									<div>
										<label className="mb-2 block text-sm font-medium">
											Promo Code
										</label>
										<div className="flex gap-2">
											<Input
												placeholder="Enter code"
												value={promoCode}
												onChange={(e) => setPromoCode(e.target.value)}
											/>
											<Button variant="outline">
												<Tag className="h-4 w-4" />
											</Button>
										</div>
									</div>

									<Separator />

									{/* Price Breakdown */}
									<div className="space-y-3">
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Subtotal</span>
											<span className="font-medium">
												${calculateTotal().toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Shipping</span>
											<span className="font-medium text-primary">Free</span>
										</div>
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">
												Tax (estimated)
											</span>
											<span className="font-medium">
												${(calculateTotal() * 0.08).toFixed(2)}
											</span>
										</div>
									</div>

									<Separator />

									{/* Total */}
									<div className="flex justify-between">
										<span className="text-lg font-semibold">Total</span>
										<span className="text-lg font-bold">
											${(calculateTotal() * 1.08).toFixed(2)}
										</span>
									</div>

									{/* Checkout Button */}
									<Button size="lg" className="w-full" asChild>
										<Link href="/checkout">
											Proceed to Checkout
											<ArrowRight className="ml-2 h-5 w-5" />
										</Link>
									</Button>

									{/* Trust Badges */}
									<div className="mt-6 space-y-2 text-xs text-muted-foreground">
										<p className="flex items-center gap-2">
											<span className="text-primary">✓</span> Secure checkout
										</p>
										<p className="flex items-center gap-2">
											<span className="text-primary">✓</span> Free shipping on
											orders over $50
										</p>
										<p className="flex items-center gap-2">
											<span className="text-primary">✓</span> 30-day return
											policy
										</p>
									</div>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
