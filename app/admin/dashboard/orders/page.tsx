"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Loader2, Eye, Clock, CreditCard, Truck } from "lucide-react";
import { useAdminOrders } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    shipped: "bg-blue-50 text-blue-600 border-blue-100",
    delivered: "bg-purple-50 text-purple-600 border-purple-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState("all");
    const { data: ordersRes, isLoading } = useAdminOrders(statusFilter === "all" ? undefined : statusFilter);
    const orders = ordersRes?.data?.orders || [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">Financial Operations</p>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">Global Order Log</h1>
                <p className="text-zinc-500 text-sm mt-1">Audit and monitor every transaction flowing through the Vendora network.</p>
            </div>

            {/* Filters */}
            <Card className="p-4 border-border bg-white dark:bg-zinc-900 rounded-2xl shadow-sm flex flex-wrap gap-2">
                {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
                    <Button
                        key={s}
                        variant={statusFilter === s ? "default" : "outline"}
                        onClick={() => setStatusFilter(s)}
                        className="rounded-xl h-10 px-5 text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                        {s}
                    </Button>
                ))}
            </Card>

            {/* Table */}
            <Card className="overflow-hidden border-border bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm">
                {isLoading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>
                ) : orders.length === 0 ? (
                    <div className="p-20 text-center">
                        <ShoppingBag className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-400 font-medium italic">No ledger entries found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    {["Reference ID", "Customer Details", "Financials", "Logistic State", "Timestamp", "Audit"].map((h) => (
                                        <th key={h} className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-widest text-zinc-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {orders.map((o: any) => (
                                    <tr key={o.id || o._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                                                    <CreditCard className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-zinc-900 dark:text-white uppercase tracking-tighter">
                                                        #{o.orderNumber || (o.id || o._id).substring(18)}
                                                    </p>
                                                    <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Global Order ID</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{o.buyerName || "Unknown Buyer"}</p>
                                                <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]">{o.shippingAddress || "Digital fulfillment"}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-white">${(o.total || 0).toLocaleString()}</p>
                                            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">{o.paymentMethod || "Stripe"}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={cn("border-none text-[9px] uppercase tracking-widest font-bold py-1 px-3 rounded-full", STATUS_COLORS[o.status] || STATUS_COLORS.pending)}>
                                                {o.status || "pending"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Clock className="h-3.5 w-3.5 opacity-50" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(o.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-primary hover:bg-primary/5" asChild>
                                                <Link href={`/admin/dashboard/orders/${o.id || o._id}`}>
                                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                    Audit
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
