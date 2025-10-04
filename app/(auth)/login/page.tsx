"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("accessToken", data.accessToken);
				window.location.href = "/dashboard";
			} else {
				setError(data.message || "Login failed");
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
					Welcome Back
				</h2>
				<p className="text-gray-700">Sign in to your Vendora account</p>
			</div>

			{/* Error message */}
			{error && (
				<div className="mb-6 p-4 backdrop-blur-md bg-red-50/80 border border-red-200/50 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 shadow-lg">
					<p className="text-sm text-red-900 font-medium">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Form fields with glassmorphic styling */}
				<div className="space-y-4">
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
				</div>

				{/* Forgot password link */}
				<div className="flex justify-end">
					<Link
						href="/forgot-password"
						className="text-sm font-medium text-sage-700 hover:text-sage-800 transition-colors"
					>
						Forgot password?
					</Link>
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
							Signing In...
						</div>
					) : (
						<div className="flex items-center justify-center gap-2">
							<LogIn className="w-5 h-5" />
							Sign In
						</div>
					)}
				</Button>

				{/* Sign up link */}
				<p className="text-center text-sm text-gray-800">
					Don&apos;t have an account?{" "}
					<Link
						href="/signup"
						className="font-semibold text-sage-700 hover:text-sage-800 transition-colors"
					>
						Create one
					</Link>
				</p>
			</form>

			{/* Divider */}
			<div className="relative my-8">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-white/40 backdrop-blur-sm"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-4 backdrop-blur-md bg-white/30 text-gray-700 rounded-full">
						Quick Access
					</span>
				</div>
			</div>

			{/* Quick access cards */}
			<div className="grid grid-cols-2 gap-3">
				<Link
					href="/signup"
					className="group p-4 rounded-xl border-2 border-white/40 backdrop-blur-sm bg-white/30 hover:border-sage-400/50 hover:bg-white/40 hover:scale-[1.02] transition-all duration-300"
				>
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="w-10 h-10 rounded-full bg-sage-100/80 text-sage-700 flex items-center justify-center group-hover:bg-sage-200/80 transition-colors">
							<svg
								className="w-5 h-5"
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
						<div className="text-sm font-semibold text-gray-900">Shop Now</div>
					</div>
				</Link>

				<Link
					href="/signup"
					className="group p-4 rounded-xl border-2 border-white/40 backdrop-blur-sm bg-white/30 hover:border-terracotta-400/50 hover:bg-white/40 hover:scale-[1.02] transition-all duration-300"
				>
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="w-10 h-10 rounded-full bg-terracotta-100/80 text-terracotta-700 flex items-center justify-center group-hover:bg-terracotta-200/80 transition-colors">
							<svg
								className="w-5 h-5"
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
						<div className="text-sm font-semibold text-gray-900">
							Start Selling
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
