"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Package,
	ShoppingBag,
	BarChart3,
	Settings,
	LogOut,
	Store,
	MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation = [
	{ name: "Overview", href: "/vendor/dashboard", icon: LayoutDashboard },
	{ name: "Products", href: "/vendor/dashboard/products", icon: Package },
	{ name: "Orders", href: "/vendor/dashboard/orders", icon: ShoppingBag },
	{ name: "Analytics", href: "/vendor/dashboard/analytics", icon: BarChart3 },
	{ name: "Reviews", href: "/vendor/dashboard/reviews", icon: MessageSquare },
	{ name: "Settings", href: "/vendor/dashboard/settings", icon: Settings },
];

export function VendorSidebar() {
	const pathname = usePathname();

	return (
		<aside className="flex w-64 flex-col border-r border-border bg-card">
			{/* Logo */}
			<div className="flex h-16 items-center gap-2 border-b border-border px-6">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
					<Store className="h-5 w-5 text-primary-foreground" />
				</div>
				<span className="font-serif text-xl font-semibold">Vendora</span>
			</div>

			{/* Vendor Info */}
			<div className="border-b border-border p-6">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarFallback className="bg-primary/10 text-primary">
							AC
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 overflow-hidden">
						<div className="truncate font-semibold">Artisan Crafts Co.</div>
						<div className="truncate text-xs text-muted-foreground">
							vendor@example.com
						</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 p-4">
				{navigation.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							)}
						>
							<item.icon className="h-5 w-5" />
							{item.name}
						</Link>
					);
				})}
			</nav>

			{/* Logout */}
			<div className="border-t border-border p-4">
				<Button
					variant="ghost"
					className="w-full justify-start text-muted-foreground"
					size="sm"
				>
					<LogOut className="mr-3 h-5 w-5" />
					Log out
				</Button>
			</div>
		</aside>
	);
}
