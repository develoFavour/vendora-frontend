"use client";

import { useOnboardingStore } from "@/stores/onboarding-store";
import { CategorySelector } from "@/components/onboarding";
import { customerOnboardingAPI } from "@/lib/api";
import { CATEGORIES } from "./constants";
import { toastPromise } from "@/lib/toast-helpers";

export function CustomerInterests() {
	const { stepData, setStepData, nextStep, setLoading, setError, clearError } =
		useOnboardingStore();

	const interestsData = (stepData.interests as { categories?: string[] }) || {};
	const selectedCategories = interestsData.categories || [];

	const handleCategoryChange = (categories: string[]) => {
		setStepData("interests", { categories });
	};

	const handleNext = async () => {
		if (selectedCategories.length === 0) {
			setError("interests", "Please select at least one category");
			return;
		}

		setLoading(true);
		clearError("interests");

		try {
			// Modern toast UI with proper error handling
			await toastPromise(
				customerOnboardingAPI.updateInterests(selectedCategories),
				{
					loading: "Saving your interests...",
					success: "Interests saved successfully!",
					error: (err) =>
						err instanceof Error
							? err.message
							: "Failed to save interests. Please try again.",
				}
			);

			setStepData("interests", { categories: selectedCategories });
			clearError("interests");
			nextStep();
		} catch (error: unknown) {
			// Error already shown via toast, just update state and prevent navigation
			const errorMessage =
				error instanceof Error
					? error.message
					: "Failed to save interests. Please check your connection and try again.";

			setError("interests", errorMessage);
			console.error("Failed to save interests:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<CategorySelector
			categories={CATEGORIES}
			selectedCategories={selectedCategories}
			onSelectionChange={handleCategoryChange}
			title="What interests you?"
			description="Select 1-3 categories that catch your eye. We'll use this to personalize your recommendations."
			minSelections={1}
			maxSelections={3}
			onNext={handleNext}
		/>
	);
}
