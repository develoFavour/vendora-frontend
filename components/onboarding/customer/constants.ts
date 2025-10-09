// Customer Onboarding Constants
export const CATEGORIES = [
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

export const BUDGET_RANGES = [
	{ value: "budget-friendly", label: "Budget-friendly ($10-50)" },
	{ value: "moderate", label: "Moderate ($50-200)" },
	{ value: "premium", label: "Premium ($200-1000)" },
	{ value: "luxury", label: "Luxury ($1000+)" },
];

export const SHOPPING_FREQUENCIES = [
	{ value: "casual", label: "Casual browser (monthly)" },
	{ value: "regular", label: "Regular shopper (weekly)" },
	{ value: "frequent", label: "Frequent buyer (multiple times/week)" },
	{ value: "occasional", label: "Occasional (few times/year)" },
];

export const SPECIAL_PREFERENCES = [
	{ id: "local-only", label: "Prefer local vendors only" },
	{ id: "sustainable", label: "Focus on sustainable products" },
	{ id: "handmade", label: "Handmade items only" },
	{ id: "vintage", label: "Include vintage items" },
];
