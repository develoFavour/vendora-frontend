import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistAPI } from "@/lib/api";
import { toast } from "sonner";

export const useWishlist = () => {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: wishlistAPI.get,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });
};

export const useAddToWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: wishlistAPI.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success("Added to wishlist");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to add to wishlist");
        },
    });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: wishlistAPI.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
            toast.success("Removed from wishlist");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to remove from wishlist");
        },
    });
};
