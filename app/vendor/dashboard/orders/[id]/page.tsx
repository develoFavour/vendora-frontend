"use client";

import React from "react";
import {
    ChevronLeft,
    Package,
    Truck,
    CheckCircle2,
    ArrowLeft,
    Clock,
    MapPin,
    CreditCard,
    ShieldCheck,
    Loader2,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useVendorOrder, useUpdateVendorOrderStatus } from "@/hooks/use-vendor-orders";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export default function VendorOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const user = useAuthStore((state) => state.user);

    // UI State
    const [isDispatchModalOpen, setIsDispatchModalOpen] = React.useState(false);
    const [trackingNumber, setTrackingNumber] = React.useState("");

    const { data: orderData, isLoading } = useVendorOrder(orderId);
    const updateStatus = useUpdateVendorOrderStatus();

    const order = orderData?.data?.order;

    // Filter items to only show what belongs to THIS vendor
    const vendorItems = order?.items?.filter((item: any) => item.vendorId === user?.id) || [];

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "text-amber-600 bg-amber-50 border-amber-100";
            case "paid": return "text-blue-600 bg-blue-50 border-blue-100";
            case "confirmed": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "shipped": return "text-purple-600 bg-purple-50 border-purple-100";
            case "delivered": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            default: return "text-zinc-600 bg-zinc-50 border-zinc-100";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold text-zinc-900">Order not found</h1>
                <Link href="/vendor/dashboard/orders">
                    <Button variant="outline">Return to Manifest</Button>
                </Link>
            </div>
        );
    }

    const handleUpdateStatus = (newStatus: string, tNum?: string) => {
        updateStatus.mutate({
            id: orderId,
            status: newStatus,
            trackingNumber: tNum
        }, {
            onSuccess: () => {
                setIsDispatchModalOpen(false);
                setTrackingNumber("");
            }
        });
    };

    return (
        <div className="p-8 space-y-12 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Dispatch Modal */}
            <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
                <DialogContent className="sm:max-w-[450px] bg-white border-border rounded-[2rem] p-0 overflow-hidden shadow-2xl">
                    <div className="p-8 space-y-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                            <Truck className="h-8 w-8" />
                        </div>
                        <div className="text-center space-y-2">
                            <DialogTitle className="text-2xl font-bold text-zinc-900">Dispatch Shipment</DialogTitle>
                            <p className="text-sm text-zinc-500 font-medium">Please provide the tracking credentials for this artisan acquisition.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Tracking Number</label>
                                <Input
                                    placeholder="e.g. VEN-XYZ-12345"
                                    className="h-14 bg-zinc-50 border-border rounded-xl px-4 text-zinc-900 font-medium focus:ring-primary/20"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 italic">
                                <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 leading-relaxed font-medium">Providing valid tracking ensures your funds are released from platform escrow within 24 hours of delivery.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="ghost" className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400" onClick={() => setIsDispatchModalOpen(false)}>Cancel</Button>
                            <Button
                                className="h-12 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800"
                                onClick={() => handleUpdateStatus("shipped", trackingNumber)}
                                disabled={!trackingNumber || updateStatus.isPending}
                            >
                                {updateStatus.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                                Authorize Dispatch
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="rounded-full h-12 w-12 p-0 bg-white border border-border shadow-sm hover:bg-muted" onClick={() => router.back()}>
                        <ChevronLeft className="h-6 w-6 text-zinc-500" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-zinc-900 uppercase tracking-tighter">{order.orderNumber}</h1>
                            <Badge variant="outline" className={cn("uppercase tracking-widest text-[10px] h-6 px-3 border shadow-none", getStatusColor(order.status))}>
                                {order.status}
                            </Badge>
                        </div>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                            Acquired {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt))}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {order.status === "paid" && (
                        <Button
                            className="h-14 px-8 rounded-2xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl group border-none"
                            onClick={() => setIsDispatchModalOpen(true)}
                            disabled={updateStatus.isPending}
                        >
                            <Truck className="mr-3 h-5 w-5" />
                            Dispatch Shipment
                        </Button>
                    )}
                    {order.status === "shipped" && (
                        <Button
                            className="h-14 px-8 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl group border-none"
                            onClick={() => handleUpdateStatus("delivered")}
                            disabled={updateStatus.isPending}
                        >
                            <CheckCircle2 className="mr-3 h-5 w-5" />
                            Confirm Final Delivery
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Main Manifest (Items) */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <Package className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Acquired Artifacts</h2>
                        </div>

                        <div className="space-y-4">
                            {vendorItems.map((item: any, i: number) => (
                                <Card key={i} className="p-6 bg-card border-border shadow-sm group hover:shadow-md transition-all">
                                    <div className="flex gap-6">
                                        <div className="h-28 w-28 rounded-2xl bg-zinc-100 border border-border overflow-hidden flex-shrink-0">
                                            <img src={item.image || "/placeholder-product.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">{item.name}</h3>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">ID: {item.productId.slice(-8)}</p>
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <div className="flex gap-10">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Quantity</p>
                                                        <p className="text-zinc-900 font-bold tabular-nums">{item.quantity} Units</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Unit Price</p>
                                                        <p className="text-zinc-900 font-bold tabular-nums">${item.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-xl font-bold text-zinc-900 tabular-nums">${(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Timeline</h2>
                        </div>
                        <div className="bg-zinc-50 border border-border p-8 rounded-[2rem] space-y-8">
                            <div className="relative pl-8 border-l-2 border-primary">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-zinc-50" />
                                <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Order Established</p>
                                <p className="text-[10px] text-zinc-400 uppercase font-medium mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            {order.paymentStatus === "paid" && (
                                <div className="relative pl-8 border-l-2 border-emerald-500">
                                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-4 border-zinc-50" />
                                    <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Authorized & Safe Vault Payment Collected</p>
                                    <p className="text-[10px] text-zinc-400 uppercase font-medium mt-1">Clearance Successful</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar (Buyer & Transit) */}
                <div className="space-y-8">
                    <Card className="bg-white border-border rounded-[2.5rem] p-8 space-y-8 shadow-xl shadow-zinc-200/50 relative overflow-hidden">
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Acquisition Transit</p>
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                                    <p className="text-zinc-700 font-medium leading-relaxed italic">
                                        {order.shippingAddress}
                                    </p>
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Merchant Cut</span>
                                    <span className="text-zinc-900 font-bold tabular-nums">${(order.total * 0.9).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Logistics Fee</span>
                                    <span className="text-zinc-900 font-bold tabular-nums">${order.shippingFee.toLocaleString()}</span>
                                </div>
                                <Separator className="bg-border my-4" />
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Total Value</span>
                                    <span className="text-3xl font-bold text-zinc-900 tracking-tighter tabular-nums">${order.total?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-zinc-50 border border-border font-serif italic text-xs text-zinc-500 relative z-10 leading-relaxed shadow-inner">
                            "Ensure the artifact is encased in triple-ply artisan security wrap before dispatching. Handle with care."
                        </div>
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-amber-50 border border-amber-100 space-y-4">
                        <div className="flex items-center gap-3 text-amber-600">
                            <ShieldCheck className="h-6 w-6" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Merchant Compliance</p>
                        </div>
                        <p className="text-[10px] text-amber-700/80 leading-relaxed font-medium italic">
                            Dispatches must be initiated within 48 hours of authorizing funds to maintain Artisan Premier status.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
