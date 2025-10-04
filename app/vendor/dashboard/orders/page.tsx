import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";

export default function VendorOrdersPage() {
	const orders = [
		{
			id: "#3492",
			customer: "Sarah Johnson",
			date: "Dec 15, 2024",
			total: "$124.00",
			status: "Completed",
			items: 3,
		},
		{
			id: "#3491",
			customer: "Michael Chen",
			date: "Dec 15, 2024",
			total: "$89.50",
			status: "Processing",
			items: 2,
		},
		{
			id: "#3490",
			customer: "Emma Davis",
			date: "Dec 14, 2024",
			total: "$156.00",
			status: "Shipped",
			items: 4,
		},
		{
			id: "#3489",
			customer: "James Wilson",
			date: "Dec 14, 2024",
			total: "$67.00",
			status: "Completed",
			items: 1,
		},
	];

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Orders</h1>
				<p className="mt-2 text-muted-foreground">
					Track and manage your customer orders
				</p>
			</div>

			{/* Search */}
			<Card className="mb-6 p-4">
				<div className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search orders..." className="pl-10" />
					</div>
					<Button variant="outline">Filter</Button>
				</div>
			</Card>

			{/* Orders Table */}
			<Card>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Order ID
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Customer
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Date
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Items
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Total
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Status
								</th>
								<th className="px-6 py-4 text-right text-sm font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{orders.map((order) => (
								<tr key={order.id} className="hover:bg-muted/50">
									<td className="px-6 py-4 font-medium">{order.id}</td>
									<td className="px-6 py-4">{order.customer}</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{order.date}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{order.items}
									</td>
									<td className="px-6 py-4 font-semibold">{order.total}</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												order.status === "Completed"
													? "default"
													: order.status === "Processing"
													? "secondary"
													: "outline"
											}
										>
											{order.status}
										</Badge>
									</td>
									<td className="px-6 py-4 text-right">
										<Button variant="ghost" size="sm">
											<Eye className="mr-2 h-4 w-4" />
											View
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}
