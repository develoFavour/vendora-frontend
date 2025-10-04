import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t border-border bg-muted/30">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
					<div className="col-span-2">
						<Link href="/" className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<ShoppingBag className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="font-serif text-xl font-semibold">Vendora</span>
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Empowering independent sellers and connecting conscious consumers
							with unique products from local businesses.
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold">Marketplace</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									href="/marketplace"
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									Browse Products
								</Link>
							</li>
							<li>
								<Link
									href="/vendors"
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									Find Vendors
								</Link>
							</li>
							<li>
								<Link
									href="/categories"
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									Categories
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold">Vendors</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									href="/signup"
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									Become a Vendor
								</Link>
							</li>
							<li>
								<Link
									href="/vendor/login"
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									Vendor Login
								</Link>
							</li>
							<li>
								<Link
									href="/pricing"
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									Pricing
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t border-border pt-8">
					<p className="text-center text-sm text-muted-foreground">
						© {new Date().getFullYear()} Vendora. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
