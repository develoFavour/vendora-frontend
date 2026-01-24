"use client";

import { Card } from "@/components/ui/card";
import {
	DollarSign,
	Package,
	ShoppingBag,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function VendorDashboardPage() {
	const { user } = useAuthStore();
	const firstName = user?.name ? user.name.split(" ")[0] : "Vendor";

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Welcome back, {firstName}!</h1>
				<p className="mt-2 text-muted-foreground">
					Here&apos;s what&apos;s happening with your store today.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="h-6 w-6 text-primary" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							12.5%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">$12,426</div>
						<div className="text-sm text-muted-foreground">Total Revenue</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						+$1,240 from last month
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<ShoppingBag className="h-6 w-6 text-accent" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							8.2%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">342</div>
						<div className="text-sm text-muted-foreground">Total Orders</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						+26 from last month
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="h-6 w-6 text-primary" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-red-600">
							<ArrowDownRight className="h-4 w-4" />
							3.1%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">89</div>
						<div className="text-sm text-muted-foreground">Active Products</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						-3 from last month
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<TrendingUp className="h-6 w-6 text-accent" />
						</div>
						<div className="flex items-center gap-1 text-sm font-medium text-green-600">
							<ArrowUpRight className="h-4 w-4" />
							15.3%
						</div>
					</div>
					<div className="mt-4">
						<div className="text-2xl font-bold">4.8</div>
						<div className="text-sm text-muted-foreground">Average Rating</div>
					</div>
					<div className="mt-2 text-xs text-muted-foreground">
						Based on 127 reviews
					</div>
				</Card>
			</div>

			{/* Recent Orders & Top Products */}
			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				{/* Recent Orders */}
				<Card className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-serif text-xl font-semibold">Recent Orders</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/vendor/dashboard/orders">View all</Link>
						</Button>
					</div>

					<div className="space-y-4">
						{[
							{
								id: "#3492",
								customer: "Sarah Johnson",
								amount: "$124.00",
								status: "Completed",
							},
							{
								id: "#3491",
								customer: "Michael Chen",
								amount: "$89.50",
								status: "Processing",
							},
							{
								id: "#3490",
								customer: "Emma Davis",
								amount: "$156.00",
								status: "Shipped",
							},
							{
								id: "#3489",
								customer: "James Wilson",
								amount: "$67.00",
								status: "Completed",
							},
						].map((order) => (
							<div
								key={order.id}
								className="flex items-center justify-between border-b border-border pb-4 last:border-0"
							>
								<div>
									<div className="font-medium">{order.id}</div>
									<div className="text-sm text-muted-foreground">
										{order.customer}
									</div>
								</div>
								<div className="text-right">
									<div className="font-semibold">{order.amount}</div>
									<div
										className={cn(
											"text-xs",
											order.status === "Completed" && "text-green-600",
											order.status === "Processing" && "text-accent",
											order.status === "Shipped" && "text-primary"
										)}
									>
										{order.status}
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Top Products */}
				<Card className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="font-serif text-xl font-semibold">Top Products</h2>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/vendor/dashboard/products">View all</Link>
						</Button>
					</div>

					<div className="space-y-4">
						{[
							{ name: "Handwoven Basket", sales: 45, revenue: "$1,350" },
							{ name: "Ceramic Vase Set", sales: 38, revenue: "$1,710" },
							{ name: "Wooden Cutting Board", sales: 32, revenue: "$960" },
							{ name: "Linen Table Runner", sales: 28, revenue: "$840" },
						].map((product, index) => (
							<div
								key={product.name}
								className="flex items-center gap-4 border-b border-border pb-4 last:border-0"
							>
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
									#{index + 1}
								</div>
								<div className="flex-1">
									<div className="font-medium">{product.name}</div>
									<div className="text-sm text-muted-foreground">
										{product.sales} sales
									</div>
								</div>
								<div className="text-right font-semibold">
									{product.revenue}
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card className="mt-8 p-6">
				<h2 className="mb-4 font-serif text-xl font-semibold">Quick Actions</h2>
				<div className="flex flex-wrap gap-3">
					<Button asChild>
						<Link href="/vendor/dashboard/products/new">Add New Product</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/vendor/dashboard/orders">Process Orders</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/vendor/dashboard/analytics">View Analytics</Link>
					</Button>
				</div>
			</Card>
		</div>
	);
}


