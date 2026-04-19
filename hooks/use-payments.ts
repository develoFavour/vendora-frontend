import { useMutation } from "@tanstack/react-query";
import { paymentAPI } from "@/lib/api";
import { toast } from "sonner";

export const useCreatePaymentIntent = () => {
    return useMutation({
        mutationFn: (orderId: string) => paymentAPI.createIntent(orderId),
        onError: (error: any) => {
            toast.error(error.message || "Failed to initialize secure payment.");
        },
    });
};
export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: (orderId: string) => paymentAPI.verify(orderId),
        onError: (error: any) => {
            console.error("Verification error:", error);
        },
    });
};
