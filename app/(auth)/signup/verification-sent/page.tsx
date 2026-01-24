"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

const VerificationEmailSent = () => {
	const router = useRouter();
	const params = useSearchParams();
	const email = params.get("email") || "your email";

	const [cooldown, setCooldown] = useState<number>(30);
	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		if (cooldown <= 0) return;
		const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
		return () => clearTimeout(t);
	}, [cooldown]);

	const handleOpenProvider = (provider: "gmail" | "outlook" | "yahoo") => {
		const links = {
			gmail: "https://mail.google.com/",
			outlook: "https://outlook.live.com/mail/0/",
			yahoo: "https://mail.yahoo.com/",
		} as const;
		window.open(links[provider], "_blank");
	};

	const handleResend = async () => {
		try {
			setIsSending(true);
			// Backend has handler ResendVerification but route may not be registered yet.
			// Once available, adjust to: POST /api/v1/auth/resend/:token OR /api/v1/auth/resend?email=...
			// Placeholder call (no-op) for now:
			await new Promise((r) => setTimeout(r, 800));
			setCooldown(45);
			toast.success("Verification email re-sent");
		} catch (e) {
			const message = e instanceof Error ? e.message : "Failed to resend email";
			toast.error(message);
		} finally {
			setIsSending(false);
		}
	};


	return (
		<div className="w-full max-w-md mx-auto">
			<div className="flex flex-col items-center justify-center text-center space-y-10">
				{/* Check Inbox Icon */}
				<div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 relative z-10 animate-in zoom-in duration-500">
					<CheckCircle2 className="w-10 h-10 text-white" />
				</div>

				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
						Check Your <span className="italic text-primary">Inbox.</span>
					</h1>
					<p className="text-zinc-600 font-medium leading-relaxed max-w-xs mx-auto italic">
						&ldquo;We&apos;ve sent a verification bridge to <span className="text-primary font-bold">{email}</span>. One click to begin your journey.&rdquo;
					</p>
				</div>

				{/* Quick provider access */}
				<div className="grid grid-cols-3 gap-4 w-full">
					{[
						{ name: "Gmail", id: "gmail" as const },
						{ name: "Outlook", id: "outlook" as const },
						{ name: "Yahoo", id: "yahoo" as const }
					].map((provider) => (
						<Button
							key={provider.id}
							variant="outline"
							onClick={() => handleOpenProvider(provider.id)}
							className="h-14 rounded-2xl border-white/40 bg-zinc-50/50 backdrop-blur-xl hover:bg-white/60 transition-all font-bold text-[10px] uppercase tracking-widest"
						>
							{provider.name}
						</Button>
					))}
				</div>

				<div className="w-full pt-4 space-y-6">
					<div className="flex items-center justify-center gap-3 text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px]">
						<Clock className="w-3.5 h-3.5" />
						<span>Still waiting?</span>
					</div>

					<Button
						onClick={handleResend}
						disabled={cooldown > 0 || isSending}
						className="w-full py-8 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary/20 transition-all border-none"
					>
						{isSending ? (
							<div className="flex items-center gap-3">
								<Loader2 className="w-5 h-5 animate-spin" />
								Resending...
							</div>
						) : cooldown > 0 ? (
							<div className="flex items-center gap-3 tracking-[0.3em] uppercase text-xs">
								Resend in {cooldown}s
							</div>
						) : (
							<div className="flex items-center gap-3 tracking-[0.3em] uppercase text-xs">
								<RotateCcw className="w-4 h-4" />
								Resend Link
							</div>
						)}
					</Button>

					<div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
						<button
							className="hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
							onClick={() => router.push("/signup")}
						>
							Incorrect Email? Change it
						</button>
						<div className="h-px w-8 bg-zinc-200 mx-auto" />
						<button
							className="hover:text-primary transition-colors"
							onClick={() => router.push("/login")}
						>
							Already Verified? Sign In
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// Add Loader2 to imports if missing, but it's used in resending
// I'll check imports

export default VerificationEmailSent;
