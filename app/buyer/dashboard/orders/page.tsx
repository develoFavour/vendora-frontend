"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, Package, Clock, Loader2, ShoppingBag, CreditCard, CheckCircle2 } from "lucide-react";
import { useOrders, useConfirmReceipt } from "@/hooks/use-orders";
import { useVerifyPayment } from "@/hooks/use-payments";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentSuccessModal } from "@/components/checkout/PaymentSuccessModal";

export default function CustomerOrdersPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { data: ordersData, isLoading, refetch } = useOrders();
	const verifyMutation = useVerifyPayment();
	const confirmMutation = useConfirmReceipt();
	const orders = ordersData?.data?.orders || [];

	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

	useEffect(() => {
		const success = searchParams.get("payment_intent_id") === "success";
		const orderId = searchParams.get("orderId");

		if (success) {
			setIsSuccessModalOpen(true);
			
			// If we have an orderId, trigger a manual verification as a fallback
			// (Useful for local development or slow webhooks)
			if (orderId) {
				verifyMutation.mutate(orderId, {
					onSuccess: () => {
						// Immediately refetch to update UI status
						refetch();
					}
				});
			}

			// Clean URL without refresh
			router.replace("/buyer/dashboard/orders");
		}
	}, [searchParams, router, refetch]);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "delivered": return "text-emerald-400";
			case "shipped": return "text-blue-400";
			case "confirmed": return "text-primary";
			case "paid": return "text-primary";
			case "cancelled": return "text-red-400";
			case "refunded": return "text-zinc-500";
			default: return "text-amber-400";
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-[50vh] flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="p-10 max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-700">
			{/* Luxury Header */}
			<div className="flex flex-col gap-4">
				<Badge className="w-fit bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
					Collection History
				</Badge>
				<h1 className="text-5xl font-bold tracking-tighter text-white">
					Order <span className="italic text-primary">Ledger.</span>
				</h1>
				<p className="text-zinc-500 font-medium italic">Monitor your acquisitions and track artisan deliveries.</p>
			</div>

			{/* Refined Search Area */}
			<div className="relative group max-w-xl">
				<Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600 group-focus-within:text-primary transition-colors" />
				<Input
					placeholder="Locate an order ID or order number..."
					className="h-16 rounded-2xl bg-zinc-900/40 border-white/5 pl-16 pr-6 backdrop-blur-xl focus:border-primary/40 focus:bg-zinc-900/60 transition-all text-white placeholder:text-zinc-700"
				/>
			</div>

			{/* Orders Chronicle */}
			<div className="space-y-6">
				{orders.length === 0 ? (
					<div className="py-24 text-center space-y-6">
						<div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto">
							<ShoppingBag className="h-8 w-8 text-zinc-700" />
						</div>
						<h2 className="text-2xl text-zinc-300 font-serif italic">Your ledger is empty.</h2>
						<Link href="/buyer/dashboard/marketplace">
							<Button variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white hover:text-black">
								Acquire Treasures
							</Button>
						</Link>
					</div>
				) : (
					orders.map((order: any) => (
						<Card key={order.id} className="group p-8 bg-zinc-900/40 border-white/5 backdrop-blur-xl hover:border-white/10 transition-all duration-500">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
								<div className="flex items-center gap-8">
									<div className="h-24 w-24 rounded-2xl bg-zinc-800 flex-shrink-0 relative overflow-hidden flex items-center justify-center">
										{order.items?.[0]?.image ? (
											<img src={order.items[0].image} className="h-full w-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" />
										) : (
											<Package className="h-8 w-8 text-zinc-600 group-hover:text-primary transition-colors" />
										)}
										<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
									</div>

									<div className="space-y-2">
										<div className="flex items-center gap-4">
											<span className="text-xl font-bold text-white tracking-tight uppercase">{order.orderNumber}</span>
											<Badge
												variant="outline"
												className={cn(
													"h-6 px-3 rounded-full bg-white/5 border-white/10 text-[8px] font-bold uppercase tracking-widest",
													getStatusColor(order.status)
												)}
											>
												{order.status}
											</Badge>
										</div>
										<div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] line-clamp-1">
											{order.items?.map((it: any) => it.name).join(", ")}
										</div>
										<div className="flex items-center gap-3 mt-4">
											<div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium italic">
												<Clock className="w-3 h-3" />
												Acquired {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt))}
											</div>
											<div className="w-1 h-1 bg-zinc-800 rounded-full" />
											<div className="text-xs text-zinc-600 font-bold uppercase tracking-tighter">
												{order.items?.length || 0} Pieces
											</div>
										</div>
									</div>
								</div>

								<div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-10">
									<div className="text-3xl font-bold text-white tracking-tighter">${order.total?.toLocaleString()}</div>
									{order.status.toLowerCase() === "pending" ? (
										<Button
											asChild
											className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
										>
											<Link href={`/buyer/dashboard/checkout?orderId=${order.id}`}>
												<CreditCard className="mr-2 h-4 w-4" />
												Complete Payment
											</Link>
										</Button>
									) : order.status.toLowerCase() === "shipped" ? (
										<Button
											onClick={() => confirmMutation.mutate(order.id)}
											disabled={confirmMutation.isPending}
											className="rounded-xl h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
										>
											{confirmMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
											Confirm Receipt
										</Button>
									) : (
										<Button
											asChild
											variant="outline"
											className="rounded-xl h-12 px-6 border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
										>
											<Link href={`/buyer/dashboard/orders/${order.id}`}>
												<Eye className="mr-2 h-4 w-4" />
												Examine Details
											</Link>
										</Button>
									)}
								</div>
							</div>
						</Card>
					))
				)}
			</div>

			<PaymentSuccessModal
				isOpen={isSuccessModalOpen}
				onClose={() => setIsSuccessModalOpen(false)}
			/>
		</div>
	);
}
