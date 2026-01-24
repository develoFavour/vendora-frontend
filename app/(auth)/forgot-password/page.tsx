"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		// TODO: Implement actual password reset logic with backend
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log("Password reset requested for:", email);
			setSuccess(true);
		} catch (err) {
			console.log(err);
			setError("Failed to send reset email. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			{/* Header */}
			<div className="text-center mb-10">
				<h2 className="text-4xl font-bold tracking-tight mb-3">
					Forgot <span className="italic text-primary">Password?</span>
				</h2>
				<p className="text-zinc-600 font-medium">No worries, we&apos;ll get you back in.</p>
			</div>

			{success ? (
				<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<div className="p-8 backdrop-blur-xl bg-primary/5 border border-primary/20 rounded-[2rem] text-center shadow-2xl shadow-primary/5">
						<div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
							<CheckCircle2 className="h-8 w-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-zinc-900 mb-2">Check Your Email</h3>
						<p className="text-zinc-600 leading-relaxed font-medium">
							We&apos;ve sent reset instructions to <br />
							<span className="text-primary font-bold">{email}</span>
						</p>
					</div>

					<div className="space-y-4">
						<Button
							variant="outline"
							onClick={() => setSuccess(false)}
							className="w-full py-6 rounded-2xl border-white/40 bg-white/20 hover:bg-white/40 transition-all font-bold text-xs uppercase tracking-widest"
						>
							Try Another Email
						</Button>
						<Link
							href="/login"
							className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Sign In
						</Link>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-8">
					{error && (
						<div className="p-4 backdrop-blur-xl bg-red-50/50 border border-red-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
							<p className="text-xs text-red-600 font-bold uppercase tracking-widest text-center">{error}</p>
						</div>
					)}

					<div className="space-y-2">
						<div className="relative group">
							<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 z-10 transition-colors group-focus-within:text-primary" />
							<input
								type="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full pl-12 pr-4 py-4 backdrop-blur-xl bg-white/20 border border-white/40 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white/40 transition-all text-zinc-900 placeholder:text-zinc-400 font-medium"
								required
							/>
						</div>
					</div>

					<Button
						type="submit"
						disabled={loading}
						className="w-full py-8 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border-none"
					>
						{loading ? (
							<div className="flex items-center justify-center gap-3">
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								Sending...
							</div>
						) : (
							<div className="flex items-center justify-center gap-3 tracking-[0.3em] uppercase text-xs">
								Send Reset Link
							</div>
						)}
					</Button>

					<div className="pt-4">
						<Link
							href="/login"
							className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-primary transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Sign In
						</Link>
					</div>
				</form>
			)}
		</div>
	);
}
