"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { OnboardingLayout } from "@/components/onboarding";
import {
	CustomerWelcome,
	CustomerInterests,
	CustomerPreferences,
	CustomerProfile,
} from "@/components/onboarding/customer";
import {
	VendorWelcome,
	VendorBusinessType,
	VendorCategories,
	VendorBusinessDetails,
	VendorStoreSetup,
	VendorVerification,
} from "@/components/onboarding/vendor";
import { OnboardingComplete } from "@/components/onboarding/onboarding-complete";

// Define all possible steps for both flows
const CUSTOMER_STEPS = [
	{ id: "welcome", title: "Welcome", component: CustomerWelcome },
	{ id: "interests", title: "Interests", component: CustomerInterests },
	{ id: "preferences", title: "Preferences", component: CustomerPreferences },
	{ id: "profile", title: "Profile", component: CustomerProfile },
];

const VENDOR_STEPS = [
	{ id: "welcome", title: "Welcome", component: VendorWelcome },
	{
		id: "business-type",
		title: "Business Type",
		component: VendorBusinessType,
	},
	{ id: "categories", title: "Categories", component: VendorCategories },
	{
		id: "business-details",
		title: "Business Details",
		component: VendorBusinessDetails,
	},
	{ id: "store-setup", title: "Store Setup", component: VendorStoreSetup },
	{ id: "verification", title: "Verification", component: VendorVerification },
];

export default function OnboardingPage() {
	const { userRole, currentStep, hydrated, isLoading } = useOnboardingStore();
	const router = useRouter();

	// Redirect if no role selected, but only after hydration
	useEffect(() => {
		if (!hydrated) return;
		if (!userRole) {
			router.push("/onboarding/role-selection");
		}
	}, [hydrated, userRole, router]);

	// Check if onboarding is complete
	const isComplete =
		currentStep >=
		(userRole === "vendor" ? VENDOR_STEPS.length : CUSTOMER_STEPS.length);

	// Wait for hydration before rendering; then require role
	if (!hydrated) return null;
	if (!userRole) return null; // redirect runs in effect

	// Show completion screen if onboarding is done
	if (isComplete) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-terracotta/5">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-2xl mx-auto">
						<OnboardingComplete />
					</div>
				</div>
			</div>
		);
	}

	// Get current steps based on role
	const currentSteps = userRole === "vendor" ? VENDOR_STEPS : CUSTOMER_STEPS;

	const currentStepData = currentSteps[currentStep];
	const CurrentStepComponent = currentStepData?.component;

	if (!CurrentStepComponent) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Step not found</h2>
					<p className="text-muted-foreground">
						Please restart the onboarding process.
					</p>
				</div>
			</div>
		);
	}

	return (
		<OnboardingLayout
			steps={currentSteps}
			title={`Welcome to Vendora${userRole === "vendor" ? " Vendor" : ""}`}
			description={
				userRole === "vendor"
					? "Let's set up your store and get you ready to start selling"
					: "Let's personalize your shopping experience"
			}
			isLoading={isLoading}
			showNextButton={currentStepData.id !== "verification"}
		>
			<CurrentStepComponent />
		</OnboardingLayout>
	);
}
