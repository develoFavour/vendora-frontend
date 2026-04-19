import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tierAPI } from "@/lib/api";
import { toast } from "sonner";

export const useTierStatus = () => {
    return useQuery({
        queryKey: ["tier-status"],
        queryFn: tierAPI.getStatus,
    });
};

export const useRequestUpgrade = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tierAPI.requestUpgrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tier-status"] });
            queryClient.invalidateQueries({ queryKey: ["tier-history"] });
            queryClient.invalidateQueries({ queryKey: ["tier-eligibility"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to submit upgrade request";
            toast.error(message);
        }
    });
};

export const useTierEligibility = () => {
    return useQuery({
        queryKey: ["tier-eligibility"],
        queryFn: tierAPI.getEligibility,
    });
};

export const useTierHistory = () => {
    return useQuery({
        queryKey: ["tier-history"],
        queryFn: tierAPI.getHistory,
    });
};

export const useAppealSuspension = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tierAPI.appealSuspension,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tier-eligibility"] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to submit appeal";
            toast.error(message);
        }
    });
};
