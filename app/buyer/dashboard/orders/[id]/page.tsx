"use client";

import React from "react";
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    CreditCard,
    ShieldCheck,
    Loader2,
    Calendar,
    Receipt,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder, useConfirmReceipt } from "@/hooks/use-orders";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;

    const { data: orderData, isLoading } = useOrder(orderId);
    const confirmMutation = useConfirmReceipt();

    const order = orderData?.data?.order;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "delivered": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
            case "shipped": return "text-blue-400 border-blue-500/20 bg-blue-500/10";
            case "confirmed": return "text-primary border-primary/20 bg-primary/10";
            case "paid": return "text-primary border-primary/20 bg-primary/10";
            case "cancelled": return "text-red-400 border-red-500/20 bg-red-500/10";
            default: return "text-amber-400 border-amber-500/20 bg-amber-500/10";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl text-white font-serif italic">Acquisition not found</h1>
                <Link href="/buyer/dashboard/orders">
                    <Button variant="outline" className="rounded-full px-8 border-white/10 hover:bg-white hover:text-black transition-all">
                        Return to Ledger
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-12 w-12 bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">{order.orderNumber}</h1>
                            <Badge variant="outline" className={cn("text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-0.5 rounded-full border shadow-none", getStatusColor(order.status))}>
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                            <Calendar className="w-3 h-3" />
                            Acquired {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt))}
                        </div>
                    </div>
                </div>

                {order.status.toLowerCase() === "shipped" && (
                    <Button
                        onClick={() => confirmMutation.mutate(orderId)}
                        disabled={confirmMutation.isPending}
                        className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/20 group animate-pulse"
                    >
                        {confirmMutation.isPending ? <Loader2 className="animate-spin mr-3 h-5 w-5" /> : <CheckCircle2 className="mr-3 h-5 w-5" />}
                        Confirm Receipt
                    </Button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Items Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <Package className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight italic font-serif">Acquired Treasures</h2>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item: any, i: number) => (
                                <Card key={i} className="p-6 bg-zinc-900/40 border-white/5 backdrop-blur-xl group hover:border-white/10 transition-all duration-500">
                                    <div className="flex gap-8">
                                        <div className="h-24 w-24 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden flex-shrink-0 relative">
                                            {item.image ? (
                                                <img src={item.image} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="h-8 w-8 text-zinc-700" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="text-lg font-bold text-white tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Unit: ${item.price.toLocaleString()} • Qty: {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Badge className="bg-white/5 border-white/10 text-[8px] uppercase tracking-widest text-zinc-400">Merchant SKU: {item.productId.slice(-8)}</Badge>
                                                <p className="text-xl font-bold text-white tabular-nums">${item.subtotal.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Timeline / Progress */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight italic font-serif">Order Chronicle</h2>
                        </div>
                        <div className="bg-zinc-900/20 border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />

                            <div className="space-y-10 relative z-10">
                                {/* Status Steps */}
                                {[
                                    { label: "Acquisition Requested", date: order.createdAt, active: true },
                                    { label: "Authorized & Funded", date: order.updatedAt, active: ["paid", "shipped", "delivered"].includes(order.status.toLowerCase()) },
                                    { label: "Dispatched from Artisan", date: order.updatedAt, active: ["shipped", "delivered"].includes(order.status.toLowerCase()), tracking: order.trackingNumber },
                                    { label: "Treasure Delivered", date: order.updatedAt, active: order.status.toLowerCase() === "delivered" }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex flex-col items-center px-1">
                                            <div className={cn(
                                                "h-4 w-4 rounded-full border-4 border-zinc-950 transition-all duration-500 shrink-0",
                                                step.active ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-125" : "bg-zinc-800"
                                            )} />
                                            {i < 3 && <div className={cn("w-0.5 h-12 transition-colors duration-1000", step.active ? "bg-primary/40" : "bg-zinc-800")} />}
                                        </div>
                                        <div className="space-y-1 pb-4">
                                            <p className={cn(
                                                "text-sm font-bold uppercase tracking-widest transition-colors duration-500",
                                                step.active ? "text-white" : "text-zinc-600"
                                            )}>{step.label}</p>
                                            {step.active && (
                                                <p className="text-[10px] text-zinc-500 font-medium">
                                                    {new Date(step.date).toLocaleString()}
                                                </p>
                                            )}
                                            {step.tracking && i === 2 && (
                                                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group/track">
                                                    <div>
                                                        <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Vault Tracking Reference</p>
                                                        <p className="text-sm font-bold text-primary tabular-nums tracking-widest uppercase">{step.tracking}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 group-hover/track:text-white transition-colors">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Financial Summary */}
                    <Card className="p-8 bg-white/5 border-white/5 backdrop-blur-2xl rounded-[2.5rem] space-y-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="flex items-center gap-3 relative z-10">
                            <Receipt className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold text-white tracking-tight italic font-serif">Fiscal Summary</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Artifact Subtotal</span>
                                <span className="text-zinc-200 font-bold tabular-nums">${order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Merchant Shipping</span>
                                <span className="text-zinc-200 font-bold tabular-nums">${order.shippingFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Acquisition Tax</span>
                                <span className="text-zinc-200 font-bold tabular-nums">${order.tax.toLocaleString()}</span>
                            </div>
                            <Separator className="bg-white/5 my-6" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Total Value</span>
                                <span className="text-4xl font-bold text-white tracking-tighter tabular-nums">${order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Logistics Card */}
                    <Card className="p-8 bg-zinc-900 border-white/5 rounded-[2.5rem] space-y-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-primary" />
                                    Transit Destination
                                </p>
                                <p className="text-zinc-300 font-medium italic leading-relaxed text-sm">
                                    {order.shippingAddress}
                                </p>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard className="h-3 w-3 text-primary" />
                                    Acquisition Funding
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">{order.paymentMethod}</span>
                                    <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase tracking-widest font-bold px-2">Securely {order.paymentStatus}</Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Customer Protection */}
                    <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Acquirer Protection</p>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-medium italic">
                            Your acquisition is protected by Vendora Artisan Security. If the treasure arrives compromised, you are eligible for total restitution.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
