"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, CreditCard, Lock, Store } from "lucide-react";

export default function CheckoutPage() {
	const [paymentMethod, setPaymentMethod] = useState("card");

	const cartByVendor = [
		{
			vendor: { name: "Artisan Pottery Co." },
			items: [
				{ name: "Handcrafted Ceramic Vase", price: 89.99, quantity: 1 },
				{ name: "Ceramic Bowl Set", price: 65.0, quantity: 2 },
			],
		},
		{
			vendor: { name: "EcoStyle Goods" },
			items: [{ name: "Organic Cotton Tote Bag", price: 34.99, quantity: 1 }],
		},
	];

	const subtotal = 254.98;
	// const shipping = 0;
	const tax = 20.4;
	const total = 275.38;

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Header */}
			<section className="border-b border-border bg-muted/30">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
						<Link href="/cart">
							<ChevronLeft className="mr-1 h-4 w-4" />
							Back to Cart
						</Link>
					</Button>
					<h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
						Checkout
					</h1>
				</div>
			</section>

			{/* Checkout Content */}
			<section className="flex-1 py-8 sm:py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-3">
						{/* Checkout Form */}
						<div className="lg:col-span-2 space-y-6">
							{/* Shipping Information */}
							<Card className="p-6">
								<h2 className="mb-6 text-xl font-semibold">
									Shipping Information
								</h2>
								<div className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<div>
											<Label htmlFor="firstName">First Name</Label>
											<Input id="firstName" placeholder="John" />
										</div>
										<div>
											<Label htmlFor="lastName">Last Name</Label>
											<Input id="lastName" placeholder="Doe" />
										</div>
									</div>

									<div>
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="john@example.com"
										/>
									</div>

									<div>
										<Label htmlFor="phone">Phone Number</Label>
										<Input id="phone" type="tel" placeholder="(555) 123-4567" />
									</div>

									<div>
										<Label htmlFor="address">Street Address</Label>
										<Input id="address" placeholder="123 Main St" />
									</div>

									<div className="grid gap-4 sm:grid-cols-3">
										<div>
											<Label htmlFor="city">City</Label>
											<Input id="city" placeholder="Portland" />
										</div>
										<div>
											<Label htmlFor="state">State</Label>
											<Input id="state" placeholder="OR" />
										</div>
										<div>
											<Label htmlFor="zip">ZIP Code</Label>
											<Input id="zip" placeholder="97201" />
										</div>
									</div>

									<div className="flex items-center space-x-2">
										<Checkbox id="saveAddress" />
										<Label
											htmlFor="saveAddress"
											className="text-sm font-normal cursor-pointer"
										>
											Save this address for future orders
										</Label>
									</div>
								</div>
							</Card>

							{/* Payment Method */}
							<Card className="p-6">
								<h2 className="mb-6 text-xl font-semibold">Payment Method</h2>
								<RadioGroup
									value={paymentMethod}
									onValueChange={setPaymentMethod}
									className="space-y-4"
								>
									<div className="flex items-center space-x-3 rounded-lg border border-border p-4">
										<RadioGroupItem value="card" id="card" />
										<Label
											htmlFor="card"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<CreditCard className="h-5 w-5 text-muted-foreground" />
											<span>Credit / Debit Card</span>
										</Label>
									</div>
									<div className="flex items-center space-x-3 rounded-lg border border-border p-4">
										<RadioGroupItem value="paypal" id="paypal" />
										<Label
											htmlFor="paypal"
											className="flex flex-1 cursor-pointer items-center gap-3"
										>
											<div className="h-5 w-5 rounded bg-muted" />
											<span>PayPal</span>
										</Label>
									</div>
								</RadioGroup>

								{paymentMethod === "card" && (
									<div className="mt-6 space-y-4">
										<div>
											<Label htmlFor="cardNumber">Card Number</Label>
											<Input
												id="cardNumber"
												placeholder="1234 5678 9012 3456"
											/>
										</div>
										<div className="grid gap-4 sm:grid-cols-2">
											<div>
												<Label htmlFor="expiry">Expiry Date</Label>
												<Input id="expiry" placeholder="MM/YY" />
											</div>
											<div>
												<Label htmlFor="cvv">CVV</Label>
												<Input id="cvv" placeholder="123" />
											</div>
										</div>
										<div>
											<Label htmlFor="cardName">Name on Card</Label>
											<Input id="cardName" placeholder="John Doe" />
										</div>
									</div>
								)}
							</Card>

							{/* Terms */}
							<div className="flex items-start space-x-2">
								<Checkbox id="terms" />
								<Label
									htmlFor="terms"
									className="text-sm font-normal leading-relaxed cursor-pointer"
								>
									I agree to the{" "}
									<Link href="/terms" className="text-primary hover:underline">
										Terms & Conditions
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-primary hover:underline"
									>
										Privacy Policy
									</Link>
								</Label>
							</div>
						</div>

						{/* Order Summary */}
						<div className="lg:col-span-1">
							<Card className="sticky top-24 p-6">
								<h2 className="mb-6 text-xl font-semibold">Order Summary</h2>

								{/* Items by Vendor */}
								<div className="mb-6 space-y-4">
									{cartByVendor.map((vendorGroup, index) => (
										<div key={index}>
											<div className="mb-3 flex items-center gap-2 text-sm font-medium">
												<Store className="h-4 w-4 text-muted-foreground" />
												{vendorGroup.vendor.name}
											</div>
											<div className="space-y-2">
												{vendorGroup.items.map((item, itemIndex) => (
													<div
														key={itemIndex}
														className="flex justify-between text-sm"
													>
														<span className="text-muted-foreground">
															{item.name} × {item.quantity}
														</span>
														<span className="font-medium">
															${(item.price * item.quantity).toFixed(2)}
														</span>
													</div>
												))}
											</div>
											{index < cartByVendor.length - 1 && (
												<Separator className="mt-4" />
											)}
										</div>
									))}
								</div>

								<Separator className="my-6" />

								{/* Price Breakdown */}
								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span className="font-medium">${subtotal.toFixed(2)}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Shipping</span>
										<span className="font-medium text-primary">Free</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Tax</span>
										<span className="font-medium">${tax.toFixed(2)}</span>
									</div>
								</div>

								<Separator className="my-6" />

								{/* Total */}
								<div className="mb-6 flex justify-between">
									<span className="text-lg font-semibold">Total</span>
									<span className="text-lg font-bold">${total.toFixed(2)}</span>
								</div>

								{/* Place Order Button */}
								<Button size="lg" className="w-full">
									<Lock className="mr-2 h-5 w-5" />
									Place Order
								</Button>

								<p className="mt-4 text-center text-xs text-muted-foreground">
									Your payment information is secure and encrypted
								</p>
							</Card>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
