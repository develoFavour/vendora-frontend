"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
	CheckCircle2,
	Eye,
	EyeOff,
	User,
	Mail,
	Phone,
	MapPin,
	Lock,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
	const router = useRouter();
	// const [selectedRole, setSelectedRole] = useState<"customer" | "vendor">(
	// 	"customer"
	// );
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const payload = {
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				address: formData.address,
				password: formData.password,
			};
			const response = await api.post("/api/v1/auth/register", payload);
			const token: string | undefined = response.data?.data?.accessToken;

			if (response?.status && response.status < 400) {
				setSuccess(true);
				toast.success(
					"Account created successfully! A verification email has been sent to your email, please verify your account."
				);
				if (token) {
					localStorage.setItem("accessToken", token);
				}
				// Pass the email for display on the verification page
				router.push(`/signup/verification-sent?email=${encodeURIComponent(formData.email)}`);
			} else {
				setError("Signup failed");
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
			setError(message);
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			{/* Header */}
			<div className="text-center mb-10">
				<h2 className="text-4xl font-bold tracking-tight mb-3">
					Create <span className="italic text-primary">Account.</span>
				</h2>
				<p className="text-zinc-600 font-medium">Join our global community of artisans.</p>
			</div>

			{/* Success message */}
			{success && (
				<div className="mb-8 p-6 backdrop-blur-xl bg-primary/5 border border-primary/20 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl shadow-primary/5">
					<div className="flex items-start gap-4">
						<div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
							<CheckCircle2 className="w-5 h-5 text-white" />
						</div>
						<div className="space-y-1">
							<p className="text-lg font-bold text-zinc-900 leading-tight">
								Welcome to the family!
							</p>
							<p className="text-sm text-zinc-600 leading-relaxed font-medium">
								We&apos;ve sent a verification link to <span className="text-primary font-bold">{formData.email}</span>. Please verify to begin your experience.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Error message */}
			{error && (
				<div className="mb-6 p-4 backdrop-blur-xl bg-red-50/50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
					<p className="text-xs text-red-600 font-bold uppercase tracking-widest">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-8 pb-12">
				{/* Form fields with glassmorphic styling */}
				<div className="space-y-4">
					{[
						{ icon: User, name: "name", placeholder: "Full Name", type: "text" },
						{ icon: Mail, name: "email", placeholder: "Email Address", type: "email" },
						{ icon: Phone, name: "phone", placeholder: "Phone Number", type: "tel" },
						{ icon: MapPin, name: "address", placeholder: "Primary Address", type: "text" }
					].map((field) => (
						<div key={field.name} className="relative group">
							<field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 transition-colors group-focus-within:text-primary" />
							<input
								type={field.type}
								value={formData[field.name as keyof typeof formData]}
								onChange={(e) =>
									setFormData({ ...formData, [field.name]: e.target.value })
								}
								className="w-full pl-12 pr-4 py-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white/40 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
								placeholder={field.placeholder}
								required
							/>
						</div>
					))}

					<div className="relative group">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 transition-colors group-focus-within:text-primary" />
						<input
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							className="w-full pl-12 pr-12 py-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white/40 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
							placeholder="Create Password"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors z-10"
						>
							{showPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>

					<div className="relative group">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 transition-colors group-focus-within:text-primary" />
						<input
							type={showConfirmPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData({ ...formData, confirmPassword: e.target.value })
							}
							className="w-full pl-12 pr-12 py-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white/40 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
							placeholder="Confirm Password"
							required
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors z-10"
						>
							{showConfirmPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

				{/* Submit button */}
				<Button
					type="submit"
					disabled={loading}
					className="w-full py-8 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-none"
				>
					{loading ? (
						<div className="flex items-center justify-center gap-3">
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Crafting Account...
						</div>
					) : (
						<div className="flex items-center justify-center gap-3 tracking-[0.3em] uppercase text-xs">
							<Sparkles className="w-4 h-4" />
							Begin Your Journey
						</div>
					)}
				</Button>

				{/* Sign in link */}
				<p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">
					Already a Member?{" "}
					<Link
						href="/login"
						className="text-primary hover:text-primary/80 transition-colors ml-2"
					>
						Sign In
					</Link>
				</p>
			</form>
		</div>
	);
}
