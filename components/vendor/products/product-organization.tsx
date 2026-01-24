"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { useProductStore, ProductStatus } from "@/stores/product-store";
import { useEffect, useState } from "react";
import { categoryAPI } from "@/lib/api";

export function ProductOrganization() {
    const { data, updateData, addTag, removeTag } = useProductStore();
    const [tagInput, setTagInput] = useState("");
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await categoryAPI.list();
                if (response.success) {
                    setCategories(response.data.categories || []);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(tagInput.trim());
            setTagInput("");
        }
    };

    return (
        <>
            {/* Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="status">Product Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => updateData({ status: v as ProductStatus })}
                            >
                                <SelectTrigger id="status" aria-label="Select status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Organization */}
            <Card>
                <CardHeader>
                    <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={data.categoryId}
                                onValueChange={(v) => updateData({ categoryId: v })}
                                disabled={isLoadingCategories}
                            >
                                <SelectTrigger id="category" aria-label="Select category">
                                    {isLoadingCategories ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        <SelectValue placeholder="Select category" />
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                    {categories.length === 0 && !isLoadingCategories && (
                                        <div className="p-2 text-xs text-muted-foreground text-center">
                                            No categories found
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                placeholder="e.g. Nike"
                                value={data.brand}
                                onChange={(e) => updateData({ brand: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                placeholder="e.g. vintage, cotton, summer"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="px-1 font-normal">
                                        {tag}
                                        <button
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-[0.8rem] text-muted-foreground">
                                Press Enter to add a tag.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
