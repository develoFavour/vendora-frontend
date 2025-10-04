import type React from "react";
import { Card } from "@/components/ui/card";
import {
	DollarSign,
	Users,
	Store,
	ShoppingBag,
	TrendingUp,
	ArrowUpRight,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AdminDashboardPage() {
	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Platform Overview</h1>
				<p className="mt-2 text-muted-foreground">
					Monitor and manage the entire Vendora marketplace
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="h-6 w-6 text-primary" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							18.2%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">$284,562</div>
						<div className="text-sm text-muted-foreground">
							Platform Revenue
						</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						+$42,180 from last month
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<Store className="h-6 w-6 text-accent" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							12.5%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">2,547</div>
						<div className="text-sm text-muted-foreground">Active Vendors</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						+284 new this month
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							24.8%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">48,392</div>
						<div className="text-sm text-muted-foreground">Total Customers</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						+9,642 new this month
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<ShoppingBag className="h-6 w-6 text-accent" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							15.3%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">12,847</div>
						<div className="text-sm text-muted-foreground">Total Orders</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						+1,712 from last month
					</div>
				</Card>
			</div>

			{/* Pending Actions */}
			<Card className="mt-8 border-accent/20 bg-accent/5 p-6">
				<div className="flex items-start gap-4">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
						<AlertCircle className="h-6 w-6 text-accent" />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold">Pending Actions Required</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							You have 12 vendor applications awaiting approval and 3 reported
							products to review
						</p>
					</div>
					<Button variant="outline" asChild>
						<Link href="/admin/dashboard/vendors">Review Now</Link>
					</Button>
				</div>
			</Card>

			{/* Recent Activity & Top Vendors */}
			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				{/* Recent Vendor Applications */}
				<Card className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-serif text-xl font-semibold">
							Recent Vendor Applications
						</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/admin/dashboard/vendors">View all</Link>
						</Button>
					</div>

					<div className="space-y-4">
						{[
							{
								name: "Handcrafted Goods Co.",
								category: "Home Decor",
								date: "2 hours ago",
								status: "Pending",
							},
							{
								name: "Organic Skincare Studio",
								category: "Beauty",
								date: "5 hours ago",
								status: "Pending",
							},
							{
								name: "Vintage Finds Shop",
								category: "Antiques",
								date: "1 day ago",
								status: "Pending",
							},
							{
								name: "Local Pottery Works",
								category: "Ceramics",
								date: "1 day ago",
								status: "Approved",
							},
						].map((vendor) => (
							<div
								key={vendor.name}
								className="flex items-center justify-between border-b border-border pb-4 last:border-0"
							>
								<div className="flex items-center gap-3">
									<div className="h-10 w-10 rounded-full bg-muted" />
									<div>
										<div className="font-medium">{vendor.name}</div>
										<div className="text-sm text-muted-foreground">
											{vendor.category}
										</div>
									</div>
								</div>
								<div className="text-right">
									<Badge
										variant={
											vendor.status === "Pending" ? "secondary" : "default"
										}
									>
										{vendor.status}
									</Badge>
									<div className="mt-1 text-xs text-muted-foreground">
										{vendor.date}
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Top Performing Vendors */}
				<Card className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-serif text-xl font-semibold">
							Top Performing Vendors
						</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/admin/dashboard/analytics">View all</Link>
						</Button>
					</div>

					<div className="space-y-4">
						{[
							{
								name: "Artisan Crafts Co.",
								sales: "$24,580",
								orders: 342,
								rating: 4.9,
							},
							{
								name: "Handmade Haven",
								sales: "$18,240",
								orders: 256,
								rating: 4.8,
							},
							{
								name: "Local Makers Studio",
								sales: "$15,890",
								orders: 198,
								rating: 4.7,
							},
							{
								name: "Ceramic Dreams",
								sales: "$12,450",
								orders: 167,
								rating: 4.9,
							},
						].map((vendor, index) => (
							<div
								key={vendor.name}
								className="flex items-center gap-4 border-b border-border pb-4 last:border-0"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
									#{index + 1}
								</div>
								<div className="flex-1">
									<div className="font-medium">{vendor.name}</div>
									<div className="text-sm text-muted-foreground">
										{vendor.orders} orders • {vendor.rating} rating
									</div>
								</div>
								<div className="text-right font-semibold">{vendor.sales}</div>
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* Platform Health */}
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<TrendingUp className="h-6 w-6 text-primary" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Avg Order Value
							</div>
							<div className="text-2xl font-bold">$87.50</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<Package className="h-6 w-6 text-accent" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Active Products
							</div>
							<div className="text-2xl font-bold">52,847</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Store className="h-6 w-6 text-primary" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								Commission Rate
							</div>
							<div className="text-2xl font-bold">5.0%</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}

function Package(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m7.5 4.27 9 5.15" />
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
			<path d="m3.3 7 8.7 5 8.7-5" />
			<path d="M12 22V12" />
		</svg>
	);
}
