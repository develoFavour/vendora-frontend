// Vendor Application Modal Component
"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface VendorApplicationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function VendorApplicationModal({
	isOpen,
	onClose,
}: VendorApplicationModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		businessName: "",
		businessType: "",
		businessDescription: "",
		contactEmail: "",
		contactPhone: "",
		businessAddress: "",
		taxId: "",
		website: "",
		products: [] as string[],
		experience: "",
		motivation: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handleSubmitApplication = async () => {
		// Validate required fields
		const newErrors: Record<string, string> = {};

		if (!formData.businessName.trim())
			newErrors.businessName = "Business name is required";
		if (!formData.businessType.trim())
			newErrors.businessType = "Business type is required";
		if (!formData.businessDescription.trim())
			newErrors.businessDescription = "Business description is required";
		if (!formData.contactEmail.trim())
			newErrors.contactEmail = "Contact email is required";
		if (!formData.contactPhone.trim())
			newErrors.contactPhone = "Contact phone is required";
		if (!formData.businessAddress.trim())
			newErrors.businessAddress = "Business address is required";
		if (formData.products.length === 0)
			newErrors.products = "At least one product category is required";
		if (!formData.experience.trim())
			newErrors.experience = "Experience description is required";
		if (!formData.motivation.trim())
			newErrors.motivation = "Motivation description is required";

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
			newErrors.contactEmail = "Please enter a valid email address";
		}

		// Phone validation (basic)
		if (formData.contactPhone && formData.contactPhone.length < 10) {
			newErrors.contactPhone = "Please enter a valid phone number";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch("/api/v1/vendor/apply", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("vendora-auth-token")}`,
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to submit application");
			}

			const result = await response.json();
			console.log(result);

			// Show success toast and redirect
			toast.success(
				"Vendor application submitted! 🎉 You'll be notified once reviewed."
			);
			onClose();
			window.location.href = "/marketplace"; // Redirect to marketplace
		} catch (error) {
			console.error("Error submitting application:", error);
			setErrors({
				submit:
					error instanceof Error
						? error.message
						: "Failed to submit application",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<CardContent className="p-6">
					<div className="text-center space-y-4 mb-6">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-terracotta/10">
							<Store className="w-8 h-8 text-terracotta-600" />
						</div>

						<div>
							<h3 className="font-semibold text-lg mb-2">
								Apply to Become a Vendor
							</h3>
							<p className="text-sm text-muted-foreground">
								Fill out this application to start selling on Vendora. Our team
								will review your application within 24-48 hours.
							</p>
						</div>
					</div>

					<div className="space-y-4 max-h-96 overflow-y-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Business Name *
								</label>
								<Input
									value={formData.businessName}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInputChange("businessName", e.target.value)
									}
									placeholder="Your business name"
									className={errors.businessName ? "border-red-500" : ""}
								/>
								{errors.businessName && (
									<p className="text-sm text-red-500 mt-1">
										{errors.businessName}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Business Type *
								</label>
								<Select
									value={formData.businessType}
									onValueChange={(value: string) =>
										handleInputChange("businessType", value)
									}
								>
									<SelectTrigger
										className={errors.businessType ? "border-red-500" : ""}
									>
										<SelectValue placeholder="Select business type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="individual">
											Individual/Sole Proprietor
										</SelectItem>
										<SelectItem value="llc">LLC</SelectItem>
										<SelectItem value="corporation">Corporation</SelectItem>
										<SelectItem value="partnership">Partnership</SelectItem>
										<SelectItem value="nonprofit">Nonprofit</SelectItem>
									</SelectContent>
								</Select>
								{errors.businessType && (
									<p className="text-sm text-red-500 mt-1">
										{errors.businessType}
									</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Business Description *
							</label>
							<Textarea
								value={formData.businessDescription}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									handleInputChange("businessDescription", e.target.value)
								}
								placeholder="Describe your business, products, and what makes you unique..."
								rows={3}
								className={errors.businessDescription ? "border-red-500" : ""}
							/>
							{errors.businessDescription && (
								<p className="text-sm text-red-500 mt-1">
									{errors.businessDescription}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Contact Email *
								</label>
								<Input
									type="email"
									value={formData.contactEmail}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInputChange("contactEmail", e.target.value)
									}
									placeholder="business@example.com"
									className={errors.contactEmail ? "border-red-500" : ""}
								/>
								{errors.contactEmail && (
									<p className="text-sm text-red-500 mt-1">
										{errors.contactEmail}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Contact Phone *
								</label>
								<Input
									value={formData.contactPhone}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInputChange("contactPhone", e.target.value)
									}
									placeholder="+1 (555) 123-4567"
									className={errors.contactPhone ? "border-red-500" : ""}
								/>
								{errors.contactPhone && (
									<p className="text-sm text-red-500 mt-1">
										{errors.contactPhone}
									</p>
								)}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Business Address *
							</label>
							<Textarea
								value={formData.businessAddress}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									handleInputChange("businessAddress", e.target.value)
								}
								placeholder="Full business address..."
								rows={2}
								className={errors.businessAddress ? "border-red-500" : ""}
							/>
							{errors.businessAddress && (
								<p className="text-sm text-red-500 mt-1">
									{errors.businessAddress}
								</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium mb-2">
									Tax ID (optional)
								</label>
								<Input
									value={formData.taxId}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInputChange("taxId", e.target.value)
									}
									placeholder="For tax purposes"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium mb-2">
									Website (optional)
								</label>
								<Input
									value={formData.website}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										handleInputChange("website", e.target.value)
									}
									placeholder="https://yourwebsite.com"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Product Categories *
							</label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
								{[
									"Home & Living",
									"Fashion",
									"Art & Collectibles",
									"Jewelry",
									"Food & Beverages",
									"Beauty & Wellness",
									"Books",
									"Electronics",
									"Sports & Outdoors",
									"Toys & Games",
									"Pet Supplies",
									"Other",
								].map((category: string) => (
									<button
										key={category}
										type="button"
										onClick={() => {
											const currentProducts = formData.products;
											const updatedProducts = currentProducts.includes(category)
												? currentProducts.filter((p: string) => p !== category)
												: [...currentProducts, category];
											setFormData((prev) => ({
												...prev,
												products: updatedProducts,
											}));
										}}
										className={`p-2 text-sm rounded-md border transition-colors ${
											formData.products.includes(category)
												? "bg-terracotta-100 border-terracotta-300 text-terracotta-700"
												: "bg-gray-50 border-gray-200 hover:bg-gray-100"
										}`}
									>
										{category}
									</button>
								))}
							</div>
							{errors.products && (
								<p className="text-sm text-red-500 mt-1">{errors.products}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Your Experience *
							</label>
							<Textarea
								value={formData.experience}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									handleInputChange("experience", e.target.value)
								}
								placeholder="Tell us about your experience in your field, previous sales, etc..."
								rows={3}
								className={errors.experience ? "border-red-500" : ""}
							/>
							{errors.experience && (
								<p className="text-sm text-red-500 mt-1">{errors.experience}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium mb-2">
								Why do you want to sell on Vendora? *
							</label>
							<Textarea
								value={formData.motivation}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									handleInputChange("motivation", e.target.value)
								}
								placeholder="What motivates you to join our platform?"
								rows={3}
								className={errors.motivation ? "border-red-500" : ""}
							/>
							{errors.motivation && (
								<p className="text-sm text-red-500 mt-1">{errors.motivation}</p>
							)}
						</div>

						{errors.submit && (
							<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-800">{errors.submit}</p>
							</div>
						)}
					</div>

					<div className="flex gap-3 pt-6 border-t">
						<Button
							variant="outline"
							onClick={onClose}
							className="flex-1"
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmitApplication}
							className="flex-1 bg-terracotta-600 hover:bg-terracotta-700"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit Application"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
