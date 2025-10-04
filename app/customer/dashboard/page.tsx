import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Heart, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardPage() {
	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Welcome back, Sarah!</h1>
				<p className="mt-2 text-muted-foreground">
					Here's what's happening with your orders and wishlist.
				</p>
			</div>

			{/* Quick Stats */}
			<div className="grid gap-6 md:grid-cols-4">
				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Package className="h-6 w-6 text-primary" />
						</div>
						<div>
							<div className="text-2xl font-bold">12</div>
							<div className="text-sm text-muted-foreground">Total Orders</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<ShoppingBag className="h-6 w-6 text-accent" />
						</div>
						<div>
							<div className="text-2xl font-bold">3</div>
							<div className="text-sm text-muted-foreground">In Transit</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Heart className="h-6 w-6 text-primary" />
						</div>
						<div>
							<div className="text-2xl font-bold">24</div>
							<div className="text-sm text-muted-foreground">
								Wishlist Items
							</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<TrendingUp className="h-6 w-6 text-accent" />
						</div>
						<div>
							<div className="text-2xl font-bold">$1,248</div>
							<div className="text-sm text-muted-foreground">Total Spent</div>
						</div>
					</div>
				</Card>
			</div>

			{/* Recent Orders */}
			<Card className="mt-8 p-6">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="font-serif text-xl font-semibold">Recent Orders</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/customer/dashboard/orders">View all</Link>
					</Button>
				</div>

				<div className="space-y-4">
					{[
						{
							id: "#3492",
							vendor: "Artisan Crafts Co.",
							date: "Dec 15, 2024",
							total: "$124.00",
							status: "Delivered",
							items: 3,
						},
						{
							id: "#3487",
							vendor: "Handmade Haven",
							date: "Dec 12, 2024",
							total: "$89.50",
							status: "In Transit",
							items: 2,
						},
						{
							id: "#3482",
							vendor: "Local Makers Studio",
							date: "Dec 8, 2024",
							total: "$156.00",
							status: "Delivered",
							items: 4,
						},
					].map((order) => (
						<div
							key={order.id}
							className="flex items-center justify-between border-b border-border pb-4 last:border-0"
						>
							<div className="flex items-center gap-4">
								<div className="h-16 w-16 rounded-lg bg-muted" />
								<div>
									<div className="font-medium">{order.id}</div>
									<div className="text-sm text-muted-foreground">
										{order.vendor}
									</div>
									<div className="mt-1 text-xs text-muted-foreground">
										{order.items} items • {order.date}
									</div>
								</div>
							</div>
							<div className="text-right">
								<div className="font-semibold">{order.total}</div>
								<Badge
									variant={
										order.status === "Delivered" ? "default" : "secondary"
									}
									className="mt-2"
								>
									{order.status}
								</Badge>
							</div>
						</div>
					))}
				</div>
			</Card>

			{/* Wishlist Preview */}
			<Card className="mt-8 p-6">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="font-serif text-xl font-semibold">Your Wishlist</h2>
					<Button variant="ghost" size="sm" asChild>
						<Link href="/customer/dashboard/wishlist">View all</Link>
					</Button>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{
							name: "Ceramic Vase",
							vendor: "Artisan Crafts Co.",
							price: "$45.00",
						},
						{ name: "Woven Basket", vendor: "Handmade Haven", price: "$32.00" },
						{
							name: "Linen Throw",
							vendor: "Local Makers Studio",
							price: "$68.00",
						},
						{
							name: "Wooden Bowl",
							vendor: "Artisan Crafts Co.",
							price: "$52.00",
						},
					].map((item) => (
						<Card key={item.name} className="overflow-hidden p-4">
							<div className="aspect-square rounded-lg bg-muted" />
							<div className="mt-3">
								<div className="text-sm font-medium">{item.name}</div>
								<div className="text-xs text-muted-foreground">
									{item.vendor}
								</div>
								<div className="mt-2 text-sm font-semibold text-primary">
									{item.price}
								</div>
							</div>
						</Card>
					))}
				</div>
			</Card>

			{/* Recommended Products */}
			<Card className="mt-8 p-6">
				<h2 className="mb-6 font-serif text-xl font-semibold">
					Recommended for You
				</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{
							name: "Hand-painted Mug",
							vendor: "Ceramic Studio",
							price: "$28.00",
						},
						{
							name: "Macrame Wall Hanging",
							vendor: "Fiber Arts Co.",
							price: "$42.00",
						},
						{
							name: "Scented Candle Set",
							vendor: "Artisan Crafts Co.",
							price: "$36.00",
						},
						{
							name: "Leather Journal",
							vendor: "Bookbinding Co.",
							price: "$54.00",
						},
					].map((item) => (
						<Card
							key={item.name}
							className="overflow-hidden p-4 hover:shadow-md transition-shadow"
						>
							<div className="aspect-square rounded-lg bg-muted" />
							<div className="mt-3">
								<div className="text-sm font-medium">{item.name}</div>
								<div className="text-xs text-muted-foreground">
									{item.vendor}
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="text-sm font-semibold text-primary">
										{item.price}
									</div>
									<Button size="sm" variant="ghost">
										<Heart className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</Card>
					))}
				</div>
			</Card>
		</div>
	);
}
