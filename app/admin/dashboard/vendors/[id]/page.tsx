"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminVendor } from "@/hooks/use-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Store, Mail, Phone, Calendar, ShieldAlert, Award, AlertTriangle, FileText, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const TIER_COLORS: Record<string, string> = {
	individual: "bg-zinc-100 text-zinc-600",
	verified: "bg-blue-50 text-blue-600",
	business: "bg-primary/5 text-primary",
};

export default function VendorProfilePage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const router = useRouter();

	const { data, isLoading, error } = useAdminVendor(id);

	if (isLoading) {
		return (
			<div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-full">
				<p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading profile...</p>
			</div>
		);
	}

	if (error || !data?.data) {
		return (
			<div className="p-8 max-w-7xl mx-auto space-y-4">
				<Button variant="outline" onClick={() => router.back()} className="mb-4">
					<ArrowLeft className="h-4 w-4 mr-2" /> Back
				</Button>
				<Card className="p-12 text-center border-red-100 bg-red-50/50">
					<AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-4" />
					<h3 className="text-lg font-bold text-red-900">Failed to load profile</h3>
					<p className="text-red-600/80 text-sm mt-1">The requested vendor profile could not be found or loaded.</p>
				</Card>
			</div>
		);
	}

	const v = data.data;
	const account = v.account || {};
	const profile = v.profile || {};
	const app = v.application || {};

	return (
		<div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
			{/* Breadcrubs / Back */}
			<div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
				<Link href="/admin/dashboard/vendors" className="hover:text-zinc-900 transition-colors">Vendors</Link>
				<span className="text-zinc-300">/</span>
				<span className="text-zinc-900 font-medium">{profile.storeName || profile.userName}</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Left Sidebar: ID & Quick Profile */}
				<div className="space-y-6 md:col-span-1">
					<Card className="p-6 border-zinc-200 shadow-sm relative overflow-hidden">
						{/* Background Accent based on Tier */}
						<div className={cn(
							"absolute top-0 left-0 right-0 h-16",
							account.tier === "business" ? "bg-amber-100/50" : account.tier === "verified" ? "bg-blue-100/50" : "bg-zinc-100/50"
						)} />

						<div className="relative pt-6 flex flex-col items-center">
							<div className="h-20 w-20 bg-white border-4 border-white rounded-2xl shadow-sm flex items-center justify-center text-2xl font-black text-zinc-400">
								{profile.storeName?.charAt(0)?.toUpperCase()}
							</div>
							<h2 className="mt-4 text-xl font-bold text-zinc-900">{profile.storeName}</h2>
							<p className="text-zinc-500 text-xs font-medium mt-1">{profile.userName}</p>

							<div className="flex items-center gap-2 mt-4">
								<Badge className={cn("border-none text-[9px] uppercase tracking-widest font-bold py-1 px-3 rounded-full", TIER_COLORS[account.tier] || TIER_COLORS.individual)}>
									{account.tier || "individual"}
								</Badge>
								<Badge variant="outline" className={cn(
									"border border-zinc-200 text-zinc-600 rounded-lg text-[9px] uppercase tracking-widest font-bold",
									account.status === 'suspended' && "bg-amber-100 text-amber-700 border-amber-200",
									account.status === 'banned' && "bg-red-100 text-red-700 border-red-200"
								)}>
									{account.status || "active"}
								</Badge>
							</div>
						</div>

						<div className="mt-8 space-y-4">
							<div className="flex items-center gap-3 text-sm">
								<div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
									<Mail className="h-4 w-4" />
								</div>
								<div className="truncate text-zinc-600">
									<p className="text-[10px] uppercase font-bold text-zinc-400">Email Address</p>
									<p className="truncate font-medium">{profile.userEmail}</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
									<Phone className="h-4 w-4" />
								</div>
								<div className="truncate text-zinc-600">
									<p className="text-[10px] uppercase font-bold text-zinc-400">Phone</p>
									<p className="truncate font-medium">{profile.userPhone || "Not provided"}</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
									<Calendar className="h-4 w-4" />
								</div>
								<div className="truncate text-zinc-600">
									<p className="text-[10px] uppercase font-bold text-zinc-400">Joined Date</p>
									<p className="truncate font-medium">{new Date(account.createdAt).toLocaleDateString()}</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500">
									<Store className="h-4 w-4" />
								</div>
								<div className="truncate text-zinc-600">
									<p className="text-[10px] uppercase font-bold text-zinc-400">Business Type</p>
									<p className="truncate font-medium capitalize">{profile.businessType}</p>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Right Sidebar: Stats & Application Details */}
				<div className="space-y-6 md:col-span-2">
					{/* Performance Stats */}
					<div className="grid grid-cols-3 gap-4">
						<Card className="p-5 flex flex-col justify-center border-zinc-200 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4 opacity-10"><Award className="h-16 w-16" /></div>
							<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Sales</p>
							<p className="text-2xl font-black text-zinc-900 mt-2">${(account.totalSales || 0).toLocaleString()}</p>
						</Card>
						<Card className="p-5 flex flex-col justify-center border-zinc-200 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="h-16 w-16" /></div>
							<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Total Orders</p>
							<p className="text-2xl font-black text-zinc-900 mt-2">{(account.totalOrders || 0).toLocaleString()}</p>
						</Card>
						<Card className="p-5 flex flex-col justify-center border-emerald-100 bg-emerald-50/50 shadow-sm relative overflow-hidden">
							<div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500"><ShieldAlert className="h-16 w-16" /></div>
							<p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Lifetime Earned</p>
							<p className="text-2xl font-black text-emerald-700 mt-2">${(account.lifeTimeEarnings || 0).toLocaleString()}</p>
						</Card>
					</div>

					{/* Compliance & Risk Info */}
					<Card className="p-6 border-zinc-200 shadow-sm">
						<h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
							<ShieldAlert className="h-4 w-4 text-amber-500" />
							Compliance & Risk Profile
						</h3>

						<div className="grid grid-cols-2 gap-6">
							<div>
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Calculated Risk Score</p>
								<div className="flex items-end gap-2">
									<span className={cn(
										"text-3xl font-black block",
										(app.riskScore || 0) > 60 ? "text-red-500" : (app.riskScore || 0) > 30 ? "text-amber-500" : "text-emerald-500"
									)}>{app.riskScore || 0}</span>
									<span className="text-sm text-zinc-400 font-medium mb-1">/ 100</span>
								</div>

								{app.riskFlags && app.riskFlags.length > 0 && (
									<div className="mt-4 space-y-2">
										<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">System Flags</p>
										{app.riskFlags.map((flag: string, idx: number) => {
											const displayFlag = flag.includes("Account created <") 
												? flag.replace("Account created <", "Account was <").replace("ago", "old at application") 
												: flag;
											return (
												<div key={idx} className="flex items-start gap-2 bg-red-50 text-red-700 p-2 rounded text-xs font-medium">
													<AlertTriangle className="h-4 w-4 shrink-0" />
													<span>{displayFlag}</span>
												</div>
											);
										})}
									</div>
								)}
							</div>

							<div>
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Category Authorizations</p>
								<div className="flex flex-wrap gap-2">
									{app.categories && app.categories.length > 0 ? (
										app.categories.map((c: string) => (
											<Badge key={c} variant="secondary" className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200">{c}</Badge>
										))
									) : (
										<span className="text-sm text-zinc-400 italic">None specified</span>
									)}
								</div>

								<div className="mt-6">
									<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-2">Verification Limits</p>
									<ul className="text-sm space-y-2 text-zinc-600">
										<li className="flex justify-between border-b pb-1 border-dashed">
											<span>Product Quota</span>
											<span className="font-bold">{account.maxProducts} items</span>
										</li>
										<li className="flex justify-between border-b pb-1 border-dashed">
											<span>Monthly Sales Cap</span>
											<span className="font-bold">${account.maxMonthlySales}</span>
										</li>
										<li className="flex justify-between">
											<span>Base Tx Fee</span>
											<span className="font-bold">{account.transactionFee}%</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</Card>

					{/* Attached Documents */}
					<Card className="p-6 border-zinc-200 shadow-sm">
						<h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
							<FileText className="h-4 w-4 text-blue-500" />
							Identity Documents
						</h3>

						<div className="grid grid-cols-2 gap-4">
							{app.idDocument && app.idDocument.fileUrl ? (
								<div className="border border-zinc-200 rounded-xl overflow-hidden aspect-video relative bg-zinc-100 group">
									<img src={app.idDocument.fileUrl} alt="ID Document" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<a href={app.idDocument.fileUrl} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-sm">View Full</a>
									</div>
									<div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
										ID Card Front
									</div>
								</div>
							) : (
								<div className="border border-zinc-200 border-dashed rounded-xl flex items-center justify-center aspect-video bg-zinc-50 flex-col gap-2 text-zinc-400">
									<FileText className="h-6 w-6" />
									<span className="text-xs font-medium">No ID uploaded</span>
								</div>
							)}

							{app.selfieVerification && app.selfieVerification.fileUrl ? (
								<div className="border border-zinc-200 rounded-xl overflow-hidden aspect-video relative bg-zinc-100 group">
									<img src={app.selfieVerification.fileUrl} alt="Selfie" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<a href={app.selfieVerification.fileUrl} target="_blank" rel="noreferrer" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-sm">View Full</a>
									</div>
									<div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
										Verification Selfie
									</div>
								</div>
							) : (
								<div className="border border-zinc-200 border-dashed rounded-xl flex items-center justify-center aspect-video bg-zinc-50 flex-col gap-2 text-zinc-400">
									<User className="h-6 w-6" />
									<span className="text-xs font-medium">No selfie uploaded</span>
								</div>
							)}
						</div>

						{app.reviewNotes && (
							<div className="mt-4 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
								<p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-1">AI / Review Context</p>
								<p className="text-sm text-zinc-700 italic">{app.reviewNotes}</p>
							</div>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
}
