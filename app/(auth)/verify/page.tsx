"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token");

	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [message, setMessage] = useState("");
	const [resending, setResending] = useState(false);

	useEffect(() => {
		if (!token) {
			setStatus("error");
			setMessage("Invalid verification link");
			return;
		}

		// Call your backend verification endpoint
		const verifyEmail = async () => {
			try {
				const response = await fetch(`/api/auth/verify?token=${token}`);
				const data = await response.json();

				if (response.ok) {
					setStatus("success");
					setMessage("Your email has been verified successfully!");
					// Redirect to onboarding after 2 seconds
					setTimeout(() => {
						router.push("/onboarding");
					}, 2000);
				} else {
					setStatus("error");
					setMessage(data.message || "Verification failed");
				}
			} catch (error) {
				console.log(error);
				setStatus("error");
				setMessage("Something went wrong. Please try again.");
			}
		};

		verifyEmail();
	}, [token, router]);

	const handleResendEmail = async () => {
		setResending(true);
		try {
			// Call your backend to resend verification email
			const response = await fetch("/api/auth/resend-verification", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});

			if (response.ok) {
				setMessage("Verification email sent! Check your inbox.");
			}
		} catch (error) {
			console.log(error);
			setMessage("Failed to resend email. Please try again.");
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center text-center space-y-6">
			<div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center">
				{status === "loading" && (
					<Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
				)}
				{status === "success" && (
					<CheckCircle2 className="w-8 h-8 text-sage-600" />
				)}
				{status === "error" && (
					<XCircle className="w-8 h-8 text-terracotta-600" />
				)}
			</div>

			<div className="space-y-2">
				<h1 className="font-serif text-3xl font-bold text-charcoal-900">
					{status === "loading" && "Verifying Your Email"}
					{status === "success" && "Email Verified!"}
					{status === "error" && "Verification Failed"}
				</h1>
				<p className="text-charcoal-600 max-w-md">{message}</p>
			</div>

			{status === "success" && (
				<div className="flex flex-col items-center gap-4 pt-4">
					<div className="flex items-center gap-2 text-sm text-charcoal-600">
						<Loader2 className="w-4 h-4 animate-spin" />
						Redirecting to setup your account...
					</div>
				</div>
			)}

			{status === "error" && (
				<div className="flex flex-col gap-3 pt-4">
					<Button
						onClick={handleResendEmail}
						disabled={resending}
						className="bg-sage-600 hover:bg-sage-700"
					>
						{resending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Sending...
							</>
						) : (
							<>
								<Mail className="w-4 h-4 mr-2" />
								Resend Verification Email
							</>
						)}
					</Button>
					<Link href="/auth/login">
						<Button variant="outline" className="w-full bg-transparent">
							Back to Login
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
