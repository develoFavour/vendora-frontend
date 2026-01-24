import type React from "react";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
});

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className={`min-h-screen relative flex items-center justify-center p-4 ${playfair.variable}`}
		>
			{/* Animated background with multiple layers */}
			<div className="absolute inset-0 overflow-hidden">
				<Image
					height={1000}
					width={1000}
					src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
					alt="Artisan marketplace"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-br from-zinc-950/95 via-primary/40 to-accent/20" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--accent),0.1),transparent_50%)]" />
			</div>

			{/* Floating stats badges */}
			<div className="absolute top-8 right-8 hidden xl:flex flex-col gap-4 z-10">
				<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-white shadow-2xl animate-in fade-in slide-in-from-right duration-500">
					<div className="text-3xl font-bold">2,500+</div>
					<div className="text-xs text-cream-200 mt-1">Active Vendors</div>
				</div>
				<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-white shadow-2xl animate-in fade-in slide-in-from-right duration-500 delay-100">
					<div className="text-3xl font-bold">50K+</div>
					<div className="text-xs text-cream-200 mt-1">Products</div>
				</div>
				<div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-4 text-white shadow-2xl animate-in fade-in slide-in-from-right duration-500 delay-200">
					<div className="text-3xl font-bold">98%</div>
					<div className="text-xs text-cream-200 mt-1">Satisfaction</div>
				</div>
			</div>

			{/* Main content card with enhanced glassmorphism */}
			<div className="relative z-20 w-full max-w-6xl">
				<div className="backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 rounded-3xl shadow-2xl border border-white/30 overflow-hidden animate-in fade-in zoom-in duration-500">
					<div className="grid lg:grid-cols-2">
						{/* Left side - Branding */}
						<div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white relative overflow-hidden">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_50%)]" />
							<div className="relative z-10">
								<h1 className="text-6xl font-bold mb-6 text-primary tracking-tighter italic">
									Vendora.
								</h1>
								<p className="text-xl text-zinc-400 mb-12 leading-relaxed">
									Join a curated marketplace that empowers independent artisans and connects conscious collectors with excellence.
								</p>
								<div className="space-y-4">
									<div className="flex items-center gap-3 group">
										<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
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
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<span className="text-cream-100">
											Transparent pricing & fees
										</span>
									</div>
									<div className="flex items-center gap-3 group">
										<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
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
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<span className="text-cream-100">
											Support local businesses
										</span>
									</div>
									<div className="flex items-center gap-3 group">
										<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
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
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<span className="text-cream-100">
											Quality products, verified sellers
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right side - Auth forms with glassmorphic background */}
						<div className="p-8 lg:p-12 backdrop-blur-md bg-white/10">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
