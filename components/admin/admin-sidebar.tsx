"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	LayoutDashboard, Users, Store, Package,
	ShoppingBag, Settings, LogOut, Shield, Zap, FolderTree
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useTierRequests } from "@/hooks/use-admin";

const navigation = [
	{ name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
	{ name: "Vendors", href: "/admin/dashboard/vendors", icon: Store },
	{ name: "Categories", href: "/admin/dashboard/categories-management", icon: FolderTree },
	{ name: "Customers", href: "/admin/dashboard/customers", icon: Users },
	{ name: "Products", href: "/admin/dashboard/products", icon: Package },
	{ name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingBag },
	{ name: "Settings", href: "/admin/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, clearAuth } = useAuthStore();
	const { data: tierRes } = useTierRequests("pending");
	const pendingCount: number = tierRes?.data?.requests?.length || 0;

	const handleLogout = () => {
		clearAuth();
		router.replace("/admin/login");
	};

	return (
		<aside className="flex w-64 flex-col border-r border-border bg-white dark:bg-zinc-900 min-h-screen">
			{/* Logo */}
			<div className="flex h-16 items-center gap-3 border-b border-border px-6">
				<div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
					<Shield className="h-4 w-4 text-primary" />
				</div>
				<div>
					<span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">Vendora</span>
					<span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-primary/60">Control Panel</span>
				</div>
			</div>

			{/* Admin identity */}
			<div className="border-b border-border px-6 py-4">
				<div className="flex items-center gap-3">
					<div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300">
						{user?.name?.charAt(0)?.toUpperCase() || "A"}
					</div>
					<div className="flex-1 overflow-hidden">
						<div className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name || "Administrator"}</div>
						<div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 truncate">{user?.email}</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-4 space-y-1">
				{navigation.map((item) => {
					const isActive = item.exact
						? pathname === item.href
						: pathname.startsWith(item.href);

					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
								isActive
									? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
									: "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800"
							)}
						>
							<item.icon className="h-4 w-4 flex-shrink-0" />
							{item.name}

							{/* Badge for vendor tier requests */}
							{item.name === "Vendors" && pendingCount > 0 && (
								<span className={cn(
									"ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full",
									isActive
										? "bg-white/20 text-white"
										: "bg-amber-100 text-amber-700"
								)}>
									{pendingCount}
								</span>
							)}
						</Link>
					);
				})}

				{/* Tier requests shortcut */}
				{pendingCount > 0 && (
					<Link
						href="/admin/dashboard/vendors?tab=upgrades"
						className={cn(
							"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
							"text-amber-600 bg-amber-50 hover:bg-amber-100"
						)}
					>
						<Zap className="h-4 w-4 flex-shrink-0" />
						Tier Requests
						<span className="ml-auto bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
							{pendingCount}
						</span>
					</Link>
				)}
			</nav>

			{/* Logout */}
			<div className="border-t border-border p-4">
				<Button
					variant="ghost"
					className="w-full justify-start text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-sm font-bold transition-all"
					size="sm"
					onClick={handleLogout}
				>
					<LogOut className="mr-3 h-4 w-4" />
					Sign Out
				</Button>
			</div>
		</aside>
	);
}
