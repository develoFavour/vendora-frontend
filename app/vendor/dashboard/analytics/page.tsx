"use client";

import React from "react";
import {
	BarChart3,
	TrendingUp,
	ArrowUpRight,
	ArrowDownRight,
	Calendar,
	Filter,
	Download,
	Loader2,
	DollarSign,
	ShoppingBag,
	Package,
	ChevronDown
} from "lucide-react";
import { 
	BarChart, 
	Bar, 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	ResponsiveContainer,
	Cell
} from "recharts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVendorStats } from "@/hooks/use-vendor-orders";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VendorAnalyticsPage() {
    const [dateRange, setDateRange] = React.useState("7days");

	const { data: statsRes, isLoading } = useVendorStats();
	const stats = statsRes?.data?.stats;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-primary">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	// Calculate the filter cutoff date
	const getCutoffDate = () => {
		const now = new Date();
		switch (dateRange) {
			case "7days":
				return new Date(now.setDate(now.getDate() - 7));
			case "30days":
				return new Date(now.setDate(now.getDate() - 30));
			case "thisYear":
				return new Date(now.getFullYear(), 0, 1); // Jan 1st of current year
			default:
				return new Date(0); // All time
		}
	};
	const cutoff = getCutoffDate();

	// Sort and filter performance data by date
	const performance = [...(stats?.salesPerformance || [])]
		.filter(p => new Date(p.date).getTime() >= cutoff.getTime())
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const maxRevenue = Math.max(...performance.map(p => p.revenue), 1);

    const rangeLabels: Record<string, string> = {
        "7days": "Last 7 Days",
        "30days": "Last 30 Days",
        "thisYear": "This Year",
        "allTime": "All Time"
    };

	return (
		<div className="p-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Header / Export Block */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-2">
					<Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
						Data Intelligence
					</Badge>
					<h1 className="text-5xl font-bold tracking-tighter text-zinc-900">
						Sales <span className="italic text-primary font-serif">Velocity.</span>
					</h1>
					<p className="text-zinc-500 font-medium italic">Monitor market trends and track acquisition growth cycles.</p>
				</div>

				<div className="flex items-center gap-3 relative z-50">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-12 border-border bg-card rounded-xl px-6 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:bg-muted transition-all">
                                <Calendar className="mr-2 h-4 w-4" />
                                {rangeLabels[dateRange]}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-100 shadow-2xl rounded-xl p-2 z-50">
                            <DropdownMenuItem onClick={() => setDateRange("7days")} className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 cursor-pointer rounded-lg py-3 px-4 transition-colors">Last 7 Days</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDateRange("30days")} className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 cursor-pointer rounded-lg py-3 px-4 transition-colors">Last 30 Days</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDateRange("thisYear")} className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 cursor-pointer rounded-lg py-3 px-4 transition-colors">This Year</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDateRange("allTime")} className="text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 cursor-pointer rounded-lg py-3 px-4 transition-colors">All Time</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
					<Button className="h-12 bg-zinc-900 text-white rounded-xl px-6 text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-800 transition-all shadow-xl">
						<Download className="mr-2 h-4 w-4" />
						Export Ledger
					</Button>
				</div>
			</div>

			{/* Performance Overview Chart (Custom Artisan Visualization) */}
			<Card className="bg-white border-border overflow-hidden rounded-[2.5rem] shadow-2xl shadow-zinc-200/50">
				<div className="p-10 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold text-zinc-900 tracking-tight">Revenue Chart</h2>
						<p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-widest">Daily earnings across the acquisition cycle</p>
					</div>
					<div className="flex items-center gap-8">
						<div className="text-right">
							<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Period Peak</p>
							<p className="text-2xl font-bold text-zinc-900 tracking-tighter">${Math.round(maxRevenue).toLocaleString()}</p>
						</div>
					</div>
				</div>

				<div className="p-10 h-[450px]">
					{performance.length === 0 ? (
						<div className="w-full h-full flex items-center justify-center text-zinc-300 italic font-serif">
							Insufficient data for trajectory mapping...
						</div>
					) : (
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={performance} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
								<XAxis 
									dataKey="date" 
									tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 10, fontWeight: "bold", fill: "#a1a1aa" }}
									dy={15}
								/>
								<Tooltip 
									cursor={{ fill: "rgba(0,0,0,0.02)" }}
									content={({ active, payload }) => {
										if (active && payload && payload.length) {
											return (
												<div className="bg-zinc-900 text-white rounded-xl py-3 px-5 shadow-2xl transition-transform border border-zinc-800">
													<p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
														{new Date(payload[0].payload.date).toLocaleDateString()}
													</p>
													<p className="text-sm font-bold">${payload[0].value?.toLocaleString()}</p>
													<p className="text-[10px] font-medium text-zinc-500 mt-1">{payload[0].payload.orders} Orders</p>
												</div>
											);
										}
										return null;
									}}
								/>
								<Bar 
									dataKey="revenue" 
									radius={[6, 6, 6, 6]}
									maxBarSize={60}
								>
									{performance.map((entry, index) => (
										<Cell 
											key={`cell-${index}`} 
											fill={entry.revenue === maxRevenue ? "rgba(13, 148, 136, 1)" : "rgba(244, 244, 245, 1)"} 
											className="transition-colors hover:fill-teal-600/50 cursor-crosshair"
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>
			</Card>

			{/* In-depth Analytics Breakdown */}
			<div className="grid md:grid-cols-3 gap-8">
				{/* Order Composition */}
				<Card className="p-8 border-border bg-card shadow-sm rounded-[2rem] space-y-8">
					<div>
						<h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Settlement Breakdown</h3>
						<p className="text-zinc-500 text-xs mt-1">Status of current fiscal period</p>
					</div>

					<div className="space-y-4">
						{Object.entries(stats?.statusBreakdown || {}).map(([status, count]: [string, any], i) => (
							<div key={i} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className={cn(
										"h-2 w-2 rounded-full",
										status === "paid" ? "bg-blue-500" :
											status === "delivered" ? "bg-emerald-500" :
												status === "shipped" ? "bg-purple-500" : "bg-amber-500"
									)} />
									<span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">{status}</span>
								</div>
								<span className="text-sm font-bold text-zinc-900">{count}</span>
							</div>
						))}
					</div>

					<div className="pt-4">
						<div className="h-2 w-full bg-zinc-50 rounded-full overflow-hidden flex">
							<div className="h-full bg-emerald-500" style={{ width: '45%' }} />
							<div className="h-full bg-blue-500" style={{ width: '30%' }} />
							<div className="h-full bg-purple-500" style={{ width: '25%' }} />
						</div>
					</div>
				</Card>

				{/* Efficiency Metrics */}
				<Card className="p-8 border-border bg-card shadow-sm rounded-[2rem] space-y-8">
					<div>
						<h3 className="font-bold text-zinc-900 uppercase tracking-widest text-[10px]">Merchant Pulse</h3>
						<p className="text-zinc-500 text-xs mt-1">Operational health indicators</p>
					</div>

					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-1">
							<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Avg Order</p>
							<p className="text-2xl font-bold text-zinc-900 tracking-tighter">${Math.round(stats?.avgOrderValue).toLocaleString()}</p>
						</div>
						<div className="space-y-1">
							<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Items/Sale</p>
							<p className="text-2xl font-bold text-zinc-900 tracking-tighter">1.4</p>
						</div>
						<div className="space-y-1">
							<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Conv. Rate</p>
							<p className="text-2xl font-bold text-zinc-900 tracking-tighter">3.2%</p>
						</div>
						<div className="space-y-1">
							<p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Repeat Buy</p>
							<p className="text-2xl font-bold text-zinc-900 tracking-tighter">12%</p>
						</div>
					</div>
				</Card>

				{/* Growth Strategy */}
				<Card className="p-8 border-border bg-zinc-900 text-white rounded-[2rem] relative overflow-hidden group">
					<div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />

					<div className="relative z-10 space-y-6">
						<div className="flex items-center gap-3 text-primary">
							<TrendingUp className="h-6 w-6" />
							<h3 className="font-bold uppercase tracking-[0.2em] text-[10px] text-zinc-400">Yield Prediction</h3>
						</div>
						<p className="text-lg font-bold tracking-tight">Expand your artisan collection to maximize next period's revenue.</p>
						<p className="text-sm text-zinc-400 font-serif italic">"Current market trends favor ceramic and hand-woven artifacts in the coming lunar cycle."</p>
						<Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-14 font-bold text-xs uppercase tracking-widest">
							Analyze Market Trends
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
