import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye } from "lucide-react";

export default function CustomerOrdersPage() {
	const orders = [
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
		{
			id: "#3475",
			vendor: "Artisan Crafts Co.",
			date: "Dec 3, 2024",
			total: "$67.00",
			status: "Delivered",
			items: 1,
		},
	];

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Order History</h1>
				<p className="mt-2 text-muted-foreground">
					Track and manage all your orders
				</p>
			</div>

			{/* Search */}
			<Card className="mb-6 p-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<Input placeholder="Search orders..." className="pl-10" />
				</div>
			</Card>

			{/* Orders List */}
			<div className="space-y-4">
				{orders.map((order) => (
					<Card key={order.id} className="p-6">
						<div className="flex items-start justify-between">
							<div className="flex gap-4">
								<div className="h-20 w-20 rounded-lg bg-muted" />
								<div>
									<div className="flex items-center gap-3">
										<span className="font-semibold">{order.id}</span>
										<Badge
											variant={
												order.status === "Delivered" ? "default" : "secondary"
											}
										>
											{order.status}
										</Badge>
									</div>
									<div className="mt-1 text-sm text-muted-foreground">
										{order.vendor}
									</div>
									<div className="mt-2 text-sm">
										<span className="text-muted-foreground">Ordered on</span>{" "}
										{order.date}
									</div>
									<div className="mt-1 text-sm text-muted-foreground">
										{order.items} items
									</div>
								</div>
							</div>
							<div className="text-right">
								<div className="text-xl font-bold">{order.total}</div>
								<Button
									variant="outline"
									size="sm"
									className="mt-4 bg-transparent"
								>
									<Eye className="mr-2 h-4 w-4" />
									View Details
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
