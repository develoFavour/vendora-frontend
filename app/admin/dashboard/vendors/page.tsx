import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Check, X, Eye } from "lucide-react";

export default function AdminVendorsPage() {
	const vendors = [
		{
			id: 1,
			name: "Handcrafted Goods Co.",
			email: "contact@handcrafted.com",
			category: "Home Decor",
			products: 0,
			status: "Pending",
			date: "Dec 15, 2024",
		},
		{
			id: 2,
			name: "Artisan Crafts Co.",
			email: "hello@artisan.com",
			category: "Home Decor",
			products: 89,
			status: "Active",
			date: "Nov 2, 2024",
		},
		{
			id: 3,
			name: "Organic Skincare Studio",
			email: "info@organicskin.com",
			category: "Beauty",
			products: 0,
			status: "Pending",
			date: "Dec 15, 2024",
		},
		{
			id: 4,
			name: "Handmade Haven",
			email: "shop@handmade.com",
			category: "Crafts",
			products: 67,
			status: "Active",
			date: "Oct 18, 2024",
		},
	];

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Vendor Management</h1>
				<p className="mt-2 text-muted-foreground">
					Review applications and manage vendor accounts
				</p>
			</div>

			{/* Search and Filters */}
			<Card className="mb-6 p-4">
				<div className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search vendors..." className="pl-10" />
					</div>
					<Button variant="outline">All Status</Button>
					<Button variant="outline">Filter</Button>
				</div>
			</Card>

			{/* Vendors Table */}
			<Card>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Vendor
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Category
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Products
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Status
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Applied
								</th>
								<th className="px-6 py-4 text-right text-sm font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{vendors.map((vendor) => (
								<tr key={vendor.id} className="hover:bg-muted/50">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-muted" />
											<div>
												<div className="font-medium">{vendor.name}</div>
												<div className="text-sm text-muted-foreground">
													{vendor.email}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{vendor.category}
									</td>
									<td className="px-6 py-4 text-sm">{vendor.products}</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												vendor.status === "Active" ? "default" : "secondary"
											}
										>
											{vendor.status}
										</Badge>
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{vendor.date}
									</td>
									<td className="px-6 py-4">
										<div className="flex justify-end gap-2">
											{vendor.status === "Pending" ? (
												<>
													<Button
														size="sm"
														variant="ghost"
														className="text-green-600 hover:text-green-700"
													>
														<Check className="h-4 w-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="text-destructive hover:text-destructive"
													>
														<X className="h-4 w-4" />
													</Button>
												</>
											) : (
												<Button size="sm" variant="ghost">
													<Eye className="h-4 w-4" />
												</Button>
											)}
										</div>
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
