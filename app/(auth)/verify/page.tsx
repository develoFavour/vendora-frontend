"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useOnboardingStore } from "@/stores/onboarding-store";

export default function VerifyEmailPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const token = searchParams.get("token");
	const setRole = useOnboardingStore((state) => state.setRole);

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

		// Call backend verification endpoint
		const verifyEmail = async () => {
			try {
				const response = await api.post(`/api/v1/auth/verify/${token}`);

				if (response.status === 200) {
					setStatus("success");
					setMessage("Your email has been verified successfully!");

					// Get user role from backend response (defaults to customer)
					const userRole = response.data?.data?.user?.role || "buyer";
					setRole(userRole as "buyer" | "vendor");

					// Redirect to onboarding after 2 seconds
					setTimeout(() => {
						router.push(`/onboarding/role-selection`);
					}, 2000);
				} else {
					setStatus("error");
					setMessage(response.data.message || "Verification failed");
				}
			} catch (error: unknown) {
				setStatus("error");
				const msg =
					error instanceof Error
						? error.message
						: "Something went wrong. Please try again.";
				setMessage(msg);
			}
		};

		verifyEmail();
	}, [token, router, setRole]);

	const handleResendEmail = async () => {
		setResending(true);
		try {
			// Call backend to resend verification email (route aligned with backend)
			const response = await api.post(`/api/v1/auth/resend/${token}`);

			if (response.status === 200) {
				setMessage("Verification email sent! Check your inbox.");
			}
		} catch (error: unknown) {
			const msg =
				error instanceof Error
					? error.message
					: "Failed to resend email. Please try again.";
			setMessage(msg);
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="flex flex-col items-center justify-center text-center space-y-10">
				{/* Status Icon with animated rings */}
				<div className="relative">
					<div className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${status === "loading" ? "bg-zinc-100" :
							status === "success" ? "bg-primary shadow-2xl shadow-primary/20" :
								"bg-red-500 shadow-2xl shadow-red-500/20"
						}`}>
						{status === "loading" && (
							<Loader2 className="w-10 h-10 text-zinc-900 animate-spin" />
						)}
						{status === "success" && (
							<CheckCircle2 className="w-10 h-10 text-white" />
						)}
						{status === "error" && (
							<XCircle className="w-10 h-10 text-white" />
						)}
					</div>
					{status === "loading" && (
						<div className="absolute inset-0 rounded-full border-4 border-zinc-100 border-t-primary animate-spin" />
					)}
				</div>

				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
						{status === "loading" && (
							<>Verifying <span className="italic text-primary">Identity.</span></>
						)}
						{status === "success" && (
							<>Identity <span className="italic text-primary">Verified.</span></>
						)}
						{status === "error" && (
							<><span className="italic text-red-500">Verification</span> Failed.</>
						)}
					</h1>
					<p className="text-zinc-600 font-medium leading-relaxed max-w-xs mx-auto italic">
						&ldquo;{message}&rdquo;
					</p>
				</div>

				{status === "success" && (
					<div className="flex flex-col items-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
						<div className="flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-full border border-primary/10">
							<div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
							<span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
								Curating your experience...
							</span>
						</div>
					</div>
				)}

				{status === "error" && (
					<div className="flex flex-col w-full gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
						<Button
							onClick={handleResendEmail}
							disabled={resending}
							className="w-full py-8 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary/20 transition-all border-none"
						>
							{resending ? (
								<div className="flex items-center gap-3">
									<Loader2 className="w-5 h-5 animate-spin" />
									Resending...
								</div>
							) : (
								<div className="flex items-center gap-3 tracking-[0.3em] uppercase text-xs">
									<Mail className="w-4 h-4" />
									Resend Link
								</div>
							)}
						</Button>
						<Link href="/login" className="w-full">
							<Button variant="outline" className="w-full py-8 rounded-[2rem] border-white/40 bg-white/20 hover:bg-white/40 font-bold text-xs uppercase tracking-widest">
								Back to Login
							</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
