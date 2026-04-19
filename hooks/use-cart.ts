import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export const useCart = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: ["cart"],
        queryFn: cartAPI.get,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        enabled: isAuthenticated,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartAPI.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Added to cart");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to add to cart");
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartAPI.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Removed from cart");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to remove from cart");
        },
    });
};

export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
            cartAPI.updateQuantity(productId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update quantity");
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartAPI.clear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Cart cleared");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to clear cart");
        },
    });
};
