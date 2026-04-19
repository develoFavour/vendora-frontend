"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DollarSign, Users, Store, ShoppingBag, Zap,
	ArrowUpRight, AlertTriangle, Loader2, ChevronRight, Clock
} from "lucide-react";
import Link from "next/link";
import { useAdminStats, useTierRequests } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
	const { data: statsRes, isLoading: statsLoading } = useAdminStats();
	const { data: tierRes, isLoading: tierLoading } = useTierRequests("pending");

	const stats = statsRes?.data;
	const tierRequests: any[] = tierRes?.data?.requests || [];

	const STAT_CARDS = [
		{
			label: "Platform Revenue",
			value: stats ? `$${Number(stats.totalRevenue).toLocaleString()}` : "—",
			icon: DollarSign,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
		},
		{
			label: "Active Vendors",
			value: stats?.totalVendors?.toLocaleString() ?? "—",
			icon: Store,
			color: "text-blue-400",
			bg: "bg-blue-400/10",
		},
		{
			label: "Total Customers",
			value: stats?.totalUsers?.toLocaleString() ?? "—",
			icon: Users,
			color: "text-violet-400",
			bg: "bg-violet-400/10",
		},
		{
			label: "Total Orders",
			value: stats?.totalOrders?.toLocaleString() ?? "—",
			icon: ShoppingBag,
			color: "text-amber-400",
			bg: "bg-amber-400/10",
		},
	];

	return (
		<div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div className="flex items-end justify-between">
				<div>
					<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">
						Command Center
					</p>
					<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">
						Platform Overview
					</h1>
					<p className="text-zinc-500 text-sm mt-1">
						Real-time intelligence across the entire Vendora marketplace.
					</p>
				</div>
				{stats?.pendingTierRequests > 0 && (
					<Link href="/admin/dashboard/vendors?tab=upgrades">
						<div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer group">
							<AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
							<div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
									Action Required
								</p>
								<p className="text-sm font-bold text-amber-900">
									{stats.pendingTierRequests} Tier Upgrade{stats.pendingTierRequests > 1 ? "s" : ""} Pending
								</p>
							</div>
							<ChevronRight className="h-4 w-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
						</div>
					</Link>
				)}
			</div>

			{/* Stat cards */}
			<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
				{STAT_CARDS.map((s) => (
					<Card key={s.label} className="p-6 border-border bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow">
						{statsLoading ? (
							<Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
						) : (
							<>
								<div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4", s.bg)}>
									<s.icon className={cn("h-5 w-5", s.color)} />
								</div>
								<div className="text-2xl font-bold tracking-tighter text-zinc-900 dark:text-white">
									{s.value}
								</div>
								<div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">
									{s.label}
								</div>
							</>
						)}
					</Card>
				))}
			</div>

			{/* Pending Tier Requests */}
			<div className="grid lg:grid-cols-2 gap-6">
				<Card className="bg-white dark:bg-zinc-900 border-border rounded-[1.5rem] shadow-sm overflow-hidden">
					<div className="p-6 border-b border-border flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
								<Zap className="h-4 w-4 text-amber-500" />
							</div>
							<div>
								<h2 className="font-bold text-zinc-900 dark:text-white text-sm">Tier Upgrade Queue</h2>
								<p className="text-[10px] text-zinc-400 font-medium">Requests awaiting review</p>
							</div>
						</div>
						<Button variant="ghost" size="sm" asChild className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
							<Link href="/admin/dashboard/vendors?tab=upgrades">View All</Link>
						</Button>
					</div>

					<div className="divide-y divide-border">
						{tierLoading ? (
							<div className="p-10 flex justify-center">
								<Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
							</div>
						) : tierRequests.length === 0 ? (
							<div className="p-10 text-center">
								<p className="text-zinc-400 text-sm font-medium italic">All clear — no pending requests.</p>
							</div>
						) : (
							tierRequests.slice(0, 4).map((req: any) => (
								<div key={req.id} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
									<div className="flex items-center gap-3">
										<div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
											{req.requestedTier?.charAt(0).toUpperCase()}
										</div>
										<div>
											<p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
												{req.currentTier} → {req.requestedTier}
											</p>
											<div className="flex items-center gap-1 mt-0.5">
												<Clock className="h-3 w-3 text-zinc-400" />
												<span className="text-[10px] text-zinc-400 font-medium">
													{new Date(req.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
												</span>
											</div>
										</div>
									</div>
									<Badge className="bg-amber-50 text-amber-700 border-none text-[8px] uppercase tracking-widest font-bold py-1 px-3">
										Pending
									</Badge>
								</div>
							))
						)}
					</div>
				</Card>

				{/* Quick Links */}
				<Card className="bg-white dark:bg-zinc-900 border-border rounded-[1.5rem] shadow-sm p-6">
					<h2 className="font-bold text-zinc-900 dark:text-white text-sm mb-5">
						Quick Navigation
					</h2>
					<div className="space-y-3">
						{[
							{ label: "Manage Vendors", sub: "View and manage all merchant accounts", href: "/admin/dashboard/vendors", color: "bg-blue-50 text-blue-500 border-blue-100" },
							{ label: "Tier Upgrade Requests", sub: "Review and approve verification applications", href: "/admin/dashboard/vendors?tab=upgrades", color: "bg-amber-50 text-amber-500 border-amber-100" },
							{ label: "Product Catalogue", sub: "Browse and moderate listed products", href: "/admin/dashboard/products", color: "bg-violet-50 text-violet-500 border-violet-100" },
						].map((item) => (
							<Link key={item.label} href={item.href}>
								<div className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group cursor-pointer">
									<div>
										<p className="text-sm font-bold text-zinc-900 dark:text-white">{item.label}</p>
										<p className="text-[10px] text-zinc-400 font-medium mt-0.5">{item.sub}</p>
									</div>
									<ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
								</div>
							</Link>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
}
