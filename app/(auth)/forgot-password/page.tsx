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

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-background to-sage/10 px-4 py-12">
				<div className="w-full max-w-md">
					<Card className="border-border/50 shadow-lg text-center">
						<CardHeader>
							<div className="mx-auto w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mb-4">
								<CheckCircle2 className="h-6 w-6 text-sage" />
							</div>
							<CardTitle className="font-serif text-2xl">
								Check Your Email
							</CardTitle>
							<CardDescription>
								We&apos;ve sent password reset instructions to{" "}
								<strong>{email}</strong>
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground">
								Didn&apos;t receive the email? Check your spam folder or try
								again.
							</p>
							<Button
								variant="outline"
								onClick={() => setSuccess(false)}
								className="w-full"
							>
								Try Another Email
							</Button>
						</CardContent>
						<CardFooter className="flex justify-center">
							<Link
								href="/auth/login"
								className="text-sm text-sage hover:text-sage/80 font-medium transition-colors inline-flex items-center gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								Back to Sign In
							</Link>
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-background to-sage/10 px-4 py-12">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link href="/" className="inline-block">
						<h1 className="font-serif text-3xl font-bold text-foreground">
							Vendora
						</h1>
					</Link>
					<p className="text-muted-foreground mt-2">Reset your password</p>
				</div>

				<Card className="border-border/50 shadow-lg">
					<CardHeader>
						<CardTitle className="font-serif text-2xl">
							Forgot Password?
						</CardTitle>
						<CardDescription>
							Enter your email address and we&apos;ll send you instructions to
							reset your password
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10"
										required
									/>
								</div>
							</div>

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? "Sending..." : "Send Reset Instructions"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center">
						<Link
							href="/auth/login"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Sign In
						</Link>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
