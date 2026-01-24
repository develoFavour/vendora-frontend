import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsAPI } from "@/lib/api";
import { toast } from "sonner";

export const useProductReviews = (productId: string) => {
    return useQuery({
        queryKey: ["reviews", "product", productId],
        queryFn: () => reviewsAPI.getProductReviews(productId),
        enabled: !!productId,
    });
};

export const useVendorReviews = () => {
    return useQuery({
        queryKey: ["reviews", "vendor"],
        queryFn: reviewsAPI.getVendorReviews,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: reviewsAPI.create,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["reviews", "product", variables.productId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            toast.success("Review submitted! Thank you for your feedback.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to submit review");
        },
    });
};

export const useRespondToReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, response }: { id: string, response: string }) =>
            reviewsAPI.respond(id, response),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", "vendor"] });
            toast.success("Response posted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to post response");
        },
    });
};
