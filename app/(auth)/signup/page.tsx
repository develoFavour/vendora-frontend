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
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignupPage() {
	const router = useRouter();
	const [selectedRole, setSelectedRole] = useState<"customer" | "vendor">(
		"customer"
	);
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

		// Debug: Log the environment variable
		const apiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
		console.log("API URL from env:", apiUrl);
		console.log("Full URL:", `${apiUrl}/api/v1/auth/register`);

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/auth/register`,
				{ ...formData, role: selectedRole }
			);

			console.log("RESPONSE:", response);
			const data = response;

			if (response) {
				setSuccess(true);

				toast.success(
					"Account created successfully! A verification email has been sent to your email, please verify your account."
				);
				localStorage.setItem("accessToken", data.data.accessToken);
				router.push("/login");
			} else {
				setError("Signup failed");
			}
		} catch (err) {
			console.log(err);
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			{/* Header */}
			<div className="text-center mb-8">
				<h2 className="font-serif text-4xl font-bold text-gray-900 mb-2">
					Create Account
				</h2>
				<p className="text-gray-700">Join the Vendora community today</p>
			</div>

			{/* Success message */}
			{success && (
				<div className="mb-6 p-4 backdrop-blur-md bg-sage-50/80 border border-sage-200/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
					<div className="flex items-start gap-3">
						<CheckCircle2 className="w-5 h-5 text-sage-700 mt-0.5 flex-shrink-0" />
						<div className="text-sm">
							<p className="font-semibold text-sage-900 mb-1">
								Account created successfully!
							</p>
							<p className="text-sage-800">
								We&apos;ve sent a verification email to{" "}
								<strong>{formData.email}</strong>. Please check your inbox and
								click the verification link to continue.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Error message */}
			{error && (
				<div className="mb-6 p-4 backdrop-blur-md bg-red-50/80 border border-red-200/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
					<p className="text-sm text-red-900 font-medium">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Role selection */}
				<div>
					<label className="block text-sm font-medium text-gray-900 mb-3">
						I want to
					</label>
					<div className="grid grid-cols-2 gap-3">
						<button
							type="button"
							onClick={() => setSelectedRole("customer")}
							className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
								selectedRole === "customer"
									? "border-sage-600/60 backdrop-blur-md bg-sage-100/40 shadow-lg scale-[1.02]"
									: "border-white/40 backdrop-blur-sm bg-white/30 hover:border-sage-400/50 hover:bg-white/40 hover:scale-[1.01]"
							}`}
						>
							<div className="flex flex-col items-center gap-2">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
										selectedRole === "customer"
											? "bg-sage-600 text-white shadow-lg"
											: "bg-gray-100/80 text-gray-600 group-hover:bg-gray-200/80"
									}`}
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
										/>
									</svg>
								</div>
								<div className="text-center">
									<div className="font-semibold text-gray-900">
										Shop Products
									</div>
									<div className="text-xs text-gray-700">Customer Account</div>
								</div>
							</div>
							{selectedRole === "customer" && (
								<div className="absolute top-2 right-2 animate-in zoom-in duration-200">
									<CheckCircle2 className="w-5 h-5 text-sage-600" />
								</div>
							)}
						</button>

						<button
							type="button"
							onClick={() => setSelectedRole("vendor")}
							className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
								selectedRole === "vendor"
									? "border-terracotta-600/60 backdrop-blur-md bg-terracotta-100/40 shadow-lg scale-[1.02]"
									: "border-white/40 backdrop-blur-sm bg-white/30 hover:border-terracotta-400/50 hover:bg-white/40 hover:scale-[1.01]"
							}`}
						>
							<div className="flex flex-col items-center gap-2">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
										selectedRole === "vendor"
											? "bg-terracotta-600 text-white shadow-lg"
											: "bg-gray-100/80 text-gray-600 group-hover:bg-gray-200/80"
									}`}
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
										/>
									</svg>
								</div>
								<div className="text-center">
									<div className="font-semibold text-gray-900">
										Sell Products
									</div>
									<div className="text-xs text-gray-700">Vendor Account</div>
								</div>
							</div>
							{selectedRole === "vendor" && (
								<div className="absolute top-2 right-2 animate-in zoom-in duration-200">
									<CheckCircle2 className="w-5 h-5 text-terracotta-600" />
								</div>
							)}
						</button>
					</div>
				</div>

				{/* Form fields with glassmorphic styling */}
				<div className="space-y-4">
					<div className="relative group">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 z-10 transition-colors group-focus-within:text-sage-600" />
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className="w-full pl-11 pr-4 py-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 focus:bg-white/50 transition-all text-gray-900 placeholder:text-gray-600"
							placeholder="Full Name"
							required
						/>
					</div>

					<div className="relative group">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 z-10 transition-colors group-focus-within:text-sage-600" />
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="w-full pl-11 pr-4 py-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 focus:bg-white/50 transition-all text-gray-900 placeholder:text-gray-600"
							placeholder="Email Address"
							required
						/>
					</div>

					<div className="relative group">
						<Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 z-10 transition-colors group-focus-within:text-sage-600" />
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
							}
							className="w-full pl-11 pr-4 py-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 focus:bg-white/50 transition-all text-gray-900 placeholder:text-gray-600"
							placeholder="Phone Number"
							required
						/>
					</div>

					<div className="relative group">
						<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 z-10 transition-colors group-focus-within:text-sage-600" />
						<input
							type="text"
							value={formData.address}
							onChange={(e) =>
								setFormData({ ...formData, address: e.target.value })
							}
							className="w-full pl-11 pr-4 py-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 focus:bg-white/50 transition-all text-gray-900 placeholder:text-gray-600"
							placeholder="Address"
							required
						/>
					</div>

					<div className="relative group">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 z-10 transition-colors group-focus-within:text-sage-600" />
						<input
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							className="w-full pl-11 pr-12 py-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 focus:bg-white/50 transition-all text-gray-900 placeholder:text-gray-600"
							placeholder="Password"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors z-10"
						>
							{showPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>

					<div className="relative group">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 z-10 transition-colors group-focus-within:text-sage-600" />
						<input
							type={showConfirmPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData({ ...formData, confirmPassword: e.target.value })
							}
							className="w-full pl-11 pr-12 py-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-xl focus:ring-2 focus:ring-sage-500/50 focus:border-sage-500/50 focus:bg-white/50 transition-all text-gray-900 placeholder:text-gray-600"
							placeholder="Confirm Password"
							required
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors z-10"
						>
							{showConfirmPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				{/* Submit button */}
				<Button
					type="submit"
					disabled={loading}
					className="w-full py-6 bg-gradient-to-r from-sage-600 to-sage-700 hover:from-sage-700 hover:to-sage-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							Creating Account...
						</div>
					) : (
						<div className="flex items-center justify-center gap-2">
							<Sparkles className="w-5 h-5" />
							Create Account
						</div>
					)}
				</Button>

				{/* Sign in link */}
				<p className="text-center text-sm text-gray-800">
					Already have an account?{" "}
					<Link
						href="/login"
						className="font-semibold text-sage-700 hover:text-sage-800 transition-colors"
					>
						Sign in
					</Link>
				</p>
			</form>
		</div>
	);
}
