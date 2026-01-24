import { useQuery } from "@tanstack/react-query";
import { productService, ProductsResponse } from "@/services/product.service";

export const usePublicProducts = (page: number, limit: number, query: string, category: string) => {
    return useQuery({
        queryKey: ["public-products", page, limit, query, category],
        queryFn: () => productService.getPublicProducts(page, limit, query, category),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        placeholderData: (previousData: ProductsResponse | undefined) => previousData, // Keep showing old data while fetching new data (smooth transition)
    });
};

export const usePublicProductById = (id: string) => {
    return useQuery({
        queryKey: ["public-product", id],
        queryFn: () => productService.getPublicProductById(id),
        enabled: !!id, // Only run if ID is present
    });
};
