import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryAPI } from "@/lib/api";
import { toast } from "sonner";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export const useAdminCategories = (params?: { isActive?: boolean; parentId?: string; topLevel?: boolean }) => {
    return useQuery({
        queryKey: ["adminCategories", params],
        queryFn: () => categoryAPI.list(params),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCategoryInput) => categoryAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            queryClient.invalidateQueries({ queryKey: ["publicCategories"] });
            toast.success("Category created successfully");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create category");
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) => categoryAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            queryClient.invalidateQueries({ queryKey: ["publicCategories"] });
            toast.success("Category updated successfully");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to update category");
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => categoryAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
            queryClient.invalidateQueries({ queryKey: ["publicCategories"] });
            toast.success("Category deleted");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to delete category");
        },
    });
};

