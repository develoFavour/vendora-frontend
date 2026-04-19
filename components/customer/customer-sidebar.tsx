"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	ShoppingBag,
	Package,
	Heart,
	User,
	Settings,
	LogOut,
	Home,
	ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { useProfile } from "@/hooks/use-user";
import { clearAuthTokens } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const navigation = [
	{ name: "Overview", href: "/buyer/dashboard", icon: Home },
	{ name: "Marketplace", href: "/buyer/dashboard/marketplace", icon: ShoppingBag },
	{ name: "Orders", href: "/buyer/dashboard/orders", icon: Package },
	{ name: "Cart", href: "/buyer/dashboard/cart", icon: ShoppingCart },
	{ name: "Wishlist", href: "/buyer/dashboard/wishlist", icon: Heart },
	{ name: "Profile", href: "/buyer/dashboard/profile", icon: User },
];

export function CustomerSidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { user: authUser, clearAuth } = useAuthStore();
	const { data: profileRes } = useProfile();

	// Use profile data if available, fallback to auth store user
	const user = profileRes?.data?.user || authUser;

	const handleLogout = () => {
		clearAuth();
		clearAuthTokens();
		toast.success("Signed out successfully");
		router.push("/login");
	};

	const userInitials = user?.name
		? user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
		: "U";

	return (
		<aside className="flex w-72 shrink-0 flex-col border-r border-white/5 bg-zinc-950/80 backdrop-blur-3xl h-full relative z-50">
			{/* Logo Section */}
			<div className="flex h-24 items-center gap-4 border-b border-white/5 px-8">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-xl shadow-primary/20">
					<ShoppingBag className="h-5 w-5 text-white" />
				</div>
				<span className="text-2xl font-bold tracking-tighter text-white">
					Vendora<span className="text-primary italic">.</span>
				</span>
			</div>

			{/* User Profile Card */}
			<div className="p-6">
				<div className="flex flex-col gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group transition-all duration-500 hover:bg-white/[0.05]">
					<div className="flex items-center gap-3">
						<div className="relative">
							<Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-colors">
								<AvatarImage src={user?.profile?.profileImage || user?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
								<AvatarFallback className="bg-primary/10 text-primary font-bold">
									{userInitials}
								</AvatarFallback>
							</Avatar>
							<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="truncate font-bold text-white tracking-tight">{user?.name || "Member"}</div>
							<div className="flex items-center gap-1.5 mt-0.5">
								<Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold uppercase tracking-widest bg-primary/5 text-primary border-primary/30">
									Collector
								</Badge>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-2 p-6 overflow-y-auto no-scrollbar">
				<div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
					Main Menu
				</div>
				{navigation.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300 group relative",
								isActive
									? "text-primary bg-primary/5 shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]"
									: "text-zinc-500 hover:text-white hover:bg-white/[0.03]"
							)}
						>
							{isActive && (
								<div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
							)}
							<item.icon className={cn(
								"h-5 w-5 transition-transform duration-300",
								isActive ? "text-primary" : "group-hover:scale-110"
							)} />
							<span className="tracking-tight">{item.name}</span>
						</Link>
					);
				})}
			</nav>

			{/* Footer Actions */}
			<div className="p-6 border-t border-white/5 space-y-3">
				<Button
					variant="ghost"
					className="w-full justify-start rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-6 font-bold"
					asChild
				>
					<Link href="/">
						<Home className="mr-4 h-5 w-5" />
						<span className="tracking-tight text-xs uppercase tracking-[0.2em]">Public Boutique</span>
					</Link>
				</Button>
				<Button
					variant="ghost"
					className="w-full justify-start rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 px-4 py-6 font-bold group"
					onClick={handleLogout}
				>
					<LogOut className="mr-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
					<span className="tracking-tight text-xs uppercase tracking-[0.2em]">Exit Portal</span>
				</Button>
			</div>
		</aside>
	);
}
