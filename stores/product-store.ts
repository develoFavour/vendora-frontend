import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ProductStatus = "draft" | "active" | "archived";

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
}

export interface ProductSEO {
    title: string;
    description: string;
    slug: string;
}

export interface VariantOption {
    name: string;   // e.g., "Color"
    values: string[]; // e.g., ["Red", "Blue"]
}

export interface Variant {
    id: string;
    sku: string;
    price: string;
    stock: string;
    options: Record<string, string>; // e.g., {"Color": "Red", "Size": "M"}
}

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    salePrice: string;
    costPrice: string;
    taxRate: string;
    stock: string;
    lowStockThreshold: string;
    sku: string;
    barcode: string;
    allowBackorder: boolean;
    categoryId: string;
    tags: string[];
    brand: string;
    images: string[];
    videoUrl: string;
    isDigital: boolean;
    dimensions: ProductDimensions;
    status: ProductStatus;
    seo: ProductSEO;
    hasVariants: boolean;
    variantOptions: VariantOption[];
    variants: Variant[];
}

interface ProductStore {
    data: ProductFormData;
    updateData: (updates: Partial<ProductFormData>) => void;
    updateDimension: (key: keyof ProductDimensions, value: number) => void;
    updateSEO: (key: keyof ProductSEO, value: string) => void;
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    addImage: (url: string) => void;
    removeImage: (index: number) => void;
    addVariantOption: () => void;
    updateVariantOption: (index: number, name: string, values: string[]) => void;
    removeVariantOption: (index: number) => void;
    updateVariant: (index: number, updates: Partial<Variant>) => void;
    generateSlug: (name: string) => void;
    setData: (data: ProductFormData) => void;
    reset: () => void;
}

const defaultData: ProductFormData = {
    name: "",
    description: "",
    price: "",
    salePrice: "",
    costPrice: "",
    taxRate: "",
    stock: "",
    lowStockThreshold: "5",
    sku: "",
    barcode: "",
    allowBackorder: false,
    categoryId: "",
    tags: [],
    brand: "",
    images: [],
    videoUrl: "",
    isDigital: false,
    dimensions: { length: 0, width: 0, height: 0, weight: 0 },
    status: "draft",
    seo: { title: "", description: "", slug: "" },
    hasVariants: false,
    variantOptions: [],
    variants: [],
};

export const useProductStore = create<ProductStore>()(
    devtools(
        (set, get) => ({
            data: defaultData,

            updateData: (updates) =>
                set((state) => ({
                    data: { ...state.data, ...updates },
                })),

            updateDimension: (key, value) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        dimensions: { ...state.data.dimensions, [key]: value },
                    },
                })),

            updateSEO: (key, value) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        seo: { ...state.data.seo, [key]: value },
                    },
                })),

            addTag: (tag) => {
                const { data } = get();
                if (tag && !data.tags.includes(tag)) {
                    set((state) => ({
                        data: { ...state.data, tags: [...state.data.tags, tag] },
                    }));
                }
            },

            removeTag: (tagToRemove) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        tags: state.data.tags.filter((tag) => tag !== tagToRemove),
                    },
                })),

            addImage: (url) =>
                set((state) => ({
                    data: { ...state.data, images: [...state.data.images, url] },
                })),

            removeImage: (index) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        images: state.data.images.filter((_, i) => i !== index),
                    },
                })),

            addVariantOption: () => set((state) => ({
                data: {
                    ...state.data,
                    variantOptions: [...state.data.variantOptions, { name: "", values: [] }]
                }
            })),

            updateVariantOption: (index, name, values) => {
                const { data } = get();
                const newOptions = [...data.variantOptions];
                newOptions[index] = { name, values };

                // Auto-generate variants based on combinations
                const newVariants = generateVariants(newOptions, data.price, data.stock);

                set((state) => ({
                    data: {
                        ...state.data,
                        variantOptions: newOptions,
                        variants: newVariants
                    }
                }));
            },

            removeVariantOption: (index) => {
                const { data } = get();
                const newOptions = data.variantOptions.filter((_, i) => i !== index);
                const newVariants = generateVariants(newOptions, data.price, data.stock);

                set((state) => ({
                    data: {
                        ...state.data,
                        variantOptions: newOptions,
                        variants: newVariants
                    }
                }));
            },

            updateVariant: (index, updates) => {
                const { data } = get();
                const newVariants = [...data.variants];
                newVariants[index] = { ...newVariants[index], ...updates };
                set((state) => ({
                    data: { ...state.data, variants: newVariants }
                }));
            },

            generateSlug: (name) => {
                const slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                const { data } = get();
                const updates: Partial<ProductFormData> & { seo: ProductSEO } = {
                    seo: { ...data.seo, slug },
                };

                if (!data.seo.title) updates.seo.title = name;
                if (!data.seo.description)
                    updates.seo.description = data.description.slice(0, 160);

                set((state) => ({
                    data: { ...state.data, seo: { ...state.data.seo, ...updates.seo } },
                }));
            },

            setData: (data) => set({ data }),

            reset: () => set({ data: defaultData }),
        }),
        { name: "ProductStore" }
    )
);

/**
 * Helper to generate all combinations of variants from options
 */
function generateVariants(options: VariantOption[], defaultPrice: string, defaultStock: string): Variant[] {
    if (options.length === 0) return [];

    // Filter out options without names or values
    const validOptions = options.filter(opt => opt.name && opt.values.length > 0);
    if (validOptions.length === 0) return [];

    const combinations: Record<string, string>[] = [{}];

    validOptions.forEach(option => {
        const currentCombinations = [...combinations];
        combinations.length = 0;

        option.values.forEach(value => {
            currentCombinations.forEach(prevCombo => {
                combinations.push({
                    ...prevCombo,
                    [option.name]: value
                });
            });
        });
    });

    return combinations.map((combo, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        sku: "",
        price: defaultPrice || "0",
        stock: defaultStock || "0",
        options: combo
    }));
}
