/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Store, Zap, Check, X, Loader2, Search,
	ChevronRight, Clock, ArrowUpRight, AlertTriangle, MoreHorizontal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
	DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
	useAdminVendors, useTierRequests, useApproveTier, useRejectTier,
	useBanVendor, useUnsuspendVendor
} from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const TIER_COLORS: Record<string, string> = {
	individual: "bg-zinc-100 text-zinc-600",
	verified: "bg-blue-50 text-blue-600",
	business: "bg-primary/5 text-primary",
};

export default function AdminVendorsPage() {
	const searchParams = useSearchParams();
	const defaultTab = searchParams.get("tab") === "upgrades" ? "upgrades" : "vendors";

	const [searchQuery, setSearchQuery] = useState("");
	const [tierStatusFilter, setTierStatusFilter] = useState("pending");
	const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
	const [rejectReason, setRejectReason] = useState("");
	const [approvingId, setApprovingId] = useState<string | null>(null);

	const { data: vendorsRes, isLoading: vendorsLoading } = useAdminVendors();
	const { data: tierRes, isLoading: tierLoading } = useTierRequests(tierStatusFilter);
	const approveTier = useApproveTier();
	const rejectTier = useRejectTier();
	const banVendor = useBanVendor();
	const unsuspendVendor = useUnsuspendVendor();

	const vendors: any[] = vendorsRes?.data?.vendors || [];
	const tierRequests: any[] = tierRes?.data?.requests || [];

	const filteredVendors = vendors.filter((v) =>
		!searchQuery || v.storeName?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	console.log("filteredVendors", filteredVendors)
	const handleApprove = async (id: string) => {
		setApprovingId(id);
		await approveTier.mutateAsync(id);
		setApprovingId(null);
	};

	const handleReject = async () => {
		if (!rejectModal.id) return;
		await rejectTier.mutateAsync({ id: rejectModal.id, reason: rejectReason });
		setRejectModal({ open: false, id: null });
		setRejectReason("");
	};

	return (
		<div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">Merchant Control</p>
				<h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">Vendor Management</h1>
				<p className="text-zinc-500 text-sm mt-1">Manage merchant accounts and process tier elevation requests.</p>
			</div>

			<Tabs defaultValue={defaultTab}>
				<TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl h-auto">
					<TabsTrigger
						value="vendors"
						className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
					>
						<Store className="h-3.5 w-3.5" />
						Active Vendors
						<span className="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[9px] font-bold px-2 py-0.5 rounded-full">
							{vendors.length}
						</span>
					</TabsTrigger>
					<TabsTrigger
						value="upgrades"
						className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
					>
						<Zap className="h-3.5 w-3.5" />
						Tier Requests
						{tierRequests.length > 0 && (
							<span className="bg-amber-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
								{tierRequests.length}
							</span>
						)}
					</TabsTrigger>
				</TabsList>

				{/* ── Vendors Tab ── */}
				<TabsContent value="vendors" className="mt-6">
					{/* Search */}
					<div className="relative mb-5">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
						<input
							placeholder="Search vendors by store name..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-border rounded-2xl text-sm font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
						/>
					</div>

					<Card className="overflow-hidden border-border bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm">
						{vendorsLoading ? (
							<div className="p-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>
						) : filteredVendors.length === 0 ? (
							<div className="p-20 text-center">
								<Store className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
								<p className="text-zinc-400 font-medium italic">No vendor accounts found.</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b border-border bg-zinc-50 dark:bg-zinc-800/50">
										<tr>
											{["Merchant", "Tier", "Status", "Earnings", "Joined", "Actions"].map((h) => (
												<th key={h} className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-widest text-zinc-400">{h}</th>
											))}
										</tr>
									</thead>
									<tbody className="divide-y divide-border">
										{filteredVendors.map((v: any, id: number) => (
											<tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-500">
															{v.storeName?.charAt(0)?.toUpperCase() || "?"}
														</div>
														<div>
															<p className="font-bold text-sm text-zinc-900 dark:text-white">{v.storeName || "Unnamed Store"}</p>
															<p className="text-[10px] text-zinc-400 font-medium">{v.businessType || "Independent"}</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<Badge className={cn("border-none text-[9px] uppercase tracking-widest font-bold py-1 px-3 rounded-full", TIER_COLORS[v.tier] || TIER_COLORS.individual)}>
														{v.tier || "individual"}
													</Badge>
												</td>
												<td className="px-6 py-4 font-bold text-sm text-zinc-700 dark:text-zinc-300">
													<Badge variant="outline" className={cn(
														"border border-zinc-200 text-zinc-600 rounded-lg",
														v.status === 'suspended' && "bg-amber-100 text-amber-700 border-amber-200",
														v.status === 'banned' && "bg-red-100 text-red-700 border-red-200"
													)}>
														{v.status || "active"}
													</Badge>
												</td>
												<td className="px-6 py-4 font-bold text-[11px] text-emerald-600">
													${(v.lifeTimeEarnings || 0).toLocaleString()}
												</td>
												<td className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex flex-col gap-1">
													<span>{new Date(v.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
													{v.status === 'suspended' && <span className="text-amber-500 font-bold">Suspended until: {new Date(v.suspendedUntil).toLocaleDateString()}</span>}
												</td>
												<td className="px-6 py-4">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-zinc-900 data-[state=open]:bg-zinc-100">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-[160px] p-2 bg-white rounded-xl shadow-lg border border-zinc-100">
															<DropdownMenuItem className="text-xs font-bold text-zinc-700 cursor-pointer focus:bg-zinc-50 focus:text-primary rounded-lg" asChild>
																<Link href={`/admin/dashboard/vendors/${v.userID}`} className="flex w-full items-center">
																	<ArrowUpRight className="mr-2 h-3.5 w-3.5" />
																	View Profile
																</Link>
															</DropdownMenuItem>
															<DropdownMenuSeparator className="bg-zinc-100 my-1" />
															{(v.status === 'suspended' || v.status === 'banned') ? (
																<DropdownMenuItem
																	className="text-xs font-bold text-emerald-600 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 rounded-lg"
																	onClick={() => unsuspendVendor.mutate(v.userID)}
																	disabled={unsuspendVendor.isPending}
																>
																	<Check className="mr-2 h-3.5 w-3.5" />
																	Unsuspend
																</DropdownMenuItem>
															) : (
																<DropdownMenuItem
																	className="text-xs font-bold text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 rounded-lg"
																	onClick={() => banVendor.mutate(v.userID)}
																	disabled={banVendor.isPending}
																>
																	<AlertTriangle className="mr-2 h-3.5 w-3.5" />
																	Suspend Vendor
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</Card>
				</TabsContent>

				{/* ── Tier Requests Tab ── */}
				<TabsContent value="upgrades" className="mt-6">
					<div className="flex gap-2 mb-6 overscroll-auto">
						{['all', 'pending', 'approved', 'rejected'].map(status => (
							<Button
								key={status}
								variant="outline"
								size="sm"
								onClick={() => setTierStatusFilter(status)}
								className={cn(
									"rounded-full px-5 h-8 text-[10px] uppercase font-bold tracking-widest",
									tierStatusFilter === status ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-transparent text-zinc-500 border-zinc-200"
								)}
							>
								{status}
							</Button>
						))}
					</div>
					{tierLoading ? (
						<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>
					) : tierRequests.length === 0 ? (
						<Card className="p-20 text-center border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-[1.5rem]">
							<Zap className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
							<p className="font-bold text-zinc-400">All tier requests have been processed.</p>
							<p className="text-[10px] text-zinc-500 mt-1 font-medium italic">No pending applications in the queue.</p>
						</Card>
					) : (
						<div className="space-y-4">
							{tierRequests.map((req: any) => (
								<Card key={req.id || req._id} className="bg-white dark:bg-zinc-900 border-border rounded-[1.5rem] shadow-sm overflow-hidden">
									<div className="p-6">
										<div className="flex items-start justify-between gap-4">
											<div className="flex items-center gap-4">
												{/* Tier graphic */}
												<div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex flex-col items-center justify-center gap-0.5">
													<Zap className="h-5 w-5 text-amber-500" />
													<span className="text-[8px] font-bold uppercase tracking-wider text-amber-600">Upgrade</span>
												</div>
												<div>
													<div className="flex items-center gap-2 mb-1">
														<Badge className={cn("border-none text-[8px] uppercase tracking-widest font-bold py-0.5 px-2", TIER_COLORS[req.currentTier] || TIER_COLORS.individual)}>
															{req.currentTier}
														</Badge>
														<ArrowUpRight className="h-3 w-3 text-zinc-400" />
														<Badge className={cn("border-none text-[8px] uppercase tracking-widest font-bold py-0.5 px-2", TIER_COLORS[req.requestedTier] || TIER_COLORS.individual)}>
															{req.requestedTier}
														</Badge>
													</div>
													<p className="text-xs text-zinc-500 font-medium">
														Vendor ID: <span className="font-mono text-zinc-800 dark:text-zinc-300">{req.vendorID || req.vendorId}</span>
													</p>
													<div className="flex items-center gap-1 mt-1">
														<Clock className="h-3 w-3 text-zinc-400" />
														<span className="text-[10px] text-zinc-400 font-medium">
															Submitted {new Date(req.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
														</span>
													</div>
												</div>
											</div>

											{/* Actions — only for pending requests */}
											<div className="flex items-center gap-2 flex-shrink-0">
												{req.status === 'pending' ? (
													<>
														<Button
															size="sm"
															variant="outline"
															className="h-9 px-4 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 text-[10px] font-bold uppercase tracking-widest"
															onClick={() => setRejectModal({ open: true, id: req.id || req._id })}
															disabled={approveTier.isPending || rejectTier.isPending}
														>
															<X className="h-3.5 w-3.5 mr-1.5" />
															Reject
														</Button>
														<Button
															size="sm"
															className="h-9 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg"
															onClick={() => handleApprove(req.id || req._id)}
															disabled={approveTier.isPending || rejectTier.isPending}
														>
															{approvingId === (req.id || req._id) ? (
																<Loader2 className="h-3.5 w-3.5 animate-spin" />
															) : (
																<><Check className="h-3.5 w-3.5 mr-1.5" />Approve</>
															)}
														</Button>
													</>
												) : req.status === 'rejected' ? (
													<>
														<Button size="sm" variant="outline"
															className="h-9 px-4 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 text-[10px] font-bold uppercase tracking-widest"
															onClick={() => unsuspendVendor.mutate(req.vendorId || req.vendorID)}
															disabled={unsuspendVendor.isPending}
														>Unsuspend</Button>
														<Button size="sm" variant="outline"
															className="h-9 px-4 rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold uppercase tracking-widest"
															onClick={() => banVendor.mutate(req.vendorId || req.vendorID)}
															disabled={banVendor.isPending}
														>Ban Vendor</Button>
													</>
												) : (
													<Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-bold uppercase tracking-widest">Approved</Badge>
												)}
											</div>
										</div>

										{/* Documents section */}
										{req.documents?.length > 0 && (
											<div className="mt-5 pt-5 border-t border-dashed border-zinc-100 dark:border-zinc-800">
												<p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Submitted Documents</p>
												<div className="flex flex-wrap gap-2">
													{req.documents.map((doc: any, i: number) => (
														<a
															key={i}
															href={doc.fileUrl}
															target="_blank"
															rel="noreferrer"
															className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 transition-colors"
														>
															<ChevronRight className="h-3 w-3" />
															{doc.documentType || `Document ${i + 1}`}
														</a>
													))}
												</div>
											</div>
										)}
										{/* AI / Admin rejection notes */}
										{req.status === 'rejected' && (req.adminNotes || req.reviewNotes) && (
											<div className="mt-4 pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800 space-y-2">
												{req.adminNotes && (
													<div className="p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700">
														<span className="font-bold uppercase text-[9px] block mb-1 opacity-70">Admin / AI Decision:</span>
														{req.adminNotes}
													</div>
												)}
												{req.reviewNotes && (
													<div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-600">
														<span className="font-bold uppercase text-[9px] block mb-1 opacity-70">AI System Analysis:</span>
														{req.reviewNotes}
													</div>
												)}
											</div>
										)}
									</div>
								</Card>
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Reject reason modal */}
			<Dialog open={rejectModal.open} onOpenChange={(o) => setRejectModal({ open: o, id: null })}>
				<DialogContent className="max-w-md bg-white border-none rounded-[2rem] p-8 shadow-2xl">
					<DialogHeader className="mb-6">
						<div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
							<AlertTriangle className="h-5 w-5 text-red-500" />
						</div>
						<DialogTitle className="text-xl font-bold tracking-tight">Reject Upgrade Request</DialogTitle>
						<DialogDescription className="text-zinc-500 text-sm">
							Provide a reason to help the vendor understand what's needed to re-apply.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<Textarea
							placeholder="e.g. Documents provided were unclear or expired. Please re-submit with a valid government-issued ID..."
							value={rejectReason}
							onChange={(e) => setRejectReason(e.target.value)}
							className="min-h-[120px] rounded-2xl border-zinc-100 bg-zinc-50 text-sm resize-none focus:border-zinc-200 focus:ring-1 focus:ring-zinc-200"
						/>
						<div className="flex gap-3">
							<Button
								variant="outline"
								className="flex-1 rounded-xl border-zinc-100"
								onClick={() => setRejectModal({ open: false, id: null })}
							>
								Cancel
							</Button>
							<Button
								className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest"
								onClick={handleReject}
								disabled={rejectTier.isPending}
							>
								{rejectTier.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Rejection"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
