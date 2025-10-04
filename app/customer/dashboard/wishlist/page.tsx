import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, X } from "lucide-react";

export default function CustomerWishlistPage() {
	const wishlistItems = [
		{
			id: 1,
			name: "Ceramic Vase",
			vendor: "Artisan Crafts Co.",
			price: "$45.00",
			inStock: true,
		},
		{
			id: 2,
			name: "Woven Basket",
			vendor: "Handmade Haven",
			price: "$32.00",
			inStock: true,
		},
		{
			id: 3,
			name: "Linen Throw",
			vendor: "Local Makers Studio",
			price: "$68.00",
			inStock: false,
		},
		{
			id: 4,
			name: "Wooden Bowl",
			vendor: "Artisan Crafts Co.",
			price: "$52.00",
			inStock: true,
		},
	];

	return (
		<div className="p-8">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-serif text-3xl font-bold">My Wishlist</h1>
					<p className="mt-2 text-muted-foreground">
						{wishlistItems.length} items saved for later
					</p>
				</div>
				<Button variant="outline">Share Wishlist</Button>
			</div>

			{/* Wishlist Grid */}
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{wishlistItems.map((item) => (
					<Card key={item.id} className="group relative overflow-hidden">
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
						>
							<X className="h-4 w-4" />
						</Button>

						<div className="aspect-square bg-muted" />

						<div className="p-4">
							<div className="mb-2 flex items-start justify-between">
								<div className="flex-1">
									<h3 className="font-medium">{item.name}</h3>
									<p className="text-sm text-muted-foreground">{item.vendor}</p>
								</div>
							</div>

							<div className="mt-3 flex items-center justify-between">
								<span className="text-lg font-semibold text-primary">
									{item.price}
								</span>
								{!item.inStock && (
									<Badge variant="secondary" className="text-xs">
										Out of Stock
									</Badge>
								)}
							</div>

							<Button className="mt-4 w-full" disabled={!item.inStock}>
								<ShoppingCart className="mr-2 h-4 w-4" />
								Add to Cart
							</Button>
						</div>
					</Card>
				))}
			</div>

			{/* Empty State (hidden when items exist) */}
			{wishlistItems.length === 0 && (
				<Card className="p-12 text-center">
					<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
						<Heart className="h-10 w-10 text-muted-foreground" />
					</div>
					<h3 className="mt-6 font-serif text-xl font-semibold">
						Your wishlist is empty
					</h3>
					<p className="mt-2 text-muted-foreground">
						Start adding products you love to your wishlist
					</p>
					<Button className="mt-6" asChild>
						<a href="/marketplace">Browse Products</a>
					</Button>
				</Card>
			)}
		</div>
	);
}
