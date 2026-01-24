"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    CreditCard,
    Truck,
    ShieldCheck,
    ArrowRight,
    MapPin,
    Loader2,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useOrder, usePlaceOrder } from "@/hooks/use-orders";
import { useCreatePaymentIntent } from "@/hooks/use-payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "@/components/checkout/StripePayment";

// Use environment variable for publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const orderIdParam = searchParams.get("orderId");

    const { data: cartData, isLoading: isCartLoading } = useCart();
    const { data: existingOrderData, isLoading: isOrderLoading } = useOrder(orderIdParam);
    const placeOrder = usePlaceOrder();
    const createIntent = useCreatePaymentIntent();

    // Stage management
    const [step, setStep] = useState<"delivery" | "payment">("delivery");
    const [orderId, setOrderId] = useState<string | null>(orderIdParam);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [orderSummary, setOrderSummary] = useState<any>(null);

    // Form State
    const [shippingAddress, setShippingAddress] = useState("");

    // Effect to handle incoming orderIdParam
    useEffect(() => {
        if (existingOrderData?.data?.order && !orderSummary) {
            const order = existingOrderData.data.order;
            setOrderSummary(order);
            setOrderId(order.id);
            setStep("payment");

            // Auto-trigger intent if not already created
            if (!clientSecret && !createIntent.isPending) {
                createIntent.mutate(order.id, {
                    onSuccess: (intentRes: any) => {
                        setClientSecret(intentRes.data.clientSecret);
                    }
                });
            }
        }
    }, [existingOrderData, clientSecret]);

    const cartItems = useMemo(() => cartData?.data?.cart?.items || [], [cartData]);

    const activeItems = orderSummary?.items || cartItems;

    const subtotal = useMemo(() => {
        return activeItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    }, [activeItems]);

    const shippingFee = orderSummary?.shippingFee ?? (subtotal > 500 ? 0 : 25);
    const tax = orderSummary?.tax ?? (subtotal * 0.05);
    const total = orderSummary?.total ?? (subtotal + shippingFee + tax);

    const handleProceedToPayment = () => {
        if (!shippingAddress) return;


        placeOrder.mutate({
            shippingAddress,
            paymentMethod: "Stripe",
        }, {
            onSuccess: (res: any) => {
                const newOrder = res.data.order;
                setOrderId(newOrder.id);
                setOrderSummary(newOrder); // Save snapshot for UI

                // Step 2: Create Payment Intent for this Order
                createIntent.mutate(newOrder.id, {
                    onSuccess: (intentRes: any) => {
                        setClientSecret(intentRes.data.clientSecret);
                        setStep("payment");
                    }
                });
            }
        });
    };

    if (isCartLoading || (orderIdParam && isOrderLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (cartItems.length === 0 && step === "delivery") {
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
                <Button
                    variant="ghost"
                    onClick={() => step === "payment" ? setStep("delivery") : null}
                    asChild={step === "delivery"}
                    className="rounded-full h-12 w-12 p-0 text-zinc-400 hover:text-white hover:bg-white/5"
                >
                    {step === "delivery" ? (
                        <Link href="/buyer/dashboard/cart">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                    ) : (
                        <ChevronLeft className="h-6 w-6" />
                    )}
                </Button>
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white">Checkout</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", step === "delivery" ? "text-primary" : "text-zinc-600")}>01 Delivery</span>
                        <div className="h-px w-8 bg-zinc-800" />
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest", step === "payment" ? "text-primary" : "text-zinc-600")}>02 Payment</span>
                    </div>
                </div>
            </header>

            <div className="grid lg:grid-cols-2 gap-20">
                {/* Main Content Area */}
                <div className="space-y-12">
                    <AnimatePresence mode="wait">
                        {step === "delivery" ? (
                            <motion.section
                                key="delivery"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Destination Details</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Shipping Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-4 h-5 w-5 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                                <textarea
                                                    placeholder="Provide the exact coordinates for the master artisan's delivery..."
                                                    className="w-full h-40 rounded-2xl border-white/5 bg-zinc-900/50 p-4 pl-12 text-white placeholder:text-zinc-700 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none shadow-inner"
                                                    value={shippingAddress}
                                                    onChange={(e) => setShippingAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-18 text-xl font-bold rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-2xl relative z-10 group"
                                    onClick={handleProceedToPayment}
                                    disabled={!shippingAddress || placeOrder.isPending || createIntent.isPending}
                                >
                                    {placeOrder.isPending || createIntent.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Initializing Secure Vault...
                                        </>
                                    ) : (
                                        <>
                                            Proceed to Verification
                                            <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                        <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-tight">Encrypted</p>
                                        <p className="text-[10px] text-zinc-600 leading-relaxed uppercase font-bold tracking-widest">
                                            AES-256 Bit Secure Connection
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                                        <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-tight">Insured</p>
                                        <p className="text-[10px] text-zinc-600 leading-relaxed uppercase font-bold tracking-widest">
                                            Full Logistics Coverage
                                        </p>
                                    </div>
                                </div>
                            </motion.section>
                        ) : (
                            <motion.section
                                key="payment"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white">Payment Method</h2>
                                    </div>

                                    {clientSecret && (
                                        <Elements
                                            stripe={stripePromise}
                                            options={{
                                                clientSecret,
                                                appearance: {
                                                    theme: 'night',
                                                    variables: {
                                                        colorPrimary: '#ff3b3b', // Match Vendora red
                                                        colorBackground: '#09090b',
                                                        colorText: '#ffffff',
                                                        colorDanger: '#df1b41',
                                                        fontFamily: 'Inter, system-ui, sans-serif',
                                                        borderRadius: '16px',
                                                    },
                                                }
                                            }}
                                        >
                                            <StripeCheckoutForm clientSecret={clientSecret} orderId={orderId!} />
                                        </Elements>
                                    )}
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* Summary Panel */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <Card className="rounded-[2.5rem] bg-zinc-950 border border-white/10 shadow-2xl p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />

                        <h2 className="text-2xl font-serif font-bold text-white mb-8 relative z-10">Acquisition Summary</h2>

                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar relative z-10">
                            {activeItems.map((item: any) => (
                                <div key={item.productId || item.id} className="flex gap-4 items-center">
                                    <div className="h-16 w-16 rounded-xl bg-zinc-900 border border-white/5 flex-shrink-0 overflow-hidden">
                                        <img src={item.image || "/placeholder-product.png"} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-zinc-200 truncate">{item.name}</p>
                                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-tight">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-white tabular-nums">${(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-white/5 mb-8 relative z-10" />

                        <div className="space-y-4 mb-4 relative z-10">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="text-zinc-300 font-bold tabular-nums">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Logistics</span>
                                <span className="text-zinc-300 font-bold tabular-nums">{shippingFee === 0 ? "Complimentary" : `$${shippingFee}`}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Tax Estimate (5%)</span>
                                <span className="text-zinc-300 font-bold tabular-nums">${tax.toLocaleString()}</span>
                            </div>
                            <Separator className="bg-white/5 my-6" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-bold text-white uppercase tracking-wider">Total</span>
                                <span className="text-4xl font-bold text-white tracking-tighter tabular-nums">${total.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
