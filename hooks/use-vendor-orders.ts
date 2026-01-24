import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorOrdersAPI } from "@/lib/api";
import { toast } from "sonner";

export const useVendorOrders = () => {
    return useQuery({
        queryKey: ["vendor-orders"],
        queryFn: vendorOrdersAPI.list,
    });
};

export const useVendorStats = () => {
    return useQuery({
        queryKey: ["vendor-stats"],
        queryFn: vendorOrdersAPI.stats,
    });
};

export const useVendorOrder = (id: string | null) => {
    return useQuery({
        queryKey: ["vendor-orders", id],
        queryFn: () => vendorOrdersAPI.get(id!),
        enabled: !!id,
    });
};

export const useUpdateVendorOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status, trackingNumber }: { id: string, status: string, trackingNumber?: string }) =>
            vendorOrdersAPI.updateStatus(id, status, trackingNumber),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["vendor-orders"] });
            queryClient.invalidateQueries({ queryKey: ["vendor-orders", variables.id] });
            toast.success("Order status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update order status");
        },
    });
};
