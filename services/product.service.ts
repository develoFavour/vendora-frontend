import axios from "axios";

// Define the shape of the data we expect from the backend
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    images: string[];
    category: string;
    vendorId: string;
    stock: number;
    slug: string;
    status: string;
    createdAt: string;
}

export interface ProductsResponse {
    status: string;
    message: string;
    data: {
        products: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const productService = {
    async getPublicProducts(page = 1, limit = 12, query = "", category = "") {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (query) params.append("query", query);
        if (category) params.append("category", category);

        const response = await axios.get<ProductsResponse>(`${API_URL}/public/products?${params.toString()}`);
        return response.data;
    },

    async getPublicProductById(id: string) {
        const response = await axios.get(`${API_URL}/public/products/${id}`);
        return response.data;
    }
};
