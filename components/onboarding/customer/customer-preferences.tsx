// Customer Preferences Step Component
"use client";

import { useEffect } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";

import { useOnboarding } from "@/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/onboarding";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { customerOnboardingAPI } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import {
	BUDGET_RANGES,
	SHOPPING_FREQUENCIES,
	SPECIAL_PREFERENCES,
} from "./constants";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export function CustomerPreferences() {
	const { state, setStepData, clearError, nextStep, setLoading, setError } =
		useOnboarding();

	const preferences =
		(state.stepData.preferences as Record<string, string | boolean>) || {};

	useEffect(() => {
		// Clear any stale errors when this step mounts
		clearError("preferences");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePreferenceChange = (key: string, value: string | boolean) => {
		const newPreferences = { ...preferences, [key]: value };
		setStepData("preferences", newPreferences);
		clearError("preferences");
	};

	const handleNext = async () => {
		if (!preferences.budgetRange || !preferences.shoppingFrequency) {
			setError("preferences", "Please fill in all required fields");
		}

		setLoading(true);
		clearError("preferences");

		try {
			// Convert special preferences to proper format
			const specialPrefs: Record<string, boolean> = {};
			const specialPrefKeys = [
				"local-only",
				"sustainable",
				"handmade",
				"vintage",
			] as const;

			specialPrefKeys.forEach((key) => {
				const val = preferences[key];
				if (typeof val === "boolean" && val) {
					specialPrefs[key] = true;
				}
			});

			await toast.promise(
				customerOnboardingAPI.updatePreferences({
					budgetRange: preferences.budgetRange as string,
					shoppingFrequency: preferences.shoppingFrequency as string,
					specialPrefs:
						Object.keys(specialPrefs).length > 0 ? specialPrefs : undefined,
				}),
				{
					loading: "Saving your preferences...",
					success: "Preferences saved",
					error: (err) =>
						err instanceof Error ? err.message : "Failed to save preferences",
				}
			);
			setStepData("preferences", { ...preferences, specialPrefs });
			nextStep();
		} catch (err) {
			setError("preferences", err as string);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">
					Shopping Preferences
				</h2>
				<p className="text-muted-foreground">
					Help us understand your shopping style to show you the most relevant
					products.
				</p>
			</div>

			<div className="grid gap-6">
				<FormField label="What's your typical budget range?" required>
					<Select
						value={(preferences.budgetRange as string) || ""}
						onValueChange={(value) =>
							handlePreferenceChange("budgetRange", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select your budget range" />
						</SelectTrigger>
						<SelectContent>
							{BUDGET_RANGES.map((range) => (
								<SelectItem key={range.value} value={range.value}>
									{range.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>

				<FormField label="How often do you shop online?" required>
					<Select
						value={(preferences.shoppingFrequency as string) || ""}
						onValueChange={(value) =>
							handlePreferenceChange("shoppingFrequency", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select your shopping frequency" />
						</SelectTrigger>
						<SelectContent>
							{SHOPPING_FREQUENCIES.map((freq) => (
								<SelectItem key={freq.value} value={freq.value}>
									{freq.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>

				<FormField label="Special preferences (optional)">
					<div className="space-y-3">
						{SPECIAL_PREFERENCES.map((pref) => (
							<div key={pref.id} className="flex items-center space-x-2">
								<Checkbox
									id={pref.id}
									checked={Boolean(preferences[pref.id] as boolean)}
									onCheckedChange={(checked: CheckedState) =>
										handlePreferenceChange(pref.id, checked === true)
									}
								/>
								<label
									htmlFor={pref.id}
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{pref.label}
								</label>
							</div>
						))}
					</div>
				</FormField>
			</div>

			<div className="flex justify-end pt-4">
				<Button
					onClick={handleNext}
					disabled={state.isLoading}
					className="bg-black hover:bg-black/80 cursor-pointer transition-all disabled:opacity-60"
				>
					Continue
					<ArrowRight className="w-4 h-4 ml-2" />
				</Button>
			</div>
		</div>
	);
}
