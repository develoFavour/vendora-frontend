import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletAPI } from "@/lib/api";
import { toast } from "sonner";

export function useWalletOverview() {
    return useQuery({
        queryKey: ["wallet-overview"],
        queryFn: walletAPI.getOverview,
    });
}

export function useRequestPayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: walletAPI.requestPayout,
        onSuccess: () => {
            toast.success("Withdrawal successful. Invoice and email sent.");
            queryClient.invalidateQueries({ queryKey: ["wallet-overview"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to submit payout request.";
            toast.error(message);
        },
    });
}
