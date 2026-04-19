import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

const adminAPI = {
    getStats: async () => {
        const res = await api.get("/api/v1/admin/stats");
        return res.data;
    },
    getVendors: async (status?: string) => {
        const res = await api.get("/api/v1/admin/vendors", { params: { status } });
        return res.data;
    },
    getVendor: async (id: string) => {
        const res = await api.get(`/api/v1/admin/vendors/${id}`);
        return res.data;
    },
    getTierRequests: async (status?: string) => {
        const res = await api.get("/api/v1/admin/tier-requests", { params: { status } });
        return res.data;
    },
    getProducts: async (params?: { status?: string; search?: string }) => {
        const res = await api.get("/api/v1/admin/products", { params });
        return res.data;
    },
    getProduct: async (id: string) => {
        const res = await api.get(`/api/v1/admin/products/${id}`);
        return res.data;
    },
    flagProduct: async (id: string) => {
        const res = await api.put(`/api/v1/admin/products/${id}/flag`);
        return res.data;
    },
    approveProduct: async (id: string) => {
        const res = await api.put(`/api/v1/admin/products/${id}/approve`);
        return res.data;
    },
    getCustomers: async (params?: { search?: string }) => {
        const res = await api.get("/api/v1/admin/customers", { params });
        return res.data;
    },
    getOrders: async (status?: string) => {
        const res = await api.get("/api/v1/admin/orders", { params: { status } });
        return res.data;
    },
    getOrder: async (id: string) => {
        const res = await api.get(`/api/v1/admin/orders/${id}`);
        return res.data;
    },
    approveTierRequest: async (id: string) => {
        const res = await api.put(`/api/v1/admin/tier-requests/${id}/approve`);
        return res.data;
    },
    rejectTierRequest: async ({ id, reason }: { id: string; reason: string }) => {
        const res = await api.put(`/api/v1/admin/tier-requests/${id}/reject`, { reason });
        return res.data;
    },
    unsuspendVendor: async (id: string) => {
        const res = await api.put(`/api/v1/admin/vendors/${id}/unsuspend`);
        return res.data;
    },
    banVendor: async (id: string) => {
        const res = await api.put(`/api/v1/admin/vendors/${id}/ban`);
        return res.data;
    },
};

export const useAdminStats = () =>
    useQuery({ queryKey: ["admin-stats"], queryFn: adminAPI.getStats, refetchInterval: 30_000 });

export const useAdminVendors = (status?: string) =>
    useQuery({ queryKey: ["admin-vendors", status], queryFn: () => adminAPI.getVendors(status) });

export const useAdminVendor = (id: string) =>
    useQuery({
        queryKey: ["admin-vendor", id],
        queryFn: () => adminAPI.getVendor(id),
        enabled: !!id,
    });

export const useTierRequests = (status?: string) =>
    useQuery({ queryKey: ["admin-tier-requests", status], queryFn: () => adminAPI.getTierRequests(status) });

export const useAdminProducts = (params?: { status?: string; search?: string }) =>
    useQuery({ queryKey: ["admin-products", params], queryFn: () => adminAPI.getProducts(params) });

export const useAdminProduct = (id: string) =>
    useQuery({
        queryKey: ["admin-product", id],
        queryFn: () => adminAPI.getProduct(id),
        enabled: !!id,
    });

export const useAdminCustomers = (params?: { search?: string }) =>
    useQuery({ queryKey: ["admin-customers", params], queryFn: () => adminAPI.getCustomers(params) });

export const useAdminOrders = (status?: string) =>
    useQuery({ queryKey: ["admin-orders", status], queryFn: () => adminAPI.getOrders(status) });

export const useAdminOrder = (id: string) =>
    useQuery({
        queryKey: ["admin-order", id],
        queryFn: () => adminAPI.getOrder(id),
        enabled: !!id,
    });

export const useApproveTier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.approveTierRequest,
        onSuccess: (_, id) => {
            toast.success("Tier upgrade approved! Vendor has been elevated.");
            qc.invalidateQueries({ queryKey: ["admin-tier-requests"] });
            qc.invalidateQueries({ queryKey: ["admin-vendors"] });
            qc.invalidateQueries({ queryKey: ["admin-stats"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Approval failed"),
    });
};

export const useRejectTier = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.rejectTierRequest,
        onSuccess: () => {
            toast.success("Request rejected and vendor notified.");
            qc.invalidateQueries({ queryKey: ["admin-tier-requests"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Rejection failed"),
    });
};

export const useUnsuspendVendor = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.unsuspendVendor,
        onSuccess: () => {
            toast.success("Vendor account unsuspended successfully.");
            qc.invalidateQueries({ queryKey: ["admin-vendors"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Action failed"),
    });
};

export const useBanVendor = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.banVendor,
        onSuccess: () => {
            toast.success("Vendor account permanently banned.");
            qc.invalidateQueries({ queryKey: ["admin-vendors"] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Action failed"),
    });
};

export const useFlagProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.flagProduct,
        onSuccess: (_, id) => {
            toast.success("Listing flagged. It has been hidden from the public marketplace.");
            qc.invalidateQueries({ queryKey: ["admin-products"] });
            qc.invalidateQueries({ queryKey: ["admin-product", id] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Action failed"),
    });
};

export const useApproveProduct = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: adminAPI.approveProduct,
        onSuccess: (_, id) => {
            toast.success("Listing approved and is visible on the marketplace again.");
            qc.invalidateQueries({ queryKey: ["admin-products"] });
            qc.invalidateQueries({ queryKey: ["admin-product", id] });
        },
        onError: (e: any) => toast.error(e?.response?.data?.message || "Action failed"),
    });
};
