import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Heart,
	Users,
	TrendingUp,
	Shield,
	Sparkles,
	Globe,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
	const stats = [
		{ label: "Active Vendors", value: "2,500+", icon: Users },
		{ label: "Products Listed", value: "50,000+", icon: Sparkles },
		{ label: "Happy Customers", value: "100,000+", icon: Heart },
		{ label: "Countries Served", value: "25+", icon: Globe },
	];

	const values = [
		{
			icon: Heart,
			title: "Community First",
			description:
				"We believe in empowering independent sellers and connecting them with conscious consumers who value quality and authenticity.",
		},
		{
			icon: Shield,
			title: "Trust & Transparency",
			description:
				"Every vendor is verified, every transaction is secure, and every review is authentic. We build trust through transparency.",
		},
		{
			icon: TrendingUp,
			title: "Growth Together",
			description:
				"When our vendors succeed, we all succeed. We provide tools, insights, and support to help small businesses thrive.",
		},
	];

	const team = [
		{
			name: "Sarah Chen",
			role: "Founder & CEO",
			bio: "Former marketplace executive passionate about empowering independent sellers.",
			image:
				"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
		},
		{
			name: "Marcus Johnson",
			role: "Head of Vendor Success",
			bio: "Dedicated to helping small businesses grow and succeed on our platform.",
			image:
				"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
		},
		{
			name: "Priya Patel",
			role: "Chief Technology Officer",
			bio: "Building the infrastructure that powers thousands of independent businesses.",
			image:
				"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
		},
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-zinc-950 py-32 px-4 text-white rounded-b-[4rem]">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
				<div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" />
				<div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[130px]" />

				<div className="relative z-10 max-w-5xl mx-auto text-center">
					<Badge className="mb-8 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.3em]">
						The Vendora Legacy
					</Badge>
					<h1 className="text-5xl md:text-8xl lg:text-9xl mb-8 tracking-tighter">
						Curating <span className="italic text-primary">Excellence,</span> <br />
						Empowering Makers.
					</h1>
					<p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl mx-auto italic">
						&ldquo;Vendora was born from a simple belief: that true craftsmanship deserves a stage as exceptional as the work itself.&rdquo;
					</p>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4 border-y border-border/50">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center group">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/5 mb-6 group-hover:scale-110 transition-transform duration-500">
									<stat.icon className="h-7 w-7 text-primary" />
								</div>
								<div className="text-4xl md:text-5xl mb-2 tracking-tighter">
									{stat.value}
								</div>
								<div className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<Badge className="mb-6 bg-accent/10 text-accent border-accent/20 font-bold tracking-widest uppercase text-[10px]">
								Our Philosophy
							</Badge>
							<h2 className="text-4xl md:text-6xl mb-8">
								Crafting a <span className="italic text-primary">Better</span> <br />
								Standard for All.
							</h2>
							<p className="text-lg text-muted-foreground leading-[1.8] mb-8 font-medium">
								We saw a world where talented artisans were buried under corporate algorithms. Vendora was built to reverse that—creating a space where quality is the only currency that matters.
							</p>
							<p className="text-lg text-muted-foreground leading-[1.8] mb-10 font-medium italic">
								Every decision we make starts with a simple question: &ldquo;Does this honor the maker?&rdquo;
							</p>
							<Button asChild size="lg" className="h-16 px-10 rounded-full font-bold text-lg shadow-2xl shadow-primary/20">
								<Link href="/auth/signup">Join the Movement</Link>
							</Button>
						</div>
						<div className="relative">
							<Image
								height={100}
								width={100}
								src="/small-business-owner-workshop-artisan.jpg"
								alt="Small business owner"
								className="rounded-lg shadow-2xl"
							/>
							<div className="absolute -bottom-6 -left-6 bg-card border border-border/50 rounded-lg p-6 shadow-xl max-w-xs">
								<p className="text-sm font-medium mb-2">
									&apos;Vendora helped me turn my hobby into a thriving
									business.&apos;
								</p>
								<p className="text-xs text-muted-foreground">
									— Emma, Handmade Jewelry Vendor
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-20 px-4 bg-gradient-to-br from-cream/30 to-background">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-20">
						<Badge className="mb-6 bg-primary/10 text-primary border-primary/20 font-bold tracking-widest uppercase text-[10px]">
							The Vendora Way
						</Badge>
						<h2 className="text-4xl md:text-6xl mb-6">
							What We <span className="italic">Uphold</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
							These principles are woven into every line of code we write.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{values.map((value) => (
							<Card key={value.title} className="border-border/50">
								<CardContent className="pt-6">
									<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-terracotta/10 mb-4">
										<value.icon className="h-6 w-6 text-terracotta" />
									</div>
									<h3 className="font-serif text-xl font-bold mb-3">
										{value.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{value.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-20 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-20">
						<Badge className="mb-6 bg-accent/10 text-accent border-accent/20 font-bold tracking-widest uppercase text-[10px]">
							The Visionaries
						</Badge>
						<h2 className="text-4xl md:text-6xl mb-6">
							Meet the <span className="italic text-primary">Founders</span>
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
							Artisans of the digital world, dedicated to your success.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{team.map((member) => (
							<Card
								key={member.name}
								className="border-border/50 overflow-hidden"
							>
								<Image
									height={100}
									width={100}
									src={member.image || "/placeholder.svg"}
									alt={member.name}
									className="w-full h-64 object-cover"
								/>
								<CardContent className="pt-6">
									<h3 className="font-serif text-xl font-bold mb-1">
										{member.name}
									</h3>
									<p className="text-sm text-sage font-medium mb-3">
										{member.role}
									</p>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{member.bio}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4 bg-gradient-to-br from-sage/10 to-terracotta/5">
				<div className="relative z-10 max-w-5xl mx-auto text-center">
					<h2 className="text-5xl md:text-7xl lg:text-8xl mb-10 tracking-tighter">
						Ready to <span className="italic text-primary">begin?</span>
					</h2>
					<p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
						Step into a world where quality reigns supreme. Start your journey with Vendora today.
					</p>
					<div className="flex flex-wrap gap-6 justify-center">
						<Button asChild size="lg" className="h-16 px-12 rounded-full font-bold text-lg shadow-2xl shadow-primary/20">
							<Link href="/auth/signup">Join as Artisan</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-full font-bold text-lg border-white/20 hover:bg-white hover:text-black">
							<Link href="/marketplace">Explore Gallery</Link>
						</Button>
					</div>
				</div>
				<div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
			</section>
		</div>
	);
}
