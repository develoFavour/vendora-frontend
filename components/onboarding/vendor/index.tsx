// Vendor Onboarding Steps
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

const BUSINESS_TYPES = [
	{
		value: "sole-proprietor",
		label: "Sole Proprietor",
		description: "Individual business owner",
	},
	{
		value: "partnership",
		label: "Partnership",
		description: "Multiple business partners",
	},
	{ value: "llc", label: "LLC", description: "Limited Liability Company" },
	{
		value: "corporation",
		label: "Corporation",
		description: "Incorporated business",
	},
	{
		value: "nonprofit",
		label: "Nonprofit",
		description: "Registered nonprofit organization",
	},
];

const BUSINESS_SIZES = [
	{ value: "solo", label: "Just me", description: "One-person operation" },
	{
		value: "small",
		label: "Small team (2-10)",
		description: "Small business with employees",
	},
	{
		value: "large",
		label: "Large business (50+)",
		description: "Enterprise-level operation",
	},
];

// Vendor Welcome Step
export function VendorWelcome() {
	const { setStepData } = useOnboarding();

	const handleSubmit = () => {
		setStepData("welcome", { completed: true });
	};

	return (
		<div className="text-center space-y-6">
			<div>
				<h2 className="font-serif text-2xl font-bold mb-2">
					Welcome, Future Vendor!
				</h2>
				<p className="text-muted-foreground">
					Let&apos;s set up your store and get you ready to start selling on
					Vendora.
				</p>
			</div>

			<Card className="bg-terracotta-50/50 border-terracotta-200">
				<CardContent className="p-6">
					<div className="grid md:grid-cols-3 gap-4 text-center">
						<div className="flex flex-col items-center">
							<div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center mb-3">
								<span className="text-2xl">🚀</span>
							</div>
							<h3 className="font-semibold mb-1">Quick Setup</h3>
							<p className="text-sm text-muted-foreground">
								Get your store running in minutes
							</p>
						</div>

						<div className="flex flex-col items-center">
							<div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-3">
								<span className="text-2xl">📊</span>
							</div>
							<h3 className="font-semibold mb-1">Built-in Analytics</h3>
							<p className="text-sm text-muted-foreground">
								Track sales and grow your business
							</p>
						</div>

						<div className="flex flex-col items-center">
							<div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center mb-3">
								<span className="text-2xl">💰</span>
							</div>
							<h3 className="font-semibold mb-1">Transparent Pricing</h3>
							<p className="text-sm text-muted-foreground">
								No hidden fees, ever
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Button
				onClick={handleSubmit}
				className="w-full bg-terracotta-600 hover:bg-terracotta-700"
			>
				Start Setting Up My Store
			</Button>
		</div>
	);
}

// Vendor Business Type Step
export function VendorBusinessType() {
	const { state, setStepData, clearError } = useOnboarding();

	const businessData =
		(state.stepData["business-type"] as Record<string, string>) || {};

	const handleBusinessTypeChange = (key: string, value: string) => {
		const newData = { ...businessData, [key]: value };
		setStepData("business-type", newData);
		clearError("business-type");
	};

	const canProceed =
		businessData.businessType &&
		businessData.businessSize &&
		businessData.experience;

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">
					Tell Us About Your Business
				</h2>
				<p className="text-muted-foreground">
					This helps us tailor your experience and provide relevant guidance.
				</p>
			</div>

			<div className="grid gap-6">
				<FormField label="What type of business do you have?" required>
					<Select
						value={businessData.businessType || ""}
						onValueChange={(value) =>
							handleBusinessTypeChange("businessType", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select your business type" />
						</SelectTrigger>
						<SelectContent>
							{BUSINESS_TYPES.map((type) => (
								<SelectItem key={type.value} value={type.value}>
									<div>
										<div className="font-medium">{type.label}</div>
										<div className="text-sm text-muted-foreground">
											{type.description}
										</div>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>

				<FormField label="How big is your business?" required>
					<Select
						value={businessData.businessSize || ""}
						onValueChange={(value) =>
							handleBusinessTypeChange("businessSize", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select your business size" />
						</SelectTrigger>
						<SelectContent>
							{BUSINESS_SIZES.map((size) => (
								<SelectItem key={size.value} value={size.value}>
									<div>
										<div className="font-medium">{size.label}</div>
										<div className="text-sm text-muted-foreground">
											{size.description}
										</div>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>

				<FormField label="How long have you been in business?" required>
					<Select
						value={businessData.experience || ""}
						onValueChange={(value) =>
							handleBusinessTypeChange("experience", value)
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select your experience level" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="new">
								Just starting out (0-6 months)
							</SelectItem>
							<SelectItem value="early">
								Getting established (6 months - 2 years)
							</SelectItem>
							<SelectItem value="experienced">
								Experienced (2-5 years)
							</SelectItem>
							<SelectItem value="veteran">
								Long-time business (5+ years)
							</SelectItem>
						</SelectContent>
					</Select>
				</FormField>
			</div>
		</div>
	);
}

// Vendor Categories Step
export function VendorCategories() {
	const { state, setStepData } = useOnboarding();

	const categoriesData =
		(state.stepData.categories as { categories?: string[] }) || {};
	const selectedCategories = categoriesData.categories || [];

	const handleCategoryChange = (categories: string[]) => {
		setStepData("categories", { categories });
	};

	return (
		<CategorySelector
			categories={CATEGORIES}
			selectedCategories={selectedCategories}
			onSelectionChange={handleCategoryChange}
			title="What do you sell?"
			description="Select the categories that best describe your products. You can always add more later."
			minSelections={1}
			maxSelections={5}
		/>
	);
}

// Vendor Business Details Step
export function VendorBusinessDetails() {
	const { state, setStepData, clearError } = useOnboarding();

	const businessDetails =
		(state.stepData["business-details"] as Record<string, string>) || {};

	const handleBusinessDetailChange = (key: string, value: string) => {
		const newDetails = { ...businessDetails, [key]: value };
		setStepData("business-details", newDetails);
		clearError("business-details");
	};

	const canProceed =
		businessDetails.businessName &&
		businessDetails.description &&
		businessDetails.location;

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">
					Business Information
				</h2>
				<p className="text-muted-foreground">
					Tell customers about your business and where you&apos;re located.
				</p>
			</div>

			<div className="grid gap-6">
				<FormField label="Business Name" required>
					<Input
						value={businessDetails.businessName || ""}
						onChange={(e) =>
							handleBusinessDetailChange("businessName", e.target.value)
						}
						placeholder="Your business or brand name"
					/>
				</FormField>

				<FormField label="Business Description" required>
					<Textarea
						value={businessDetails.description || ""}
						onChange={(e) =>
							handleBusinessDetailChange("description", e.target.value)
						}
						placeholder="Describe your business, products, and what makes you unique..."
						rows={4}
					/>
				</FormField>

				<FormField label="Business Location" required>
					<Input
						value={businessDetails.location || ""}
						onChange={(e) =>
							handleBusinessDetailChange("location", e.target.value)
						}
						placeholder="City, State/Country"
					/>
				</FormField>

				<FormField label="Website/Social Media (optional)">
					<Input
						value={businessDetails.website || ""}
						onChange={(e) =>
							handleBusinessDetailChange("website", e.target.value)
						}
						placeholder="https://yourwebsite.com or @yourhandle"
					/>
				</FormField>
			</div>
		</div>
	);
}

// Vendor Store Setup Step
export function VendorStoreSetup() {
	const { state, setStepData, clearError } = useOnboarding();

	const storeSetup =
		(state.stepData["store-setup"] as Record<string, string>) || {};

	const handleStoreSetupChange = (key: string, value: string) => {
		const newSetup = { ...storeSetup, [key]: value };
		setStepData("store-setup", newSetup);
		clearError("store-setup");
	};

	const canProceed = storeSetup.storeName && storeSetup.storeDescription;

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">
					Customize Your Store
				</h2>
				<p className="text-muted-foreground">
					Create a unique identity for your store that reflects your brand.
				</p>
			</div>

			<div className="grid gap-6">
				<FormField label="Store Name" required>
					<Input
						value={storeSetup.storeName || ""}
						onChange={(e) =>
							handleStoreSetupChange("storeName", e.target.value)
						}
						placeholder="How customers will see your store"
					/>
				</FormField>

				<FormField label="Store Description" required>
					<Textarea
						value={storeSetup.storeDescription || ""}
						onChange={(e) =>
							handleStoreSetupChange("storeDescription", e.target.value)
						}
						placeholder="Tell your story and what customers can expect..."
						rows={3}
					/>
				</FormField>

				<FormField label="Store Logo (optional)">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
							<span className="text-2xl">🏪</span>
						</div>
						<div>
							<Button variant="outline" className="mb-2">
								Upload Logo
							</Button>
							<p className="text-xs text-muted-foreground">
								Square image, at least 400x400px
							</p>
						</div>
					</div>
				</FormField>

				<FormField label="Store Colors (optional)">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Primary Color
							</label>
							<div className="flex gap-2">
								{["#8FBC8F", "#E2725B", "#4A90E2", "#F5A623"].map((color) => (
									<button
										key={color}
										className={`w-8 h-8 rounded-full border-2 ${
											storeSetup.primaryColor === color
												? "border-foreground"
												: "border-muted"
										}`}
										style={{ backgroundColor: color }}
										onClick={() =>
											handleStoreSetupChange("primaryColor", color)
										}
									/>
								))}
							</div>
						</div>
						<div>
							<label className="text-sm font-medium mb-2 block">
								Accent Color
							</label>
							<div className="flex gap-2">
								{["#E2725B", "#8FBC8F", "#F5A623", "#4A90E2"].map((color) => (
									<button
										key={color}
										className={`w-8 h-8 rounded-full border-2 ${
											storeSetup.accentColor === color
												? "border-foreground"
												: "border-muted"
										}`}
										style={{ backgroundColor: color }}
										onClick={() => handleStoreSetupChange("accentColor", color)}
									/>
								))}
							</div>
						</div>
					</div>
				</FormField>
			</div>
		</div>
	);
}

// Vendor Verification Step
export function VendorVerification() {
	const { setStepData, nextStep } = useOnboarding();

	const handleVerificationSubmit = () => {
		setStepData("verification", { completed: true });
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">
					Verify Your Business
				</h2>
				<p className="text-muted-foreground">
					Build trust with customers by verifying your business identity.
				</p>
			</div>

			<Card className="border-amber-200 bg-amber-50/50">
				<CardContent className="p-6">
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
							<span className="text-2xl">🛡️</span>
						</div>
						<div>
							<h3 className="font-semibold mb-2">Why Verification Matters</h3>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Verified vendors appear higher in search results</li>
								<li>• Customers trust verified sellers more</li>
								<li>• Access to premium vendor features</li>
								<li>• Faster dispute resolution</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid gap-6">
				<FormField label="Government-Issued ID">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
							<span className="text-2xl">🆔</span>
						</div>
						<div className="flex-1">
							<Button variant="outline" className="mb-2">
								Upload ID Document
							</Button>
							<p className="text-xs text-muted-foreground">
								Driver&apos;s license, passport, or business license
							</p>
						</div>
					</div>
				</FormField>

				<FormField label="Business Registration (optional)">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
							<span className="text-2xl">📄</span>
						</div>
						<div className="flex-1">
							<Button variant="outline" className="mb-2">
								Upload Business Documents
							</Button>
							<p className="text-xs text-muted-foreground">
								Articles of incorporation, DBA, etc.
							</p>
						</div>
					</div>
				</FormField>

				<div className="flex items-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
					<Checkbox id="terms" />
					<label htmlFor="terms" className="text-sm leading-relaxed">
						I agree to Vendora&apos;s{" "}
						<Button
							variant="link"
							className="p-0 h-auto text-blue-600 hover:text-blue-700"
						>
							Terms of Service
						</Button>{" "}
						and{" "}
						<Button
							variant="link"
							className="p-0 h-auto text-blue-600 hover:text-blue-700"
						>
							Vendor Agreement
						</Button>
					</label>
				</div>
			</div>

			<Button
				onClick={handleVerificationSubmit}
				className="w-full bg-terracotta-600 hover:bg-terracotta-700"
			>
				Complete Setup
			</Button>
		</div>
	);
}
