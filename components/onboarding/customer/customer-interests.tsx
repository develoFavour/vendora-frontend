"use client";

import { useOnboarding } from "@/lib/onboarding-context";
import { CategorySelector } from "@/components/onboarding";
import { customerOnboardingAPI } from "@/lib/api";
import { CATEGORIES } from "./constants";
import { toast } from "sonner";

export function CustomerInterests() {
	const { state, setStepData, nextStep, setLoading, setError, clearError } =
		useOnboarding();

	const interestsData =
		(state.stepData.interests as { categories?: string[] }) || {};
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
			await toast.promise(
				customerOnboardingAPI.updateInterests(selectedCategories),
				{
					loading: "Saving your interests...",
					success: "Interests saved successfully",
					error: (err) =>
						err instanceof Error ? err.message : "Failed to save interests",
				}
			);
			setStepData("interests", { categories: selectedCategories });
			clearError("interests");
			nextStep();
		} catch (error) {
			setError(
				"interests",
				error instanceof Error ? error.message : "Failed to save interests"
			);
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
