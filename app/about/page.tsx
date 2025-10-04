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
			<section className="relative bg-gradient-to-br from-sage/10 via-background to-terracotta/5 py-20 px-4">
				<div className="max-w-4xl mx-auto text-center">
					<Badge className="mb-4 bg-sage/10 text-sage border-sage/20">
						Our Story
					</Badge>
					<h1 className="font-serif text-4xl md:text-6xl font-bold text-balance mb-6">
						Empowering Independent Sellers, One Transaction at a Time
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-3xl mx-auto">
						Vendora was born from a simple belief: small businesses deserve a
						platform that puts them first. We&apos;re building a marketplace
						where quality, transparency, and community matter more than
						algorithms.
					</p>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4 border-y border-border/50">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((stat) => (
							<div key={stat.label} className="text-center">
								<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sage/10 mb-4">
									<stat.icon className="h-6 w-6 text-sage" />
								</div>
								<div className="font-serif text-3xl md:text-4xl font-bold mb-2">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
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
							<Badge className="mb-4 bg-terracotta/10 text-terracotta border-terracotta/20">
								Our Mission
							</Badge>
							<h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
								Building a Better Marketplace for Everyone
							</h2>
							<p className="text-muted-foreground leading-relaxed mb-6">
								We started Vendora because we saw talented artisans, makers, and
								small business owners struggling to compete with massive
								corporations on traditional platforms. High fees, buried
								listings, and impersonal experiences were holding them back.
							</p>
							<p className="text-muted-foreground leading-relaxed mb-6">
								Our mission is to create a marketplace that celebrates
								independent sellers, provides transparent pricing, and builds
								genuine connections between makers and buyers. Every feature we
								build, every decision we make, starts with asking: &apos;Does
								this help our vendors succeed?&apos;
							</p>
							<Button asChild size="lg">
								<Link href="/auth/signup">Start Selling Today</Link>
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
					<div className="text-center mb-16">
						<Badge className="mb-4 bg-sage/10 text-sage border-sage/20">
							Our Values
						</Badge>
						<h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
							What We Stand For
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							These principles guide every decision we make and every feature we
							build.
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
					<div className="text-center mb-16">
						<Badge className="mb-4 bg-terracotta/10 text-terracotta border-terracotta/20">
							Our Team
						</Badge>
						<h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
							Meet the People Behind Vendora
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							We&apos;re a small team with big dreams, united by our passion for
							supporting independent businesses.
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
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
						Ready to Join Our Community?
					</h2>
					<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
						Whether you&apos;re a maker looking to sell or a shopper seeking
						unique products, Vendora is the place for you.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg">
							<Link href="/auth/signup">Start Selling</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/marketplace">Browse Products</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
