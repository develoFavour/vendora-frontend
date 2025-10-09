// Customer Profile Step Component
"use client";

import { useEffect, useRef, useState } from "react";
import { useOnboarding } from "@/lib/onboarding-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/onboarding";
import { customerOnboardingAPI } from "@/lib/api";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { OnboardingSuccessCelebration } from "@/components/onboarding-success-celebration";
import { useRouter } from "next/navigation";

export function CustomerProfile() {
	const { state, setStepData, clearError, setLoading, setError } =
		useOnboarding();
	const router = useRouter();
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [showCelebration, setShowCelebration] = useState(false);
	const mountedRef = useRef(true);

	const profile = (state.stepData.profile as Record<string, string>) || {};
	const handleProfileChange = (key: string, value: string) => {
		const newProfile = { ...profile, [key]: value };
		setStepData("profile", newProfile);
		clearError("profile");
	};

	useEffect(() => {
		// Clear any stale errors for this step
		clearError("profile");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Track mounted state to avoid updating state after unmount
	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate type and size (<= 5MB)
			const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
			if (!allowed.includes(file.type)) {
				toast.error("Unsupported image format. Use JPG, PNG, or WEBP.");
				return;
			}
			const maxBytes = 5 * 1024 * 1024;
			if (file.size > maxBytes) {
				toast.error("Image too large. Max size is 5MB.");
				return;
			}
			// Revoke old preview URL first
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			setProfilePicture(file);
		}
	};

	// Cleanup object URL on unmount
	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const handleNext = async () => {
		// Validate required fields
		if (!profile.location) {
			setError("profile", "Please enter your location");
			return;
		}

		setLoading(true);
		clearError("profile");
		setShowCelebration(false);

		try {
			await toast.promise(
				customerOnboardingAPI.completeOnboarding({
					location: profile.location,
					bio: profile.bio || "",
					profilePicture: profilePicture || undefined,
				}),
				{
					loading: "Saving your profile...",
					success: "Profile saved",
					error: (err) =>
						err instanceof Error ? err.message : "Failed to complete profile",
				}
			);

			// Only proceed if still mounted
			if (!mountedRef.current) return;

			setStepData("profile", {
				...profile,
				profilePicture: profilePicture?.name,
			});
			clearError("profile");
			// Show celebration and redirect based on role
			setShowCelebration(true);
			const role = state.userRole;
			const destination =
				role === "vendor" ? "/vendor/dashboard" : "/customer/dashboard";
			setTimeout(() => {
				if (mountedRef.current) router.push(destination);
			}, 7500);
		} catch (error) {
			// Ensure we do not show celebration on error
			if (mountedRef.current) setShowCelebration(false);
			setError(
				"profile",
				error instanceof Error ? error.message : "Failed to complete profile"
			);
		} finally {
			if (mountedRef.current) setLoading(false);
		}
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
						<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
							{previewUrl ? (
								<Image
									height={64}
									width={64}
									src={previewUrl}
									alt="Profile preview"
									className="w-full h-full object-cover"
								/>
							) : (
								<span className="text-2xl">👤</span>
							)}
						</div>
						<div>
							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
								id="profile-picture"
							/>
							<Button
								variant="outline"
								onClick={() =>
									document.getElementById("profile-picture")?.click()
								}
								className="mb-2"
							>
								{profilePicture ? "Change Photo" : "Upload Photo"}
							</Button>
							<p className="text-xs text-muted-foreground">
								JPG, PNG up to 5MB
							</p>
							{profilePicture && (
								<p className="text-xs text-green-600 mt-1">
									{profilePicture.name} selected
								</p>
							)}
						</div>
					</div>
				</FormField>
			</div>

			<div className="flex justify-end pt-4">
				<Button
					onClick={handleNext}
					disabled={state.isLoading}
					className="bg-black hover:bg-black/80 cursor-pointer transition-all disabled:opacity-60"
				>
					Complete Setup
					<ArrowRight className="w-4 h-4 ml-2" />
				</Button>
			</div>

			{showCelebration && (
				<OnboardingSuccessCelebration
					message="You're all set!"
					subMessage="Welcome to Vendora — redirecting you to your dashboard"
				/>
			)}
		</div>
	);
}
