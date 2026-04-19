"use client";

import { useRef, useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	ArrowRight,
	Store,
	Shield,
	Zap,
	Star,
	ChevronLeft,
	ChevronRight,
	Quote,
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/marketplace/product-card";
import { VendorCard } from "@/components/marketplace/vendor-card";
import { usePublicProducts } from "@/hooks/use-public-products";

import ReactLenis from "@studio-freight/react-lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

/* ─── Constants ─── */
const marqueeItems = [
	"Curated Quality",
	"Independent Sellers",
	"Verified Vendors",
	"Secure Checkout",
	"Handcrafted Goods",
	"Global Shipping",
	"Premium Materials",
	"Timeless Design",
	"Artisan Made",
	"Conscious Shopping",
];

const categories = [
	{ name: "Fashion", count: 1240 },
	{ name: "Home & Living", count: 856 },
	{ name: "Art & Prints", count: 423 },
	{ name: "Jewelry", count: 312 },
	{ name: "Tech Accessories", count: 198 },
];

const testimonials = [
	{
		name: "Sarah Mitchell",
		role: "Interior Designer",
		text: "Every piece I've found on Vendora feels premium. The quality from these independent sellers is unmatched — it's completely changed how I source for my clients.",
		rating: 5,
		reviews: 34,
	},
	{
		name: "James Okonkwo",
		role: "Fashion Curator",
		text: "Vendora connects me directly with artisans I'd never discover otherwise. The curation is incredible and each purchase feels intentional.",
		rating: 5,
		reviews: 52,
	},
	{
		name: "Amara Chen",
		role: "Lifestyle Blogger",
		text: "The marketplace feels alive — new drops every week, beautiful product photography, and the checkout is seamless. My audience loves the finds.",
		rating: 5,
		reviews: 41,
	},
];

const featuredVendors = [
	{
		id: "1",
		name: "Artisan Pottery Co.",
		description: "Handmade ceramics crafted with precision and raw emotion.",
		location: "Portland, OR",
		rating: 4.9,
	},
	{
		id: "2",
		name: "Lumina Studio",
		description: "Minimalist lighting combining form and elegance.",
		location: "Copenhagen, DK",
		rating: 4.8,
	},
	{
		id: "3",
		name: "Timber & Grain",
		description: "Premium woodwork defining the modern sanctuary.",
		location: "Seattle, WA",
		rating: 5.0,
	},
];

/* ─── Page ─── */
export default function HomePage() {
	const { data: productsData, isLoading: productsLoading } =
		usePublicProducts({ limit: 8 });
	const featuredProducts = productsData?.data?.products || [];

	const containerRef = useRef<HTMLDivElement>(null);
	const [testimonialIndex, setTestimonialIndex] = useState(0);
	const currentTestimonial = testimonials[testimonialIndex];

	useGSAP(
		() => {
			const timer = setTimeout(() => {
				const ctx = gsap.context(() => {
					/* ── Hero text stagger (not scroll-triggered, pure entrance) ── */
					gsap.from(".hero-line", {
						y: 80,
						opacity: 0,
						duration: 1,
						ease: "power3.out",
						stagger: 0.12,
						delay: 0.2,
					});

					gsap.from(".hero-subtitle", {
						y: 30,
						opacity: 0,
						duration: 0.8,
						ease: "power3.out",
						delay: 0.7,
					});

					gsap.from(".hero-image", {
						scale: 1.15,
						opacity: 0,
						duration: 1.2,
						ease: "power2.out",
						delay: 0.3,
					});

					gsap.from(".hero-badge", {
						scale: 0,
						opacity: 0,
						duration: 0.6,
						ease: "back.out(1.7)",
						stagger: 0.1,
						delay: 1,
					});

					/* ── Generic scroll-triggered fade ups ── */
					gsap.utils.toArray<HTMLElement>(".gs-fade").forEach((el) => {
						gsap.fromTo(
							el,
							{ y: 30, opacity: 0 },
							{
								y: 0,
								opacity: 1,
								duration: 0.6,
								ease: "power3.out",
								scrollTrigger: {
									trigger: el,
									start: "top 97%",
									toggleActions: "play none none none",
								},
							}
						);
					});

					/* ── Stagger groups ── */
					gsap.utils
						.toArray<HTMLElement>(".gs-stagger-group")
						.forEach((group) => {
							const children = group.querySelectorAll(".gs-stagger-child");
							gsap.fromTo(
								children,
								{ y: 30, opacity: 0 },
								{
									y: 0,
									opacity: 1,
									duration: 0.5,
									ease: "power3.out",
									stagger: 0.06,
									scrollTrigger: {
										trigger: group,
										start: "top 96%",
										toggleActions: "play none none none",
									},
								}
							);
						});

					/* ── Category names slide-in ── */
					gsap.utils.toArray<HTMLElement>(".cat-item").forEach((el, i) => {
						gsap.fromTo(
							el,
							{ x: i % 2 === 0 ? -40 : 40, opacity: 0 },
							{
								x: 0,
								opacity: 1,
								duration: 0.5,
								ease: "power3.out",
								scrollTrigger: {
									trigger: el,
									start: "top 98%",
									toggleActions: "play none none none",
								},
							}
						);
					});

					/* ── Parallax images ── */
					gsap.utils.toArray<HTMLElement>(".gs-parallax").forEach((el) => {
						gsap.fromTo(
							el,
							{ yPercent: -8 },
							{
								yPercent: 8,
								ease: "none",
								scrollTrigger: {
									trigger: el.parentElement,
									start: "top bottom",
									end: "bottom top",
									scrub: true,
								},
							}
						);
					});

					/* Refresh AFTER all triggers are registered so elements
					   already in the viewport get their animations fired */
					ScrollTrigger.refresh();
				}, containerRef);

				return () => ctx.revert();
			}, 50);

			return () => clearTimeout(timer);
		},
		{ scope: containerRef, dependencies: [productsLoading] }
	);

	return (
		<ReactLenis root options={{ smoothWheel: true, lerp: 0.14, duration: 0.8 }}>
			<div
				ref={containerRef}
				className="flex min-h-screen flex-col bg-[#F5F4F0] text-[#1A1A1A] font-sans relative overflow-x-clip selection:bg-primary selection:text-primary-foreground"
			>
				<Navigation />

				{/* ═══════════════════════════════════════════════════
					HERO — High-End Editorial
				═══════════════════════════════════════════════════ */}
				<section className="relative min-h-[95vh] flex items-center overflow-hidden bg-[#FBFAF7]">
					{/* Subtle Background Elements */}
					<div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 External%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

					{/* The "Golden Halo" - Harmonizes with the image without flooding the section */}
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F4BC2C]/10 rounded-full blur-[120px] pointer-events-none" />

					<div className="relative w-full max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 py-12">
						<div className="relative flex flex-col lg:flex-row items-center justify-between">

							{/* LEFT: Discover Unique */}
							<div className="lg:w-[45%] z-20">
								<div className="space-y-0">
									<div className="overflow-hidden py-4 px-2 pr-12 w-max">
										<h1 className="hero-line text-[clamp(4rem,9vw,9rem)] font-sans font-black leading-none tracking-[-0.05em] text-[#1A1A1A]">
											Discover
										</h1>
									</div>
									<div className="overflow-hidden py-4 px-2 pr-12 mt-1 w-max">
										<h1 className="hero-line text-[clamp(4rem,9vw,9rem)] font-sans font-black leading-none tracking-[-0.05em] text-[#1A1A1A]">
											<span className="text-transparent" style={{ WebkitTextStroke: "1px #1A1A1A" }}>Unique</span>
										</h1>
									</div>
								</div>

								<div className="hero-subtitle mt-12 space-y-6 max-w-sm">
									<div className="flex items-center gap-4">
										<div className="h-[1px] w-12 bg-primary/30" />
										<span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary">
											Premium Marketplace
										</span>
									</div>
									<p className="text-base text-muted-foreground leading-relaxed">
										A curated ecosystem of independent visionaries. We bridge the gap between artisan craft and the modern connoisseur.
									</p>

									<div className="flex flex-wrap gap-4 pt-4">
										<Button
											size="lg"
											asChild
											className="h-14 px-10 rounded-full font-bold bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
										>
											<Link href="/marketplace">
												Shop Now <ArrowRight className="ml-2 h-5 w-5" />
											</Link>
										</Button>
										<Button
											size="lg"
											variant="outline"
											asChild
											className="h-14 px-10 rounded-full font-bold border-[#1A1A1A]/10 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-primary/30 transition-all"
										>
											<Link href="/signup">Vendor Hub</Link>
										</Button>
									</div>
								</div>
							</div>

							{/* CENTER: The Portrait */}
							<div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2 z-10 my-16 lg:my-0">
								<div className="hero-image relative group">
									{/* Decorative frame elements */}
									<div className="absolute -inset-4 border border-[#1A1A1A]/5 rounded-[2.5rem] pointer-events-none transition-transform duration-700 group-hover:scale-105" />

									<div className="relative w-[320px] md:w-[400px] lg:w-[440px] xl:w-[480px] aspect-[3/4.2] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)]">
										<img
											src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&q=90"
											alt="Fashion model"
											className="w-full h-full object-cover object-top gs-parallax scale-110 group-hover:scale-105 transition-transform duration-1000"
										/>
										{/* Subtle overlay gradient to blend bottom */}
										<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
									</div>

									{/* Floaties */}
									<div className="hero-badge absolute -bottom-10 -right-6 md:-right-10 bg-white/90 backdrop-blur-md rounded-3xl p-5 shadow-2xl z-30 border border-white">
										<div className="flex items-center gap-4">
											<div className="flex -space-x-3">
												{[1, 2, 3].map(i => (
													<div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100" />
												))}
											</div>
											<div>
												<p className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">Curated</p>
												<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">12.4k+ Items</p>
											</div>
										</div>
									</div>

									<div className="hero-badge absolute top-1/4 -left-8 text-primary shadow-xl p-3 bg-white rounded-2xl animate-bounce-slow">
										<Star className="w-6 h-6 fill-primary" />
									</div>
								</div>
							</div>

							{/* RIGHT: Shop Direct */}
							<div className="lg:w-[45%] z-20 flex flex-col items-end text-right">
								<div className="space-y-0">
									<div className="overflow-hidden py-4 px-2 pl-12 w-max">
										<h1 className="hero-line text-[clamp(4rem,9vw,9rem)] font-sans font-black leading-none tracking-[-0.05em] text-[#1A1A1A]">
											Shop
										</h1>
									</div>
									<div className="overflow-hidden py-4 px-2 pl-12 mt-1 w-max">
										<h1 className="hero-line text-[clamp(4rem,9vw,9rem)] font-sans font-black leading-none tracking-[-0.05em] text-[#1A1A1A]">
											<span className="text-transparent" style={{ WebkitTextStroke: "1px #1A1A1A" }}>Direct</span>
										</h1>
									</div>
								</div>

								<div className="hero-subtitle mt-12 flex flex-col items-end gap-6">
									<div className="flex items-center gap-4">
										<span className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
											Est. 2026
										</span>
										<div className="h-[1px] w-12 bg-black/10" />
									</div>

									<div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-[#1A1A1A]/5 shadow-sm">
										<p className="text-5xl font-sans font-black tracking-tighter text-primary">
											2.5k+
										</p>
										<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mt-2">
											Verified Creators
										</p>
									</div>

									<div className="mt-8 flex items-center gap-3 decoration-primary/30 underline-offset-8 underline cursor-pointer hover:text-primary transition-colors font-bold uppercase text-[10px] tracking-widest">
										Explore the lookbook <ArrowRight className="w-3 h-3" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					INFINITE MARQUEE TICKER
				═══════════════════════════════════════════════════ */}
				<div className="relative py-5 border-y border-[#1A1A1A]/10 bg-[#F5F4F0] overflow-hidden">
					<div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
						{[...marqueeItems, ...marqueeItems].map((item, i) => (
							<span
								key={i}
								className="mx-6 text-sm font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 flex items-center gap-6 shrink-0"
							>
								{item}
								<span className="text-primary text-lg">+</span>
							</span>
						))}
					</div>
				</div>

				{/* ═══════════════════════════════════════════════════
					FEATURED PRODUCTS — Editorial Grid
				═══════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 bg-[#F5F4F0]">
					<div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
						{/* Section header */}
						<div className="gs-fade flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
							<div>
								<h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tighter leading-[0.9]">
									All — about
									<br />
									<span className="text-primary/40 italic font-light">
										moments
									</span>{" "}
									©26
								</h2>
								<div className="flex items-center gap-3 mt-6">
									<div className="w-2 h-2 rounded-full bg-primary" />
									<div className="w-2 h-2 rounded-full bg-accent/60" />
								</div>
							</div>
							<div className="flex flex-col items-end gap-4">
								<p className="text-sm text-muted-foreground max-w-xs text-right leading-relaxed">
									Where elegance meets accessibility. Curated products from
									verified sellers, made for you.
								</p>
								<Button
									variant="outline"
									asChild
									className="rounded-full px-6 h-11 font-bold uppercase text-xs tracking-widest border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
								>
									<Link href="/marketplace">
										View All <ArrowRight className="ml-2 h-3 w-3" />
									</Link>
								</Button>
							</div>
						</div>

						{/* Products grid */}
						<div className="gs-stagger-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
							{productsLoading
								? Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="gs-stagger-child space-y-4">
										<Skeleton className="aspect-[4/5] rounded-3xl" />
										<Skeleton className="h-4 w-3/4 rounded-lg" />
										<Skeleton className="h-4 w-1/2 rounded-lg" />
									</div>
								))
								: featuredProducts
									.slice(0, 4)
									.map((product: any) => (
										<div key={product.id} className="gs-stagger-child">
											<ProductCard
												id={product.id}
												name={product.name}
												image={product.images?.[0]}
												price={product.price}
												vendor={product.vendorName || "Independent Seller"}
												inStock={(product.stock ?? 1) > 0}
											/>
										</div>
									))}
						</div>

						{/* Second row */}
						{!productsLoading && featuredProducts.length > 4 && (
							<div className="gs-stagger-group grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
								{featuredProducts.slice(4, 8).map((product: any) => (
									<div key={product.id} className="gs-stagger-child">
										<ProductCard
											id={product.id}
											name={product.name}
											image={product.images?.[0]}
											price={product.price}
											vendor={product.vendorName || "Independent Seller"}
											inStock={(product.stock ?? 1) > 0}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					CATEGORIES — Bold Typography
				═══════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 bg-white border-y border-[#1A1A1A]/5">
					<div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
						<div className="grid lg:grid-cols-12 gap-12 items-start">
							{/* Left: Image + description */}
							<div className="lg:col-span-5">
								<div className="gs-fade relative aspect-[3/4] w-full max-w-[400px] rounded-[2rem] overflow-hidden shadow-xl">
									<img
										src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
										alt="Shop categories"
										className="w-full h-full object-cover gs-parallax scale-110"
									/>
								</div>
								<div className="gs-fade mt-8 max-w-sm">
									<p className="text-base text-muted-foreground leading-relaxed">
										Every piece carries rhythm beyond commerce — it&apos;s
										purpose and meaning, where independent craft meets
										discerning taste.
									</p>
									<Button
										variant="outline"
										asChild
										className="mt-6 rounded-full px-6 h-11 font-bold uppercase text-xs tracking-widest border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
									>
										<Link href="/marketplace">
											See Products <ArrowRight className="ml-2 h-3 w-3" />
										</Link>
									</Button>
								</div>
							</div>

							{/* Right: categories list */}
							<div className="lg:col-span-7">
								<div className="gs-fade mb-8 flex items-center justify-between">
									<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
										[Categories]
									</span>
									<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
										—————
									</span>
								</div>
								<div className="space-y-2">
									{categories.map((cat, i) => (
										<Link
											key={cat.name}
											href="/marketplace"
											className="cat-item group flex items-baseline gap-4 py-4 border-b border-[#1A1A1A]/5 hover:border-primary/30 transition-colors"
										>
											<span className="text-[11px] font-mono text-muted-foreground/50 tracking-wider">
												[{String(i + 1).padStart(2, "0")}]
											</span>
											<span className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight group-hover:text-primary transition-colors duration-300">
												{cat.name}
											</span>
											<span className="text-2xl md:text-3xl lg:text-4xl font-serif text-muted-foreground/30 tracking-tight">
												({cat.count})
											</span>
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					MARQUEE (repeated for rhythm)
				═══════════════════════════════════════════════════ */}
				<div className="relative py-5 border-b border-[#1A1A1A]/10 bg-[#F5F4F0] overflow-hidden">
					<div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite_reverse]">
						{[...marqueeItems, ...marqueeItems].map((item, i) => (
							<span
								key={i}
								className="mx-6 text-sm font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40 flex items-center gap-6 shrink-0"
							>
								{item}
								<span className="text-accent text-lg">+</span>
							</span>
						))}
					</div>
				</div>

				{/* ═══════════════════════════════════════════════════
					HOW IT WORKS — Clean Cards
				═══════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 bg-[#F5F4F0]">
					<div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
						<div className="gs-fade text-center mb-20">
							<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-4 inline-block">
								[How It Works]
							</span>
							<h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tighter leading-[0.9]">
								Built for{" "}
								<span className="italic font-light text-primary">trust</span>
							</h2>
						</div>

						<div className="gs-stagger-group grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
							{[
								{
									num: "01",
									icon: Store,
									title: "Curated Marketplace",
									desc: "Every product is vetted for quality. We partner exclusively with passionate, independent sellers worldwide.",
								},
								{
									num: "02",
									icon: Shield,
									title: "Secure Transactions",
									desc: "Built-in escrow, buyer protection, and verified vendors ensure every purchase is safe and seamless.",
								},
								{
									num: "03",
									icon: Zap,
									title: "Fast Fulfillment",
									desc: "From checkout to doorstep — our logistics network guarantees timely delivery across the globe.",
								},
							].map((feature) => (
								<Card
									key={feature.num}
									className="gs-stagger-child group relative h-full border border-[#1A1A1A]/[0.06] bg-white hover:border-primary/20 rounded-3xl p-10 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 overflow-hidden"
								>
									<div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.03] rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
									<div className="relative z-10">
										<div className="flex items-center justify-between mb-8">
											<span className="text-5xl font-serif font-light text-[#1A1A1A]/10 group-hover:text-primary/15 transition-colors duration-500">
												{feature.num}
											</span>
											<div className="h-14 w-14 rounded-2xl border border-[#1A1A1A]/[0.06] bg-[#F5F4F0] flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
												<feature.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-500" />
											</div>
										</div>
										<h3 className="text-2xl font-serif font-bold tracking-tight mb-3">
											{feature.title}
										</h3>
										<p className="text-muted-foreground leading-relaxed">
											{feature.desc}
										</p>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					TESTIMONIAL — Editorial Quote
				═══════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 bg-white border-y border-[#1A1A1A]/5">
					<div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
						<div className="gs-fade">
							{/* Header row */}
							<div className="flex items-center justify-between mb-16">
								<div className="flex items-baseline gap-2">
									<span className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
										{String(testimonialIndex + 1).padStart(2, "0")}
									</span>
									<span className="text-lg text-muted-foreground/40 font-serif">
										/{testimonials.length}
									</span>
								</div>
								<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
									[Testimonials]
								</span>
								<Quote className="h-8 w-8 text-[#1A1A1A]/10" />
							</div>

							{/* Content */}
							<div className="grid lg:grid-cols-12 gap-12 items-start">
								{/* Left: reviewer */}
								<div className="lg:col-span-3">
									<p className="font-serif text-lg font-bold">
										[{currentTestimonial.name}]
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										{currentTestimonial.role}
									</p>
								</div>

								{/* Center: quote */}
								<div className="lg:col-span-6">
									<blockquote className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold leading-[1.2] tracking-tight">
										{currentTestimonial.text}
									</blockquote>
									<div className="flex items-center gap-3 mt-8">
										<div className="flex gap-0.5">
											{Array.from({ length: currentTestimonial.rating }).map(
												(_, i) => (
													<Star
														key={i}
														className="h-4 w-4 fill-primary text-primary"
													/>
												)
											)}
										</div>
										<span className="text-sm text-muted-foreground">
											{currentTestimonial.rating}.0 (
											{currentTestimonial.reviews} Reviews)
										</span>
									</div>
								</div>

								{/* Right: empty for balance */}
								<div className="lg:col-span-3" />
							</div>

							{/* Navigation */}
							<div className="flex items-center justify-between mt-16 pt-8 border-t border-[#1A1A1A]/5">
								<div className="flex gap-3">
									<button
										onClick={() =>
											setTestimonialIndex(
												(testimonialIndex - 1 + testimonials.length) %
												testimonials.length
											)
										}
										className="h-10 w-10 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"
									>
										<ChevronLeft className="h-4 w-4" />
									</button>
									<button
										onClick={() =>
											setTestimonialIndex(
												(testimonialIndex + 1) % testimonials.length
											)
										}
										className="h-10 w-10 rounded-full border border-[#1A1A1A]/10 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-all"
									>
										<ChevronRight className="h-4 w-4" />
									</button>
								</div>
								<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
									See What Our Customers Are Saying
								</p>
								<Quote className="h-5 w-5 text-[#1A1A1A]/10 rotate-180" />
							</div>
						</div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					FEATURED VENDORS
				═══════════════════════════════════════════════════ */}
				<section className="py-24 md:py-32 bg-[#F5F4F0]">
					<div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
						<div className="gs-fade flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
							<div>
								<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-4 inline-block">
									[Vendors]
								</span>
								<h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tighter leading-[0.9]">
									©vendora —
									<br />
									<span className="text-muted-foreground/30 italic font-light">
										seller spotlight
									</span>
								</h2>
							</div>
							<Button
								variant="outline"
								asChild
								className="rounded-full px-6 h-11 font-bold uppercase text-xs tracking-widest border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all shrink-0"
							>
								<Link href="/vendors">All Vendors</Link>
							</Button>
						</div>

						<div className="gs-stagger-group grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
							{featuredVendors.map((vendor) => (
								<div key={vendor.id} className="gs-stagger-child">
									<VendorCard
										id={vendor.id}
										description={vendor.description}
										name={vendor.name}
										category="Featured Vendor"
										location={vendor.location}
										rating={vendor.rating}
									/>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					CTA — Dark Section
				═══════════════════════════════════════════════════ */}
				<section className="relative py-28 md:py-36 overflow-hidden bg-[#1A1A1A] text-white">
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none" />
					<div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

					<div className="gs-fade relative max-w-4xl mx-auto px-6 md:px-12 text-center">
						<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary mb-6 inline-block">
							[Join Vendora]
						</span>
						<h2 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tighter leading-[0.9] mb-6">
							Ready to
							<br />
							<span className="italic font-light text-white/40">
								start selling?
							</span>
						</h2>
						<p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-12">
							Whether you&apos;re a buyer hunting for unique finds or a seller
							ready to reach thousands — Vendora is your platform.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button
								size="lg"
								asChild
								className="h-14 px-10 rounded-full text-base font-semibold bg-white text-[#1A1A1A] hover:bg-white/90 shadow-xl transition-all uppercase tracking-wider"
							>
								<Link href="/auth/signup">
									Apply Now
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="ghost"
								asChild
								className="h-14 px-10 rounded-full text-base font-semibold text-white border border-white/15 hover:bg-white/10 transition-all uppercase tracking-wider"
							>
								<Link href="/marketplace">Shop as Buyer</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* ═══════════════════════════════════════════════════
					FOOTER
				═══════════════════════════════════════════════════ */}
				<Footer />
			</div>
		</ReactLenis>
	);
}
