export interface Category {
    id: string;
    name: string;
    description?: string;
    slug: string;
    parentId?: string;
    icon?: string;
    image?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCategoryInput {
    name: string;
    description?: string;
    slug?: string;
    parentId?: string;
    icon?: string;
    image?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
    isActive?: boolean;
}
