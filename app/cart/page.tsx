"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Minus, Store, ShoppingBag, ArrowRight, Lock, LogIn, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useGuestCartStore } from "@/stores/guest-cart-store";
import { useCart, useRemoveFromCart, useUpdateCartQuantity } from "@/hooks/use-cart";
import Image from "next/image";

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    // --- Auth Cart (logged-in users) ---
    const { data: cartData, isLoading: authCartLoading } = useCart();
    const removeFromCart = useRemoveFromCart();
    const updateCartQuantity = useUpdateCartQuantity();
    const authItems: any[] = cartData?.data?.cart?.items || [];

    // --- Guest Cart (unauthenticated visitors) ---
    const { items: guestItems, removeItem, updateQuantity, totalPrice } = useGuestCartStore();

    // Unified list of items to display based on auth state
    const isLoading = isAuthenticated && authCartLoading;
    const items = isAuthenticated ? authItems : guestItems;

    const subtotal = isAuthenticated
        ? authItems.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)
        : totalPrice();

    const estimatedTax = subtotal * 0.08;
    const grandTotal = subtotal + estimatedTax;
    const totalItemCount = items.reduce((s: number, i: any) => s + i.quantity, 0);

    const handleRemove = (productId: string) => {
        if (isAuthenticated) {
            removeFromCart.mutate(productId);
        } else {
            removeItem(productId);
        }
    };

    const handleQuantityChange = (productId: string, qty: number) => {
        if (isAuthenticated) {
            updateCartQuantity.mutate({ productId, quantity: qty });
        } else {
            updateQuantity(productId, qty);
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            // Gate at checkout, not at cart view
            router.push("/login?redirect=/buyer/dashboard/checkout");
        } else {
            router.push("/buyer/dashboard/checkout");
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navigation />

            {/* Header */}
            <section className="border-b border-border bg-muted/30">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                        Shopping Cart
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {totalItemCount} {totalItemCount === 1 ? "item" : "items"} in your bag
                        {!isAuthenticated && (
                            <span className="ml-3 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                Guest Session
                            </span>
                        )}
                    </p>
                </div>
            </section>

            {/* Cart Content */}
            <section className="flex-1 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : items.length === 0 ? (
                        // Empty state
                        <div className="py-24 text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-serif italic text-muted-foreground">
                                Your cart is empty.
                            </h2>
                            <Button asChild variant="outline">
                                <Link href="/marketplace">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Browse Products
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Store className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Your Selection</p>
                                            <p className="text-sm text-muted-foreground">
                                                {totalItemCount} {totalItemCount === 1 ? "piece" : "pieces"}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="ml-auto">
                                            Subtotal: ${subtotal.toFixed(2)}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        {items.map((item: any, idx: number) => (
                                            <div key={item.productId || item.id}>
                                                <div className="flex gap-4">
                                                    {/* Product Image */}
                                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                                        {item.image || item.images?.[0] ? (
                                                            <Image
                                                                height={96}
                                                                width={96}
                                                                src={item.image || item.images?.[0]}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center">
                                                                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div className="flex justify-between">
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="mt-1 text-sm text-muted-foreground">
                                                                    ${Number(item.price).toFixed(2)} each
                                                                </p>
                                                                {item.vendor && (
                                                                    <p className="text-xs text-primary/70 mt-1 font-medium">
                                                                        by {item.vendor}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleRemove(item.productId || item.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center border border-border rounded-md">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.productId || item.id,
                                                                            item.quantity - 1
                                                                        )
                                                                    }
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-10 text-center text-sm font-medium">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item.productId || item.id,
                                                                            item.quantity + 1
                                                                        )
                                                                    }
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <span className="font-semibold">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {idx < items.length - 1 && <Separator className="mt-4" />}
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Button variant="outline" asChild className="w-full bg-transparent">
                                    <Link href="/marketplace">
                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                        Continue Shopping
                                    </Link>
                                </Button>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-24 p-6 space-y-4">
                                    <h2 className="text-xl font-semibold">Order Summary</h2>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium text-primary">Free</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax (estimated)</span>
                                            <span className="font-medium">${estimatedTax.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold">Total</span>
                                        <span className="text-lg font-bold">${grandTotal.toFixed(2)}</span>
                                    </div>

                                    {/* Guest sign-in prompt */}
                                    {!isAuthenticated && (
                                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm space-y-2">
                                            <p className="font-semibold text-primary flex items-center gap-2">
                                                <Lock className="h-4 w-4" />
                                                Sign in to checkout
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                Your {totalItemCount} item{totalItemCount !== 1 ? "s" : ""} will be saved automatically.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        size="lg"
                                        className="w-full"
                                        onClick={handleCheckout}
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                Proceed to Checkout
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        ) : (
                                            <>
                                                <LogIn className="mr-2 h-5 w-5" />
                                                Sign in to Checkout
                                            </>
                                        )}
                                    </Button>

                                    {/* Trust indicators */}
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        <p className="flex items-center gap-2">
                                            <span className="text-primary">✓</span> Secure checkout
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-primary">✓</span> Free shipping on orders over $50
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="text-primary">✓</span> 30-day return policy
                                        </p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
