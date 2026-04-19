"use client";

import Link from "next/link";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { VendorCard } from "@/components/marketplace/vendor-card";
import { Search, MapPin, Loader2, PackageOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePublicVendors } from "@/hooks/use-public-vendors";
import { usePublicCategories } from "@/hooks/use-public-products";

export default function VendorsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [page, setPage] = useState(1);
	const limit = 12;

	const { data: vendorsRes, isLoading, isError } = usePublicVendors({
		page,
		limit,
		search: searchQuery,
		category: selectedCategory === "all" ? "" : selectedCategory
	});

	const { data: categoriesRes } = usePublicCategories();
	const categories = categoriesRes?.data?.categories || [];

	const vendors = vendorsRes?.data?.vendors || [];
	const meta = vendorsRes?.data?.meta || { total: 0 };

	const totalPages = Math.ceil(meta.total / limit);

	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			{/* Header */}
			<section className="relative overflow-hidden bg-zinc-950 py-24 px-4 text-white rounded-b-[4rem]">
				<div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
				<div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[130px]" />
				<div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[130px]" />

				<div className="mx-auto max-w-7xl relative z-10">
					<div className="text-center">
						<Badge className="mb-8 bg-white/10 text-white hover:bg-white/20 backdrop-blur-2xl border-white/10 py-1.5 px-6 text-[10px] font-bold uppercase tracking-[0.3em]">
							Meet the Artisans
						</Badge>
						<h1 className="text-5xl md:text-8xl tracking-tighter mb-8">
							Discover <span className="italic text-primary">Mastery.</span>
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-400 font-medium leading-relaxed italic">
							&ldquo;Curating the world&apos;s most skilled makers, so you can discover pieces that resonate with your soul.&rdquo;
						</p>
					</div>

					{/* Stats */}
					<div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-white/10 pt-16">
						{[
							{ label: "Active Artisans", value: `${meta.total}+` },
							{ label: "Boutique Items", value: "Live" },
							{ label: "Average Rating", value: "4.9/5" },
							{ label: "Verified Partners", value: "100%" }
						].map((stat) => (
							<div key={stat.label} className="text-center group">
								<div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 group-hover:text-primary transition-colors">
									{stat.value}
								</div>
								<div className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Search and Filter Bar */}
			<section className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						{/* Search */}
						<div className="relative flex-1 max-w-md group">
							<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
							<Input
								type="search"
								placeholder="Search boutique names..."
								className="h-14 pl-12 rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl focus:ring-primary/10 transition-all font-medium"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
							/>
						</div>

						{/* Filters */}
						<div className="flex items-center gap-3">
							<Select value={selectedCategory} onValueChange={(val) => {
								setSelectedCategory(val);
								setPage(1);
							}}>
								<SelectTrigger className="h-14 w-[200px] rounded-2xl border-border/40 bg-zinc-50/50 backdrop-blur-xl transition-all focus:ring-primary/10">
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-white/80">
									<SelectItem value="all">All Categories</SelectItem>
									{categories.map((cat: any) => (
										<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</section>

			{/* Vendors Grid */}
			<section className="flex-1 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="mb-6 flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Showing{" "}
							<span className="font-medium text-foreground">
								{vendors.length}
							</span>{" "}
							vendors of {meta.total}
						</p>
					</div>

					{isLoading ? (
						<div className="flex flex-col items-center justify-center py-32 space-y-4">
							<Loader2 className="h-10 w-10 animate-spin text-primary" />
							<p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Identifying artisans...</p>
						</div>
					) : isError ? (
						<div className="flex flex-col items-center justify-center py-32 text-center">
							<p className="text-destructive font-bold">Failed to load the artisan directory.</p>
							<Button variant="link" onClick={() => window.location.reload()}>Try again</Button>
						</div>
					) : vendors.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
							<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
								<PackageOpen className="h-8 w-8 text-muted-foreground" />
							</div>
							<h2 className="text-xl font-serif italic text-muted-foreground">No artisans found.</h2>
							<p className="text-sm text-zinc-500 max-w-xs">Try adjusting your search or filters to find a different boutique.</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{vendors.map((vendor: any) => {
									const app = vendor.sellerApplication || {};
									const account = vendor.vendorAccount || {};
									const profile = vendor.profile || {};
									const trustScore = account.trustScore ? account.trustScore / 20 : 4.8;
									return (
										<VendorCard
											key={vendor.id}
											id={vendor.id}
											name={app.storeName || vendor.name}
											description={app.storeDescription || "A master artisan curating unique handmade pieces for the Vendora marketplace."}
											category={app.categories?.[0] || "Featured Artisan"}
											location={profile.location || "Global"}
											rating={trustScore}
											verified={vendor.vendorStatus === "approved"}
											productCount={account.productCount || 0}
											followers={account.totalOrders || 120} // Using total orders as a proxy for followers/impact
											image={profile.profileImage}
										/>
									);
								})}
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="mt-12 flex items-center justify-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(page - 1)}
										disabled={page === 1}
									>
										Previous
									</Button>
									{[...Array(totalPages)].map((_, i) => (
										<Button
											key={i}
											variant={page === i + 1 ? "default" : "outline"}
											size="sm"
											onClick={() => setPage(i + 1)}
										>
											{i + 1}
										</Button>
									))}
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage(page + 1)}
										disabled={page === totalPages}
									>
										Next
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="border-t border-border/40 bg-zinc-50/30 py-24">
				<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="text-4xl md:text-6xl mb-8 tracking-tighter">
						Ready to <span className="italic text-primary">showcase</span> <br />
						your work?
					</h2>
					<p className="mt-6 text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
						Join our elite circle of artisans and reach collectors who truly appreciate the art of the handmade.
					</p>
					<Button size="lg" className="mt-12 h-16 px-12 rounded-full font-bold text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all" asChild>
						<Link href="/auth/signup">Become an Artisan Partner</Link>
					</Button>
				</div>
			</section>

			<Footer />
		</div>
	);
}
