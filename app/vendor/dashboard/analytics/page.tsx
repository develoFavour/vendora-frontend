import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, ShoppingBag } from "lucide-react";

export default function VendorAnalyticsPage() {
	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Analytics</h1>
				<p className="mt-2 text-muted-foreground">
					Track your store&apos;s performance and growth
				</p>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<DollarSign className="h-6 w-6 text-primary" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Revenue</div>
							<div className="text-2xl font-bold">$12,426</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<ShoppingBag className="h-6 w-6 text-accent" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Orders</div>
							<div className="text-2xl font-bold">342</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Customers</div>
							<div className="text-2xl font-bold">1,248</div>
						</div>
					</div>
				</Card>

				<Card className="p-6">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
							<TrendingUp className="h-6 w-6 text-accent" />
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Growth</div>
							<div className="text-2xl font-bold">+12.5%</div>
						</div>
					</div>
				</Card>
			</div>

			{/* Charts Placeholder */}
			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				<Card className="p-6">
					<h2 className="mb-4 font-serif text-xl font-semibold">
						Revenue Over Time
					</h2>
					<div className="flex h-64 items-center justify-center rounded-lg bg-muted">
						<p className="text-muted-foreground">
							Chart visualization would go here
						</p>
					</div>
				</Card>

				<Card className="p-6">
					<h2 className="mb-4 font-serif text-xl font-semibold">
						Top Categories
					</h2>
					<div className="flex h-64 items-center justify-center rounded-lg bg-muted">
						<p className="text-muted-foreground">
							Chart visualization would go here
						</p>
					</div>
				</Card>
			</div>
		</div>
	);
}
