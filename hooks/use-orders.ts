import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: orderAPI.list,
    });
};

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: orderAPI.place,
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order placed successfully! A merchant will reach out soon.");

            // Redirect to a success page or orders page
            router.push("/buyer/dashboard/orders");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to place order. Please try again.");
        },
    });
};
