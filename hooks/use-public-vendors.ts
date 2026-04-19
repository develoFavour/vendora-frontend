import { useQuery } from "@tanstack/react-query";
import { publicVendorAPI } from "@/lib/api";

export const usePublicVendors = (params?: { page?: number; limit?: number; search?: string; category?: string }) => {
    return useQuery({
        queryKey: ["publicVendors", params],
        queryFn: () => publicVendorAPI.list(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const usePublicVendorById = (id: string) => {
    return useQuery({
        queryKey: ["publicVendor", id],
        queryFn: () => publicVendorAPI.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};
