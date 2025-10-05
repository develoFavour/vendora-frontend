// Customer Onboarding Steps
import React from "react";
import { useOnboarding } from "@/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CategorySelector, FormField } from "@/components/onboarding";

const CATEGORIES = [
	{
		id: "home-living",
		name: "Home & Living",
		icon: "🏠",
		description: "Furniture, decor, and home essentials",
		color: "bg-sage/10 text-sage",
	},
	{
		id: "fashion",
		name: "Fashion & Accessories",
		icon: "👗",
		description: "Clothing, jewelry, and accessories",
		color: "bg-terracotta/10 text-terracotta",
	},
	{
		id: "art-collectibles",
		name: "Art & Collectibles",
		icon: "🎨",
		description: "Original artwork and unique collectibles",
		color: "bg-sage/10 text-sage",
	},
	{
		id: "jewelry",
		name: "Jewelry",
		icon: "💎",
		description: "Handcrafted and designer jewelry",
		color: "bg-terracotta/10 text-terracotta",
	},
	{
		id: "food-beverage",
		name: "Food & Beverages",
		icon: "🍽️",
		description: "Gourmet foods and artisanal beverages",
		color: "bg-sage/10 text-sage",
	},
	{
		id: "beauty-wellness",
		name: "Beauty & Wellness",
		icon: "✨",
		description: "Skincare, cosmetics, and wellness products",
		color: "bg-terracotta/10 text-terracotta",
	},
];

const BUDGET_RANGES = [
	{ value: "budget-friendly", label: "Budget-friendly ($10-50)" },
	{ value: "moderate", label: "Moderate ($50-200)" },
	{ value: "premium", label: "Premium ($200-1000)" },
	{ value: "luxury", label: "Luxury ($1000+)" },
];

const SHOPPING_FREQUENCIES = [
	{ value: "casual", label: "Casual browser (monthly)" },
	{ value: "regular", label: "Regular shopper (weekly)" },
	{ value: "frequent", label: "Frequent buyer (multiple times/week)" },
	{ value: "occasional", label: "Occasional (few times/year)" },
];

// Customer Welcome Step
export function CustomerWelcome() {
	const { setStepData, nextStep } = useOnboarding();

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

// Customer Interests Step
export function CustomerInterests() {
	const { state, setStepData } = useOnboarding();

	const interestsData =
		(state.stepData.interests as { categories?: string[] }) || {};
	const selectedCategories = interestsData.categories || [];

	const handleCategoryChange = (categories: string[]) => {
		setStepData("interests", { categories });
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
		/>
	);
}

// Customer Preferences Step
export function CustomerPreferences() {
	const { state, setStepData, clearError } = useOnboarding();

	const preferences =
		(state.stepData.preferences as Record<string, string>) || {};

	const handlePreferenceChange = (key: string, value: string | boolean) => {
		const newPreferences = { ...preferences, [key]: value };
		setStepData("preferences", newPreferences);
		clearError("preferences");
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
						value={preferences.budgetRange || ""}
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
						value={preferences.shoppingFrequency || ""}
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
						{[
							{ id: "local-only", label: "Prefer local vendors only" },
							{ id: "sustainable", label: "Focus on sustainable products" },
							{ id: "handmade", label: "Handmade items only" },
							{ id: "vintage", label: "Include vintage items" },
						].map((pref) => (
							<div key={pref.id} className="flex items-center space-x-2">
								<Checkbox
									id={pref.id}
									checked={preferences[pref.id] === "true"}
									onCheckedChange={(checked) =>
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
		</div>
	);
}

// Customer Profile Step
export function CustomerProfile() {
	const { state, setStepData, clearError } = useOnboarding();

	const profile = (state.stepData.profile as Record<string, string>) || {};

	const handleProfileChange = (key: string, value: string) => {
		const newProfile = { ...profile, [key]: value };
		setStepData("profile", newProfile);
		clearError("profile");
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">
					Complete Your Profile
				</h2>
				<p className="text-muted-foreground">
					Add a few details to personalize your experience and help vendors
					connect with you.
				</p>
			</div>

			<div className="grid gap-6">
				<div className="grid grid-cols-2 gap-4">
					<FormField label="First Name" required>
						<Input
							value={profile.firstName || ""}
							onChange={(e) => handleProfileChange("firstName", e.target.value)}
							placeholder="Enter your first name"
						/>
					</FormField>

					<FormField label="Last Name" required>
						<Input
							value={profile.lastName || ""}
							onChange={(e) => handleProfileChange("lastName", e.target.value)}
							placeholder="Enter your last name"
						/>
					</FormField>
				</div>

				<FormField label="Location" required>
					<Input
						value={profile.location || ""}
						onChange={(e) => handleProfileChange("location", e.target.value)}
						placeholder="City, State or ZIP code"
					/>
				</FormField>

				<FormField label="Bio (optional)">
					<Textarea
						value={profile.bio || ""}
						onChange={(e) => handleProfileChange("bio", e.target.value)}
						placeholder="Tell us a bit about yourself and what you're looking for..."
						rows={3}
					/>
				</FormField>

				<FormField label="Profile Picture (optional)">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
							<span className="text-2xl">👤</span>
						</div>
						<div>
							<Button variant="outline" className="mb-2">
								Upload Photo
							</Button>
							<p className="text-xs text-muted-foreground">
								JPG, PNG up to 5MB
							</p>
						</div>
					</div>
				</FormField>
			</div>
		</div>
	);
}
