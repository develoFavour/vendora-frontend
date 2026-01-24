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

export const useOrder = (id: string | null) => {
    return useQuery({
        queryKey: ["orders", id],
        queryFn: () => orderAPI.get(id!),
        enabled: !!id,
    });
};

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: orderAPI.place,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to place order. Please try again.");
        },
    });
};

export const useConfirmReceipt = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: orderAPI.confirmReceipt,
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", id] });
            queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
            queryClient.invalidateQueries({ queryKey: ["vendor-stats"] });
            toast.success("Artifact acquisition confirmed!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to confirm receipt");
        },
    });
};
