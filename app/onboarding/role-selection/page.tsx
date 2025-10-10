"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function RoleSelectionPage() {
	const setRole = useOnboardingStore((state) => state.setRole);
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);

	const handleRoleSelection = (role: "customer" | "vendor") => {
		if (submitting) return;
		setSubmitting(true);
		setRole(role);
		toast.success(
			`Continuing as ${role === "customer" ? "Customer" : "Vendor"}`
		);

		// Redirect to main onboarding flow
		setTimeout(() => {
			router.push("/onboarding");
			setSubmitting(false);
		}, 300);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-terracotta/5 flex items-center justify-center p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/10 mb-8">
						<div className="w-10 h-10 rounded-full bg-sage-600" />
					</div>

					<Badge className="mb-4 bg-sage/10 text-sage border-sage/20">
						Welcome to Vendora
					</Badge>

					<h1 className="font-serif text-4xl md:text-5xl font-bold text-balance mb-4">
						How would you like to use Vendora?
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-2xl mx-auto">
						Join our community of makers, artisans, and conscious shoppers
						building a better marketplace together.
					</p>
				</div>

				{/* Role Selection Cards */}
				<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{/* Customer Card */}
					<Card className="relative overflow-hidden border-2 hover:border-sage-300 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group">
						<CardContent className="p-8">
							<div className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/10 mb-6 group-hover:bg-sage/20 transition-colors">
									<ShoppingBag className="w-8 h-8 text-sage-600" />
								</div>

								<h2 className="font-serif text-2xl font-bold mb-4">
									Shop Products
								</h2>

								<p className="text-muted-foreground leading-relaxed mb-6">
									Discover unique, handcrafted products from independent sellers
									and local artisans. Support small businesses while finding
									items you&apos;ll love.
								</p>

								<div className="space-y-3 mb-8">
									<div className="flex items-center gap-3 text-sm">
										<div className="w-2 h-2 rounded-full bg-sage-600" />
										<span>Curated product collections</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<div className="w-2 h-2 rounded-full bg-sage-600" />
										<span>Local vendor discovery</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<div className="w-2 h-2 rounded-full bg-sage-600" />
										<span>Unified shopping cart</span>
									</div>
								</div>

								<Button
									onClick={() => handleRoleSelection("customer")}
									className="w-full bg-black hover:bg-black/80 cursor-pointer transition-all"
									size="lg"
									disabled={submitting}
								>
									{submitting ? "Please wait..." : "Continue as Customer"}
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Vendor Card */}
					<Card className="relative overflow-hidden border-2 hover:border-terracotta-300 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group">
						<CardContent className="p-8">
							<div className="text-center">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10 mb-6 group-hover:bg-terracotta/20 transition-colors">
									<Store className="w-8 h-8 text-terracotta-600" />
								</div>

								<h2 className="font-serif text-2xl font-bold mb-4">
									Sell Products
								</h2>

								<p className="text-muted-foreground leading-relaxed mb-6">
									Turn your passion into a business. Join thousands of
									independent sellers who trust Vendora to power their online
									stores.
								</p>

								<div className="space-y-3 mb-8">
									<div className="flex items-center gap-3 text-sm">
										<div className="w-2 h-2 rounded-full bg-terracotta-600" />
										<span>Easy store setup</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<div className="w-2 h-2 rounded-full bg-terracotta-600" />
										<span>Built-in analytics</span>
									</div>
									<div className="flex items-center gap-3 text-sm">
										<div className="w-2 h-2 rounded-full bg-terracotta-600" />
										<span>Transparent pricing</span>
									</div>
								</div>

								<Button
									onClick={() => handleRoleSelection("vendor")}
									className="w-full bg-black hover:bg-black/80 cursor-pointer transition-all"
									size="lg"
									disabled={submitting}
								>
									{submitting ? "Please wait..." : "Start Selling"}
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Already have account */}
				<div className="text-center mt-12">
					<p className="text-muted-foreground">
						Already have an account?{" "}
						<Button
							variant="link"
							className="p-0 h-auto text-black hover:text-black/80"
						>
							Sign in here
						</Button>
					</p>
				</div>
			</div>
		</div>
	);
}
