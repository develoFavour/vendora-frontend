import { useQuery } from "@tanstack/react-query";
import { publicProductAPI, publicCategoryAPI } from "@/lib/api";

export interface PublicProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    vendorId: string;
    vendorName?: string;
    vendorLocation?: string;
    rating?: number;
    stock?: number;
    status: string;
    categoryId?: string;
}

export const usePublicProducts = (params?: {
    page?: number;
    query?: string;
    category?: string;
    sort?: string;
}) => {
    return useQuery({
        queryKey: ["publicProducts", params],
        queryFn: () => publicProductAPI.list(params),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const usePublicProductById = (id: string) => {
    return useQuery({
        queryKey: ["publicProduct", id],
        queryFn: () => publicProductAPI.getById(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

export interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
}

export const usePublicCategories = () => {
    return useQuery({
        queryKey: ["publicCategories"],
        queryFn: () => publicCategoryAPI.list(),
        staleTime: 1000 * 60 * 30, // 30 mins
    });
};

export function useSimilarProducts(id: string) {
	return useQuery({
		queryKey: ["public-products", "similar", id],
		queryFn: () => publicProductAPI.similar(id),
		enabled: !!id,
	});
}

export function useProductReviews(id: string) {
	return useQuery({
		queryKey: ["public-products", "reviews", id],
		queryFn: () => publicProductAPI.getProductReviews(id),
		enabled: !!id,
	});
}
