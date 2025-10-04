import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Flag } from "lucide-react";

export default function AdminProductsPage() {
	const products = [
		{
			id: 1,
			name: "Handwoven Basket",
			vendor: "Artisan Crafts Co.",
			category: "Home Decor",
			price: "$30.00",
			stock: 24,
			status: "Active",
			reports: 0,
		},
		{
			id: 2,
			name: "Ceramic Vase Set",
			vendor: "Artisan Crafts Co.",
			category: "Home Decor",
			price: "$45.00",
			stock: 12,
			status: "Active",
			reports: 0,
		},
		{
			id: 3,
			name: "Suspicious Product",
			vendor: "Unknown Seller",
			category: "Electronics",
			price: "$999.00",
			stock: 100,
			status: "Flagged",
			reports: 3,
		},
	];

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="font-serif text-3xl font-bold">Product Management</h1>
				<p className="mt-2 text-muted-foreground">
					Monitor and moderate all products on the platform
				</p>
			</div>

			{/* Search */}
			<Card className="mb-6 p-4">
				<div className="flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search products..." className="pl-10" />
					</div>
					<Button variant="outline">Filter</Button>
				</div>
			</Card>

			{/* Products Table */}
			<Card>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Product
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Vendor
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Category
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Price
								</th>
								<th className="px-6 py-4 text-left text-sm font-semibold">
									Stock
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
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-muted/50">
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="h-12 w-12 rounded-lg bg-muted" />
											<div>
												<div className="font-medium">{product.name}</div>
												{product.reports > 0 && (
													<div className="mt-1 flex items-center gap-1 text-xs text-destructive">
														<Flag className="h-3 w-3" />
														{product.reports} reports
													</div>
												)}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{product.vendor}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{product.category}
									</td>
									<td className="px-6 py-4 font-semibold">{product.price}</td>
									<td className="px-6 py-4 text-sm">{product.stock}</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												product.status === "Active" ? "default" : "destructive"
											}
										>
											{product.status}
										</Badge>
									</td>
									<td className="px-6 py-4 text-right">
										<Button variant="ghost" size="sm">
											<Eye className="h-4 w-4" />
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
