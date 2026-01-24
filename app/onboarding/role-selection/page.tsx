"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function RoleSelectionPage() {
	const setRole = useOnboardingStore((state) => state.setRole);
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);

	const handleRoleSelection = (role: "buyer" | "vendor") => {
		if (submitting) return;
		setSubmitting(true);
		setRole(role);
		toast.success(`Continuing as ${role === "buyer" ? "Buyer" : "Vendor"}`);

		// Redirect to main onboarding flow
		setTimeout(() => {
			router.push("/onboarding");
			setSubmitting(false);
		}, 300);
	};

	return (
		<div className="min-h-screen relative overflow-hidden bg-zinc-950 flex items-center justify-center p-6">
			{/* Luxury Background Elements */}
			<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
			<div className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px]" />
			<div className="absolute -left-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[150px]" />
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />

			<div className="relative z-10 max-w-6xl w-full mx-auto">
				{/* Header */}
				<div className="text-center mb-16">
					<Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.3em]">
						Your Manifest Destiny
					</Badge>

					<h1 className="text-5xl md:text-8xl tracking-tighter text-white mb-8 leading-[0.9]">
						Choose Your <br />
						<span className="italic text-primary">Calling.</span>
					</h1>

					<p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto italic">
						&ldquo;Every journey begins with a choice. Will you curate the future, or discover it?&rdquo;
					</p>
				</div>

				{/* Role Selection Cards */}
				<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
					{/* Customer Card */}
					<Card
						onClick={() => handleRoleSelection("buyer")}
						className="relative overflow-hidden border-border/40 bg-zinc-900/40 backdrop-blur-xl group cursor-pointer hover:border-primary/40 transition-all duration-700 hover:shadow-[0_0_50px_-12px_rgba(var(--primary),0.2)]"
					>
						<CardContent className="p-12">
							<div className="flex flex-col items-center text-center">
								<div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
									<ShoppingBag className="w-10 h-10 text-primary" />
								</div>

								<h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
									The <span className="italic text-primary">Collector.</span>
								</h2>

								<p className="text-zinc-400 leading-relaxed mb-10 font-medium italic">
									&ldquo;Discover unique, handcrafted products from the world&apos;s most skilled artisans.&rdquo;
								</p>

								<div className="space-y-4 mb-12 w-full max-w-xs">
									{[
										"Elite product curation",
										"Global boutique access",
										"Artisan direct connections"
									].map((feature, i) => (
										<div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
											<div className="w-1.5 h-1.5 rounded-full bg-primary" />
											<span>{feature}</span>
										</div>
									))}
								</div>

								<Button
									className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-2xl shadow-primary/20 transition-all"
									disabled={submitting}
								>
									{submitting ? "Preparing..." : "Enter as Collector"}
									<ArrowRight className="w-5 h-5 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Vendor Card */}
					<Card
						onClick={() => handleRoleSelection("vendor")}
						className="relative overflow-hidden border-border/40 bg-zinc-900/40 backdrop-blur-xl group cursor-pointer hover:border-accent/40 transition-all duration-700 hover:shadow-[0_0_50px_-12px_rgba(var(--accent),0.2)]"
					>
						<CardContent className="p-12">
							<div className="flex flex-col items-center text-center">
								<div className="w-20 h-20 rounded-3xl bg-accent/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
									<Store className="w-10 h-10 text-accent" />
								</div>

								<h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
									The <span className="italic text-accent">Artisan.</span>
								</h2>

								<p className="text-zinc-400 leading-relaxed mb-10 font-medium italic">
									&ldquo;Turn your mastery into a legacy. Join an elite circle of global creators.&rdquo;
								</p>

								<div className="space-y-4 mb-12 w-full max-w-xs">
									{[
										"Sophisticated store setup",
										"Masterful analytics",
										"Transparent craftsmanship"
									].map((feature, i) => (
										<div key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
											<div className="w-1.5 h-1.5 rounded-full bg-accent" />
											<span>{feature}</span>
										</div>
									))}
								</div>

								<Button
									className="w-full h-16 rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-2xl shadow-accent/20 transition-all"
									disabled={submitting}
								>
									{submitting ? "Preparing..." : "Begin as Artisan"}
									<ArrowRight className="w-5 h-5 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Already have account */}
				<div className="text-center mt-20">
					<p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
						Already a Member?{" "}
						<Button
							variant="link"
							className="p-0 h-auto text-primary hover:text-primary/80 font-bold uppercase tracking-[0.3em]"
							onClick={() => router.push("/login")}
						>
							Sign In
						</Button>
					</p>
				</div>
			</div>
		</div>
	);
}
