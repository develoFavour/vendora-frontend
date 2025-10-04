"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navigation() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center gap-8">
						<Link href="/" className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<ShoppingBag className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="font-serif text-xl font-semibold">Vendora</span>
						</Link>

						<div className="hidden md:flex md:gap-6">
							<Link
								href="/marketplace"
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								Marketplace
							</Link>
							<Link
								href="/vendors"
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								Vendors
							</Link>
							<Link
								href="/about"
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								About
							</Link>
						</div>
					</div>

					<div className="hidden md:flex md:items-center md:gap-4">
						<Button variant="ghost" size="sm" asChild>
							<Link href="/login">Log in</Link>
						</Button>
						<Button size="sm" asChild>
							<Link href="/signup">Become a Vendor</Link>
						</Button>
						<Button variant="ghost" size="icon" asChild>
							<Link href="/cart">
								<ShoppingBag className="h-5 w-5" />
							</Link>
						</Button>
					</div>

					<button
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</button>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className="border-t border-border md:hidden">
					<div className="space-y-1 px-4 pb-3 pt-2">
						<Link
							href="/marketplace"
							className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							Marketplace
						</Link>
						<Link
							href="/vendors"
							className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							Vendors
						</Link>
						<Link
							href="/about"
							className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							About
						</Link>
						<div className="flex gap-2 pt-4">
							<Button
								variant="outline"
								className="flex-1 bg-transparent"
								asChild
							>
								<Link href="/login">Log in</Link>
							</Button>
							<Button className="flex-1" asChild>
								<Link href="/signup">Sign up</Link>
							</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
