// Customer Onboarding Steps
import React from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import extracted components
export { CustomerInterests } from "./customer-interests";
export { CustomerPreferences } from "./customer-preferences";
export { CustomerProfile } from "./customer-profile";

// Customer Welcome Step
export function CustomerWelcome() {
	const { setStepData, nextStep } = useOnboardingStore();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setStepData("welcome", { completed: true });
		nextStep();
	};

	return (
		<div className="text-center space-y-6">
			<div>
				<h2 className="font-serif text-2xl font-bold mb-2">
					Welcome to Vendora!
				</h2>
				<p className="text-muted-foreground">
					We&apos;re excited to help you discover amazing products from
					independent sellers.
				</p>
			</div>

			<Card className="bg-sage-50/50 border-sage-200">
				<CardContent className="p-6">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center">
							<span className="text-2xl">🎯</span>
						</div>
						<div className="text-left">
							<h3 className="font-semibold">Personalized Experience</h3>
							<p className="text-sm text-muted-foreground">
								Help us tailor recommendations to your interests
							</p>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center">
							<span className="text-2xl">🏪</span>
						</div>
						<div className="text-left">
							<h3 className="font-semibold">Local Discovery</h3>
							<p className="text-sm text-muted-foreground">
								Find vendors and products near you
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Button
				onClick={handleSubmit}
				className="w-full bg-black hover:bg-black/80 cursor-pointer transition-all"
			>
				Let&apos;s Get Started
			</Button>
		</div>
	);
}
