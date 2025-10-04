import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VendorProductsPage() {
	const products = [
		{
			id: 1,
			name: "Handwoven Basket",
			category: "Home Decor",
			price: "$30.00",
			stock: 24,
			status: "Active",
		},
		{
			id: 2,
			name: "Ceramic Vase Set",
			category: "Home Decor",
			price: "$45.00",
			stock: 12,
			status: "Active",
		},
		{
			id: 3,
			name: "Wooden Cutting Board",
			category: "Kitchen",
			price: "$30.00",
			stock: 0,
			status: "Out of Stock",
		},
		{
			id: 4,
			name: "Linen Table Runner",
			category: "Textiles",
			price: "$30.00",
			stock: 18,
			status: "Active",
		},
	];

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-serif text-3xl font-bold">Products</h1>
					<p className="mt-2 text-muted-foreground">
						Manage your product inventory and listings
					</p>
				</div>
				<Button asChild>
					<Link href="/vendor/dashboard/products/new">
						<Plus className="mr-2 h-5 w-5" />
						Add Product
					</Link>
				</Button>
			</div>

			{/* Search and Filters */}
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
											<div className="font-medium">{product.name}</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{product.category}
									</td>
									<td className="px-6 py-4 font-semibold">{product.price}</td>
									<td className="px-6 py-4">
										<span
											className={
												product.stock === 0
													? "text-destructive"
													: product.stock < 10
													? "text-accent"
													: "text-foreground"
											}
										>
											{product.stock}
										</span>
									</td>
									<td className="px-6 py-4">
										<Badge
											variant={
												product.status === "Active" ? "default" : "secondary"
											}
										>
											{product.status}
										</Badge>
									</td>
									<td className="px-6 py-4 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreVertical className="h-5 w-5" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem className="text-destructive">
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
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
