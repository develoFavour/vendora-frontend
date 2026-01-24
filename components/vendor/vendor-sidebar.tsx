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
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { clearAuthTokens } from "@/lib/api";
import { toast } from "sonner";

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
	const router = useRouter();
	const { user, clearAuth } = useAuthStore();

	const handleLogout = () => {
		clearAuth();
		clearAuthTokens();
		toast.success("Signed out successfully");
		router.push("/login");
	};

	const initials = user?.name
		? user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
		: "V";

	return (
		<aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
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
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 overflow-hidden">
						<div className="truncate font-semibold">
							{user?.name || "Vendor Name"}
						</div>
						<div className="truncate text-xs text-muted-foreground">
							{user?.email || "vendor@example.com"}
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
					className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
					size="sm"
					onClick={handleLogout}
				>
					<LogOut className="mr-3 h-5 w-5" />
					Log out
				</Button>
			</div>
		</aside>
	);
}
