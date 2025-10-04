import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";

interface VendorCardProps {
	id: string;
	name: string;
	description: string;
	category: string;
	location?: string;
	rating?: number;
	verified?: boolean;
}

export function VendorCard({
	id,
	name,
	description,
	category,
	location,
	rating,
	verified = false,
}: VendorCardProps) {
	return (
		<Card className="overflow-hidden p-6 transition-shadow hover:shadow-lg">
			<Link href={`/vendors/${id}`}>
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-3">
						<div className="h-12 w-12 rounded-full bg-primary/10" />
						<div>
							<div className="flex items-center gap-2">
								<h3 className="font-semibold transition-colors hover:text-primary">
									{name}
								</h3>
								{verified && <Badge variant="secondary">Verified</Badge>}
							</div>
							<p className="mt-1 text-sm text-muted-foreground">{category}</p>
						</div>
					</div>
					{rating && (
						<div className="flex items-center gap-1 text-sm font-medium">
							<Star className="h-4 w-4 fill-accent text-accent" />
							{rating}
						</div>
					)}
				</div>

				<p className="mt-4 text-sm text-muted-foreground">{description}</p>

				{location && (
					<div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin className="h-4 w-4 text-accent" />
						{location}
					</div>
				)}
			</Link>
		</Card>
	);
}
