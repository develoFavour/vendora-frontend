import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
	id: string;
	name: string;
	vendor: string;
	price: string;
	image?: string;
	inStock?: boolean;
	featured?: boolean;
}

export function ProductCard({
	id,
	name,
	vendor,
	price,
	image,
	inStock = true,
	featured = false,
}: ProductCardProps) {
	return (
		<Card className="group overflow-hidden transition-shadow hover:shadow-lg">
			<Link href={`/products/${id}`}>
				<div className="relative aspect-square overflow-hidden bg-muted">
					{image ? (
						<Image
							height={100}
							width={100}
							src={image || "/placeholder.svg"}
							alt={name}
							className="h-full w-full object-cover transition-transform group-hover:scale-105"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<span className="text-muted-foreground">No image</span>
						</div>
					)}
					{featured && (
						<Badge className="absolute left-3 top-3 bg-accent">Featured</Badge>
					)}
					{!inStock && (
						<Badge variant="secondary" className="absolute left-3 top-3">
							Out of Stock
						</Badge>
					)}
				</div>
			</Link>

			<div className="p-4">
				<Link href={`/products/${id}`}>
					<h3 className="font-medium transition-colors hover:text-primary">
						{name}
					</h3>
				</Link>
				<p className="mt-1 text-sm text-muted-foreground">{vendor}</p>

				<div className="mt-4 flex items-center justify-between">
					<span className="text-lg font-semibold text-primary">{price}</span>
					<div className="flex gap-2">
						<Button size="icon" variant="ghost">
							<Heart className="h-5 w-5" />
						</Button>
						<Button size="icon" disabled={!inStock}>
							<ShoppingCart className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
}
