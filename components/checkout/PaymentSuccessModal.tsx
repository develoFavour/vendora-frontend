"use client";

import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import Link from "next/link";

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
    useEffect(() => {
        if (isOpen) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

            const randomInRange = (min: number, max: number) => {
                return Math.random() * (max - min) + min;
            };

            const interval: any = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div className="relative p-10 space-y-8">
                    {/* Luxury Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -ml-16 -mb-16" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                            className="h-24 w-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
                        >
                            <CheckCircle2 className="h-12 w-12" />
                        </motion.div>

                        <div className="space-y-3">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold mx-auto w-fit block">
                                Acquisition Complete
                            </Badge>
                            <DialogTitle className="text-4xl font-serif font-bold text-white tracking-tight">
                                Treasures <span className="italic text-primary">Secured.</span>
                            </DialogTitle>
                            <p className="text-zinc-500 text-sm max-w-[300px] mx-auto leading-relaxed">
                                Your payment has been successfully authorized through our secure artisan vault.
                            </p>
                        </div>

                        <div className="w-full space-y-3 pt-4">
                            <Button
                                className="w-full h-14 text-sm font-bold rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all group"
                                asChild
                            >
                                <Link href="/buyer/dashboard/marketplace">
                                    Continue Exploration
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="w-full h-14 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest"
                            >
                                View Collection Ledger
                            </Button>
                        </div>
                    </div>

                    <div className="relative z-10 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 flex gap-4 items-start italic">
                        <ShieldCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-500/80 leading-relaxed font-medium">
                            Your order is protected by our Artisan Guarantee. Our logistics partners will initiate priority transit within 24 hours.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Inline badge component since it's used here and might not be imported correctly
function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
    return (
        <span className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
        )}>
            {children}
        </span>
    );
}

// Simple cn utility if needed
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
