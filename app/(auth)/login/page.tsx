"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, setAuthTokens } from "@/lib/api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useCartMerge } from "@/hooks/use-cart-merge";

export default function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const router = useRouter();
	const searchParams = useSearchParams();
	const { setAuth } = useAuthStore();
	const { mergeCart } = useCartMerge();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const { data } = await api.post("/api/v1/auth/login", formData);
			// Support both possible payload shapes
			const token: string | undefined =
				data?.accessToken ?? data?.data?.accessToken;
			const refreshToken: string | undefined =
				data?.refreshToken ?? data?.data?.refreshToken;
			const user = data?.user ?? data?.data?.user;

			if (token && user) {
				setAuth(user, token, refreshToken);
				setAuthTokens(token, refreshToken);
				// Merge guest cart → real cart (non-blocking)
				await mergeCart();
			}

			toast.success("Signed in successfully");

			// Honor redirect param (e.g. from checkout gate)
			const redirectTo = searchParams.get("redirect");
			if (redirectTo) {
				router.push(redirectTo);
			} else if (user?.role === "admin") {
				router.push("/admin/dashboard");
			} else if (user?.role === "vendor" || user?.role === "seller") {
				router.push("/vendor/dashboard");
			} else {
				router.push("/buyer/dashboard");
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Login failed";
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
					Welcome <span className="italic text-primary">Back.</span>
				</h2>
				<p className="text-zinc-600 font-medium">Continue your artisan journey.</p>
			</div>

			{/* Error message */}
			{error && (
				<div className="mb-6 p-4 backdrop-blur-xl bg-red-50/50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
					<p className="text-xs text-red-600 font-bold uppercase tracking-widest">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Form fields with glassmorphic styling */}
				<div className="space-y-5">
					<div className="relative group">
						<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 transition-colors group-focus-within:text-primary" />
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="w-full pl-12 pr-4 py-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white/40 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
							placeholder="Email Address"
							required
						/>
					</div>

					<div className="relative group">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 transition-colors group-focus-within:text-primary" />
						<input
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={(e) =>
								setFormData({ ...formData, password: e.target.value })
							}
							className="w-full pl-12 pr-12 py-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white/40 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
							placeholder="Password"
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
				</div>

				{/* Forgot password link */}
				<div className="flex justify-end">
					<Link
						href="/forgot-password"
						className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-colors"
					>
						Forgot password?
					</Link>
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
							Authenticating...
						</div>
					) : (
						<div className="flex items-center justify-center gap-3 tracking-[0.3em] uppercase text-xs">
							<LogIn className="w-4 h-4" />
							Enter Boutique
						</div>
					)}
				</Button>

				{/* Sign up link */}
				<p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">
					New to Vendora?{" "}
					<Link
						href="/signup"
						className="text-primary hover:text-primary/80 transition-colors ml-2"
					>
						Create Account
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
