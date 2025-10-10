"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, RotateCcw } from "lucide-react";
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
		<div className="max-w-lg mx-auto text-center">
			<div className="mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage-100 text-sage-700 shadow-sm">
					<CheckCircle2 className="w-8 h-8" />
				</div>
			</div>

			<h1 className="font-serif text-3xl font-bold mb-2">Check your inbox</h1>
			<p className="text-gray-700 mb-6">
				We sent a verification link to{" "}
				<span className="font-semibold">{email}</span>. Please click the link to
				verify your account.
			</p>

			<div className="grid grid-cols-3 gap-3 mb-6">
				<Button variant="outline" onClick={() => handleOpenProvider("gmail")}>
					Gmail
				</Button>
				<Button variant="outline" onClick={() => handleOpenProvider("outlook")}>
					Outlook
				</Button>
				<Button variant="outline" onClick={() => handleOpenProvider("yahoo")}>
					Yahoo
				</Button>
			</div>

			<div className="flex items-center justify-center gap-2 text-gray-700 mb-4">
				<Clock className="w-4 h-4" />
				<span>Didn’t get it?</span>
			</div>

			<Button
				onClick={handleResend}
				disabled={cooldown > 0 || isSending}
				className="mb-8"
			>
				<RotateCcw className="w-4 h-4 mr-2" />
				{cooldown > 0
					? `Resend in ${cooldown}s`
					: isSending
					? "Resending..."
					: "Resend email"}
			</Button>

			<div className="text-sm text-gray-700 space-y-2">
				<p>
					Wrong email?{" "}
					<button className="underline" onClick={() => router.push("/signup")}>
						Change it
					</button>
				</p>
				<p>
					After verification, you can{" "}
					<button className="underline" onClick={() => router.push("/login")}>
						sign in
					</button>
					.
				</p>
			</div>
		</div>
	);
};

export default VerificationEmailSent;
