import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function VendorsLoading() {
	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />

			<section className="border-b border-border bg-gradient-to-br from-sage/10 to-background">
				<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<div className="text-center">
						<Skeleton className="mx-auto h-8 w-48 mb-6" />
						<Skeleton className="mx-auto h-16 w-3/4 max-w-2xl" />
						<Skeleton className="mx-auto mt-6 h-6 w-2/3 max-w-xl" />
					</div>
				</div>
			</section>

			<section className="flex-1 py-12">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="space-y-3">
								<Skeleton className="aspect-video w-full" />
								<Skeleton className="h-6 w-3/4" />
								<Skeleton className="h-4 w-full" />
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
