import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function MarketplaceLoading() {
	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			<section className="border-b border-border bg-muted/30">
				<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
					<Skeleton className="h-12 w-64" />
					<Skeleton className="mt-4 h-6 w-96" />
				</div>
			</section>

			<section className="flex-1">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="space-y-3">
								<Skeleton className="aspect-square w-full" />
								<Skeleton className="h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</div>
						))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
