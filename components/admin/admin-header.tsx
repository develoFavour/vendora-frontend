"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
	const { user } = useAuthStore();

	return (
		<header className="h-16 border-b border-border bg-white dark:bg-zinc-900 px-8 flex items-center justify-between sticky top-0 z-30">
			<div className="flex items-center gap-4 flex-1 max-w-xl">
				<div className="relative w-full max-w-md hidden md:block">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
					<Input 
						placeholder="Search portal..." 
						className="pl-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-primary/20" 
					/>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-zinc-500">
					<Bell className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-zinc-500">
					<Settings className="h-4 w-4" />
				</Button>
				
				<div className="h-8 w-[1px] bg-border mx-2" />
				
				<div className="flex items-center gap-3 pl-2">
					<div className="text-right hidden sm:block">
						<div className="text-xs font-bold text-zinc-900 dark:text-white">System Admin</div>
						<div className="text-[10px] font-bold text-primary uppercase tracking-widest">{user?.name}</div>
					</div>
					<div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
						{user?.name?.charAt(0).toUpperCase()}
					</div>
				</div>
			</div>
		</header>
	);
}
