// Onboarding Complete Component
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/onboarding-context";
import { SuccessAnimation } from "@/components/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ShoppingBag, Plus } from "lucide-react";
import { toast } from "sonner";
import { VendorApplicationModal } from "./vendor-application-modal";

export function OnboardingComplete() {
	const { state, getAllFormData } = useOnboarding();
	const router = useRouter();
	const [showVendorModal, setShowVendorModal] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	console.log(isSubmitting);

	const formData = getAllFormData();
	const isVendor = state.userRole === "vendor";
	const isCustomer = state.userRole === "customer";

	const handleComplete = async () => {
		if (isCustomer) {
			setIsSubmitting(true);
			try {
				// Customer onboarding is already complete through individual steps
				// Just redirect to marketplace
				toast.success("Welcome to Vendora! 🎉");
				router.push("/marketplace");
			} catch (error) {
				console.error("Error completing onboarding:", error);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			// Vendor onboarding completion
			try {
				console.log("Vendor onboarding data:", formData);
				toast.success("Welcome to Vendora Vendor! 🎉");
				router.push("/vendor/dashboard");
			} catch (error) {
				console.error("Error completing vendor onboarding:", error);
			}
		}
	};

	const handleMaybeLater = async () => {
		// Redirect to marketplace without applying for vendor
		router.push("/marketplace");
	};

	return (
		<>
			<div className="text-center space-y-6">
				<SuccessAnimation
					title={`Welcome to Vendora${isVendor ? ", Vendor!" : "!"}`}
					description={
						isVendor
							? "Your store setup is complete! You're ready to start selling."
							: "Your profile is set up! Start discovering amazing products."
					}
					onContinue={handleComplete}
				/>

				<Card
					className={`max-w-md mx-auto ${
						isVendor
							? "bg-terracotta-50/50 border-terracotta-200"
							: "bg-sage-50/50 border-sage-200"
					}`}
				>
					<CardContent className="p-6">
						<div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4">
							{isVendor ? (
								<Store className="w-8 h-8 text-terracotta-600" />
							) : (
								<ShoppingBag className="w-8 h-8 text-sage-600" />
							)}
						</div>

						<h3 className="font-semibold mb-2">
							{isVendor ? "Next Steps for Vendors" : "What's Next?"}
						</h3>

						<div className="text-sm text-muted-foreground space-y-2 mb-6">
							{isVendor ? (
								<>
									<p>• Add your first products to your store</p>
									<p>• Set up payment processing</p>
									<p>• Customize your store policies</p>
									<p>• Start promoting your products</p>
								</>
							) : (
								<>
									<p>• Browse products from verified vendors</p>
									<p>• Save items to your wishlist</p>
									<p>• Follow your favorite sellers</p>
									<p>• Make your first purchase</p>
								</>
							)}
						</div>

						{/* Vendor Application CTA for Customers */}
						{isCustomer && (
							<div className="border-t pt-6">
								<div className="bg-gradient-to-r from-terracotta/5 to-sage/5 rounded-lg p-4 mb-4">
									<div className="flex items-center gap-3 mb-3">
										<div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center">
											<Plus className="w-4 h-4 text-terracotta-600" />
										</div>
										<div>
											<h4 className="font-medium text-sm">
												Want to sell products too?
											</h4>
											<p className="text-xs text-muted-foreground">
												Apply to become a vendor and unlock selling capabilities
											</p>
										</div>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={handleMaybeLater}
											className="flex-1"
										>
											Maybe Later
										</Button>
										<Button
											size="sm"
											onClick={() => setShowVendorModal(true)}
											className="flex-1 bg-terracotta-600 hover:bg-terracotta-700"
										>
											Apply to Sell
										</Button>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Vendor Application Modal */}
			<VendorApplicationModal
				isOpen={showVendorModal}
				onClose={() => setShowVendorModal(false)}
			/>
		</>
	);
}
