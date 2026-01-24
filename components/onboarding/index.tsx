// Shared UI components for the onboarding flow
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useOnboardingStore } from "@/stores/onboarding-store";

// Progress Indicator Component
interface ProgressIndicatorProps {
	steps: Array<{ id: string; title: string; isOptional?: boolean }>;
}

export function ProgressIndicator({ steps }: ProgressIndicatorProps) {
	const { currentStep, isStepCompleted } = useOnboardingStore();

	const progressPercentage = ((currentStep + 1) / steps.length) * 100;

	return (
		<div className="w-full mb-8">
			<div className="flex items-center justify-between mb-4">
				<span className="text-sm text-muted-foreground">
					Step {currentStep + 1} of {steps.length}
				</span>
				<span className="text-sm text-muted-foreground">
					{Math.round(progressPercentage)}% complete
				</span>
			</div>

			<Progress value={progressPercentage} className="h-2 mb-6" />

			<div className="flex items-center justify-between">
				{steps.map((step, index) => {
					const isCompleted = isStepCompleted(step.id);
					const isCurrent = index === currentStep;
					const isAccessible = index <= currentStep || isCompleted;

					return (
						<div key={step.id} className="flex flex-col items-center relative">
							{/* Step Circle */}
							<div className="flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 relative z-10">
								{isCompleted ? (
									<CheckCircle2 className="w-5 h-5 text-sage-600" />
								) : isCurrent ? (
									<Circle className="w-5 h-5 text-sage-600 fill-current" />
								) : (
									<Circle
										className={`w-5 h-5 ${
											isAccessible
												? "text-muted-foreground"
												: "text-muted-foreground/50"
										}`}
									/>
								)}
							</div>

							{/* Step Title */}
							<div className="text-center">
								<div
									className={`text-xs font-medium ${
										isCurrent
											? "text-foreground"
											: isCompleted
											? "text-sage-600"
											: isAccessible
											? "text-muted-foreground"
											: "text-muted-foreground/50"
									}`}
								>
									{step.title}
								</div>
								{step.isOptional && (
									<Badge variant="secondary" className="text-xs mt-1">
										Optional
									</Badge>
								)}
							</div>

							{/* Connection Line */}
							{index < steps.length - 1 && (
								<div
									className={`absolute top-4 left-8 w-full h-0.5 -z-10 ${
										isCompleted ? "bg-sage-600" : "bg-muted"
									}`}
									style={{ width: "calc(100vw / 6)" }}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

// Onboarding Layout Component
interface OnboardingLayoutProps {
	children: React.ReactNode;
	title: string;
	description?: string;
	showProgress?: boolean;
	steps?: Array<{ id: string; title: string; isOptional?: boolean }>;
	showBackButton?: boolean;
	showNextButton?: boolean;
	nextButtonText?: string;
	nextButtonDisabled?: boolean;
	onNext?: () => void;
	onBack?: () => void;
	isLoading?: boolean;
}

export function OnboardingLayout({
	children,
	title,
	description,
	showProgress = true,
	steps = [],
	showBackButton = true,
	showNextButton = true,
	nextButtonText = "Continue",
	nextButtonDisabled = false,
	onNext,
	onBack,
	isLoading = false,
}: OnboardingLayoutProps) {
	const { currentStep, prevStep, nextStep, canProceedToNext, errors } =
		useOnboardingStore();

	const handleNext = () => {
		if (onNext) {
			onNext();
		} else {
			nextStep();
		}
	};

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			prevStep();
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-sage/5 via-background to-terracotta/5">
			<div className="container mx-auto px-4 py-8">
				<div className="max-w-2xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/10 mb-6">
							<div className="w-8 h-8 rounded-full bg-sage-600" />
						</div>

						<h1 className="font-serif text-3xl font-bold text-balance mb-2">
							{title}
						</h1>

						{description && (
							<p className="text-muted-foreground text-lg leading-relaxed">
								{description}
							</p>
						)}
					</div>

					{/* Progress Indicator */}
					{showProgress && steps.length > 0 && (
						<ProgressIndicator steps={steps} />
					)}

					{/* Error Display */}
					{Object.keys(errors).length > 0 && (
						<div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 mt-0.5">
									<svg
										className="w-5 h-5 text-red-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="text-sm font-semibold text-red-800 mb-1">
										Error
									</h3>
									{Object.entries(errors).map(([stepId, error]) => (
										<p key={stepId} className="text-sm text-red-700">
											{error}
										</p>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Main Content */}
					<Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-xl">
						<CardContent className="p-8">{children}</CardContent>
					</Card>

					{/* Navigation */}
					{(showBackButton || showNextButton) && (
						<div className="flex items-center justify-between mt-8">
							{/* Back Button */}
							{showBackButton && currentStep > 0 ? (
								<Button
									variant="outline"
									onClick={handleBack}
									className="bg-transparent"
								>
									<ArrowLeft className="w-4 h-4 mr-2" />
									Back
								</Button>
							) : (
								<div className="w-1/2" />
							)}

							{showNextButton && (
								<Button
									onClick={handleNext}
									disabled={nextButtonDisabled || !canProceedToNext()}
									className="bg-black hover:bg-black/80 cursor-pointer transition-all"
								>
									{isLoading ? (
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											Processing...
										</div>
									) : (
										<>
											{nextButtonText}
											<ArrowRight className="w-4 h-4 ml-2" />
										</>
									)}
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Category Selection Component
interface Category {
	id: string;
	name: string;
	icon: string;
	description?: string;
	color: string;
}

interface CategorySelectorProps {
	categories: Category[];
	selectedCategories: string[];
	onSelectionChange: (categories: string[]) => void;
	title?: string;
	description?: string;
	maxSelections?: number;
	minSelections?: number;
	onNext?: () => void;
	showNextButton?: boolean;
	nextButtonText?: string;
}

export function CategorySelector({
	categories,
	selectedCategories,
	onSelectionChange,
	title = "Select Categories",
	description = "Choose the categories that interest you most",
	maxSelections = 3,
	minSelections = 1,
	onNext,
	showNextButton = true,
	nextButtonText = "Continue",
}: CategorySelectorProps) {
	const handleCategoryToggle = (categoryId: string) => {
		const isSelected = selectedCategories.includes(categoryId);

		if (isSelected) {
			// Remove category
			onSelectionChange(selectedCategories.filter((id) => id !== categoryId));
		} else {
			// Add category (respect max selections)
			if (selectedCategories.length < maxSelections) {
				onSelectionChange([...selectedCategories, categoryId]);
			}
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="font-serif text-2xl font-bold mb-2">{title}</h2>
				<p className="text-muted-foreground">{description}</p>
				<p className="text-sm text-muted-foreground mt-2">
					Select {minSelections}-{maxSelections} categories •{" "}
					{selectedCategories.length} selected
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{categories.map((category) => {
					const isSelected = selectedCategories.includes(category.id);

					return (
						<Card
							key={category.id}
							className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
								isSelected
									? "ring-2 ring-sage-500 bg-sage-50 border-sage-200"
									: "hover:shadow-lg bg-white/50"
							}`}
							onClick={() => handleCategoryToggle(category.id)}
						>
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div
										className={`text-3xl ${
											isSelected ? "grayscale-0" : "grayscale"
										}`}
									>
										{category.icon}
									</div>

									<div className="flex-1">
										<h3 className="font-semibold text-lg mb-1">
											{category.name}
										</h3>
										{category.description && (
											<p className="text-sm text-muted-foreground">
												{category.description}
											</p>
										)}
									</div>

									<div
										className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
											isSelected
												? "bg-sage-600 border-sage-600"
												: "border-muted-foreground"
										}`}
									>
										{isSelected && (
											<CheckCircle2 className="w-4 h-4 text-white" />
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{selectedCategories.length >= maxSelections && (
				<div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
					<p className="text-sm text-amber-800">
						You&apos;ve reached the maximum of {maxSelections} categories
					</p>
				</div>
			)}

			{showNextButton && onNext && (
				<div className="flex justify-end pt-4">
					<Button
						onClick={onNext}
						disabled={selectedCategories.length < minSelections}
						className="bg-black hover:bg-black/80 cursor-pointer transition-all"
					>
						{nextButtonText}
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			)}
		</div>
	);
}

// Form Field Components
export function FormField({
	label,
	error,
	children,
	required = false,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
	required?: boolean;
}) {
	return (
		<div className="space-y-2">
			<label className="block text-sm font-medium text-foreground">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</label>

			<div className="relative">{children}</div>

			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}

// Success Animation Component
export function SuccessAnimation({
	title,
	description,
	onContinue,
}: {
	title: string;
	description: string;
	onContinue: () => void;
}) {
	return (
		<div className="text-center py-8">
			<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
				<CheckCircle2 className="w-8 h-8 text-green-600" />
			</div>

			<h2 className="font-serif text-2xl font-bold mb-2">{title}</h2>
			<p className="text-muted-foreground mb-6">{description}</p>

			<Button onClick={onContinue} className="bg-sage-600 hover:bg-sage-700">
				Continue to Next Step
				<ArrowRight className="w-4 h-4 ml-2" />
			</Button>
		</div>
	);
}
