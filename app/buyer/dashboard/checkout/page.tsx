"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    ChevronLeft,
    CreditCard,
    Truck,
    ShieldCheck,
    ArrowRight,
    MapPin,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { usePlaceOrder } from "@/hooks/use-orders";

export default function CheckoutPage() {
    const { data: cartData, isLoading: isCartLoading } = useCart();
    const placeOrder = usePlaceOrder();

    // Form State
    const [shippingAddress, setShippingAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");

    const cartItems = useMemo(() => cartData?.data?.cart?.items || [], [cartData]);

    const subtotal = useMemo(() => {
        return cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    }, [cartItems]);

    const shippingFee = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.05;
    const total = subtotal + shippingFee + tax;

    const handlePlaceOrder = () => {
        if (!shippingAddress) {
            return;
        }
        placeOrder.mutate({
            shippingAddress,
            paymentMethod,
        });
    };

    if (isCartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (cartItems.length === 0 && !placeOrder.isSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl text-white">Your cart is empty</h1>
                <Link href="/buyer/dashboard/marketplace">
                    <Button variant="outline">Return to Marketplace</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto space-y-12">
            <header className="flex items-center gap-4">
                <Button variant="ghost" asChild className="rounded-full h-12 w-12 p-0 text-zinc-400 hover:text-white hover:bg-white/5">
                    <Link href="/buyer/dashboard/cart">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white">Checkout</h1>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mt-1">Finalize your acquisition</p>
                </div>
            </header>

            <div className="grid lg:grid-cols-2 gap-16">
                {/* Contact and Shipping */}
                <div className="space-y-12">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <Truck className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Delivery Details</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Shipping Address</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                    <textarea
                                        placeholder="Enter your full destination address..."
                                        className="w-full h-32 rounded-2xl border-white/5 bg-zinc-900/50 p-4 pl-12 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none shadow-inner"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Payment Selection</h2>
                        </div>

                        <div className="grid gap-4">
                            {[
                                { id: "Credit Card", name: "Credit/Debit Card", desc: "Instant clearance via Secure Pay" },
                                { id: "Bank Transfer", name: "Safe Vault Transfer", desc: "For high-value acquisitions" }
                            ].map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setPaymentMethod(method.id)}
                                    className={cn(
                                        "flex items-center justify-between p-6 rounded-2xl border transition-all text-left group",
                                        paymentMethod === method.id
                                            ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.05)]"
                                            : "bg-zinc-900/30 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="space-y-1">
                                        <p className={cn("font-bold", paymentMethod === method.id ? "text-primary" : "text-zinc-200")}>
                                            {method.name}
                                        </p>
                                        <p className="text-xs text-zinc-500 font-medium">{method.desc}</p>
                                    </div>
                                    <div className={cn(
                                        "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                                        paymentMethod === method.id ? "border-primary bg-primary" : "border-zinc-700 bg-transparent"
                                    )}>
                                        {paymentMethod === method.id && <div className="h-2 w-2 rounded-full bg-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4 items-start italic">
                        <ShieldCheck className="h-6 w-6 text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-500/80 leading-relaxed font-medium">
                            Your acquisition is protected by Vendora&apos;s Artisan Guarantee. Any discrepancies in quality or logistics are fully covered for 30 days.
                        </p>
                    </div>
                </div>

                {/* Summary Panel */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <Card className="rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                        <h2 className="text-2xl font-serif font-bold text-white mb-8 relative z-10">Acquisition Summary</h2>

                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar relative z-10">
                            {cartItems.map((item: any) => (
                                <div key={item.productId} className="flex gap-4 items-center">
                                    <div className="h-16 w-16 rounded-xl bg-zinc-900 border border-white/5 flex-shrink-0 overflow-hidden">
                                        <img src={item.image || "/placeholder-product.png"} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-200 truncate">{item.name}</p>
                                        <p className="text-xs text-zinc-500 font-medium">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-white">${(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-white/5 mb-8 relative z-10" />

                        <div className="space-y-4 mb-10 relative z-10">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Subtotal</span>
                                <span className="text-zinc-300 font-bold">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Priority Logistics</span>
                                <span className="text-zinc-300 font-bold">{shippingFee === 0 ? "Complimentary" : `$${shippingFee}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Standard Duties (5%)</span>
                                <span className="text-zinc-300 font-bold">${tax.toLocaleString()}</span>
                            </div>
                            <Separator className="bg-white/5 my-4" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-bold text-white uppercase tracking-wider">Total</span>
                                <span className="text-4xl font-bold text-white tracking-tighter">${total.toLocaleString()}</span>
                            </div>
                        </div>

                        <Button
                            className="w-full h-18 text-xl font-bold rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-2xl relative z-10 group"
                            onClick={handlePlaceOrder}
                            disabled={!shippingAddress || placeOrder.isPending}
                        >
                            {placeOrder.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Authorize Payment
                                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>

                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                                Secure End-to-End Encryption Enabled
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
