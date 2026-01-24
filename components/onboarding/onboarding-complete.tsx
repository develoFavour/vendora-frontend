// Onboarding Complete Component
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { SuccessAnimation } from "@/components/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Store, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function OnboardingComplete() {
	const { userRole, stepData } = useOnboardingStore();
	const router = useRouter();

	const isVendor = userRole === "vendor";
	const verificationStatus = stepData["verification"]?.status;

	useEffect(() => {
		if (isVendor && verificationStatus === "approved") {
			// Celebrate auto-approval!
			const duration = 3 * 1000;
			const animationEnd = Date.now() + duration;
			const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

			const randomInRange = (min: number, max: number) =>
				Math.random() * (max - min) + min;

			const interval: any = setInterval(function () {
				const timeLeft = animationEnd - Date.now();

				if (timeLeft <= 0) {
					return clearInterval(interval);
				}

				const particleCount = 50 * (timeLeft / duration);
				// since particles fall down, start a bit higher than random
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
				});
				confetti({
					...defaults,
					particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
				});
			}, 250);
		}
	}, [isVendor, verificationStatus]);

	const handleComplete = () => {
		if (userRole === "buyer") {
			toast.success("Welcome to Vendora! 🎉");
			router.push("/marketplace");
		} else {
			toast.success("Welcome to Vendora Vendor! 🎉");
			router.push("/vendor/dashboard");
		}
	};

	return (
		<div className="text-center space-y-6">
			<SuccessAnimation
				title={`Welcome to Vendora${isVendor ? ", Vendor!" : "!"}`}
				description={
					isVendor
						? verificationStatus === "approved"
							? "Congratulations! Your account was auto-approved. You're ready to start selling."
							: "Your application has been submitted for review. We'll notify you once it's approved!"
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
						{isVendor ? "What's Next for You?" : "Start Shopping"}
					</h3>

					<div className="text-sm text-muted-foreground space-y-2 mb-6">
						{isVendor ? (
							<>
								<p>• Visit your Dashboard to track performance</p>
								<p>• List your first products</p>
								<p>• Set up your payout preferences</p>
							</>
						) : (
							<>
								<p>• Browse verified vendor collections</p>
								<p>• Save your first items</p>
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
