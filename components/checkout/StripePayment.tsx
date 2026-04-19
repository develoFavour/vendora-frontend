"use client";

import React, { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CheckoutForm({ clientSecret, orderId }: { clientSecret: string, orderId: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return to orders page where we can force verify even if webhook is slow/blocked
                return_url: `${window.location.origin}/buyer/dashboard/orders?payment_intent_id=success&orderId=${orderId}`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            toast.error(error.message);
        } else {
            toast.error("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                <PaymentElement
                    id="payment-element"
                    options={{
                        layout: "tabs",
                    }}
                />
            </div>

            <Button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full h-18 text-xl font-bold rounded-2xl bg-white text-black hover:bg-zinc-200 shadow-2xl relative z-10 group"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    <>
                        Complete Acquisition
                        <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </Button>
        </form>
    );
}
