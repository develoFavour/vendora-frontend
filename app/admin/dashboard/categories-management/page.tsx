"use client";

import { useState, useMemo } from "react";
import { format, isValid } from "date-fns";


import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Folder,
    ChevronRight,
    MoreHorizontal,
    ArrowLeft,
    FolderTree
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    useAdminCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory
} from "@/hooks/use-categories";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export default function CategoryManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [currentParentId, setCurrentParentId] = useState<string | null>(null);

    // API Hooks
    const { data: categoriesRes, isLoading } = useAdminCategories({
        parentId: currentParentId || undefined,
        topLevel: !currentParentId,
    });
    const { data: allCategoriesRes } = useAdminCategories(); // For parent selection

    const createCategory = useCreateCategory();
    const updateCategory = useUpdateCategory();
    const deleteCategory = useDeleteCategory();

    const categories: Category[] = categoriesRes?.data?.categories || [];
    const allCategories: Category[] = allCategoriesRes?.data?.categories || [];

    const [formData, setFormData] = useState<CreateCategoryInput & { isActive: boolean }>({
        name: "",
        description: "",
        slug: "",
        parentId: "",
        icon: "",
        isActive: true,
    });

    const handleOpenCreate = () => {
        setFormData({
            name: "",
            description: "",
            slug: "",
            parentId: currentParentId || "",
            icon: "",
            isActive: true,
        });
        setIsCreateModalOpen(true);
    };

    const handleOpenEdit = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            slug: category.slug,
            parentId: category.parentId || "",
            icon: category.icon || "",
            isActive: category.isActive ?? true,
        });
        setIsEditModalOpen(true);
    };

    const handleCreate = async () => {
        await createCategory.mutateAsync({
            ...formData,
            parentId: formData.parentId === "none" || !formData.parentId ? undefined : formData.parentId,
        });
        setIsCreateModalOpen(false);
    };

    const handleUpdate = async () => {
        if (!selectedCategory) return;
        const updateData: UpdateCategoryInput = {
            ...formData,
            parentId: formData.parentId === "none" || !formData.parentId ? undefined : formData.parentId,
        };
        await updateCategory.mutateAsync({
            id: selectedCategory.id,
            data: updateData,
        });
        setIsEditModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this category?")) {
            await deleteCategory.mutateAsync(id);
        }
    };

    const filteredCategories = categories.filter((c: Category) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const parentCategoryName = useMemo(() => {
        if (!currentParentId) return null;
        return allCategories.find((c: Category) => c.id === currentParentId)?.name;
    }, [currentParentId, allCategories]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        if (!isValid(date) || date.getFullYear() <= 1) return "Not Set";
        return format(date, "MMM d, yyyy");
    };

    return (
        <div className="p-8 max-w-8xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category Gallery</h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Orchestrate your product hierarchy and taxonomy.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2 rounded-xl h-12 px-6 shadow-lg shadow-primary/10 transition-all hover:scale-105">
                    <Plus className="h-5 w-5" />
                    Add New Category
                </Button>
            </div>

            {/* Navigation Breadcrumbish for Hierarchy */}
            {currentParentId && (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentParentId(null)}
                        className="gap-2 text-zinc-500 hover:text-primary"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Top Level
                    </Button>
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-400">
                        <ChevronRight className="h-4 w-4" />
                        <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-900 px-3 py-1">
                            <Folder className="h-3.5 w-3.5 mr-2 text-primary" />
                            {parentCategoryName}
                        </Badge>
                    </div>
                </div>
            )}

            <Card className="overflow-hidden border-border/40 shadow-xl shadow-zinc-200/50 rounded-3xl bg-white">
                <div className="p-6 border-b border-border/40 bg-zinc-50/30">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                className="pl-10 rounded-xl bg-white border-zinc-200 focus-visible:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-zinc-100 text-black font-bold uppercase tracking-widest text-[10px] py-1">
                                {filteredCategories.length} Categories
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow className="hover:bg-transparent border-border/40">
                                <TableHead className="w-[300px] py-4 pl-8 uppercase text-[10px] font-bold tracking-[0.2em]">Name & Identifier</TableHead>
                                <TableHead className="py-4 uppercase text-[10px] font-bold tracking-[0.2em]">Hierarchy</TableHead>
                                <TableHead className="py-4 uppercase text-[10px] font-bold tracking-[0.2em]">Status</TableHead>
                                <TableHead className="py-4 uppercase text-[10px] font-bold tracking-[0.2em]">Created At</TableHead>
                                <TableHead className="text-right py-4 pr-8 uppercase text-[10px] font-bold tracking-[0.2em]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground animate-pulse">Loading gallery...</TableCell>
                                    </TableRow>
                                ))
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center">
                                                <FolderTree className="h-6 w-6 text-zinc-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 tracking-tight">Gallery is empty</p>
                                                <p className="text-sm text-zinc-500">No categories found in this view.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((category) => (
                                    <TableRow key={category.id} className="group hover:bg-zinc-50/50 transition-colors border-border/40">
                                        <TableCell className="py-4 pl-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                                    {category.icon ? <span className="text-lg">{category.icon}</span> : <Folder className="h-5 w-5 text-primary" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-zinc-900 tracking-tight">{category.name}</div>
                                                    <div className="text-[10px] text-zinc-400 font-mono">/{category.slug}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-2 rounded-lg text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5"
                                                onClick={() => setCurrentParentId(category.id)}
                                            >
                                                Explore Subcategories
                                                <ChevronRight className="h-3.5 w-3.5" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge
                                                className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${category.isActive
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                    : "bg-zinc-100 text-zinc-500 border-zinc-200"
                                                    }`}
                                                variant="outline"
                                            >
                                                {category.isActive ? "Active" : "Archived"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-sm text-zinc-500 font-medium">
                                            {formatDate(category.createdAt)}
                                        </TableCell>
                                        <TableCell className="py-4 pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/40">
                                                    <DropdownMenuLabel className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground p-3">Management</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenEdit(category)} className="p-3 gap-3">
                                                        <Edit2 className="h-4 w-4 text-primary" />
                                                        Edit Specifications
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(category.id)} className="p-3 gap-3 text-destructive focus:bg-destructive/5 focus:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete Asset
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                }
            }}>
                <DialogContent className="max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {isEditModalOpen ? "Edit Specifications" : "Create New Category"}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-sm">
                            Define your category's digital signature and position.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Masterwork Chronographs"
                                className="h-12 rounded-xl border-zinc-200 focus-visible:ring-primary/20"
                                value={formData.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setFormData(p => ({
                                        ...p,
                                        name,
                                        slug: p.slug === "" || p.slug === utils_slugify(p.name) ? utils_slugify(name) : p.slug
                                    }));
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Slug Identifier</Label>
                            <Input
                                id="slug"
                                placeholder="masterwork-chronographs"
                                className="h-12 rounded-xl font-mono text-xs border-zinc-200 focus-visible:ring-primary/20"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Hierarchy</Label>
                                <Select
                                    value={formData.parentId || "none"}
                                    onValueChange={(val) => setFormData({ ...formData, parentId: val === "none" ? "" : val })}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-zinc-200 focus-visible:ring-primary/20">
                                        <SelectValue placeholder="Top Level" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-border/40">
                                        <SelectItem value="none">Top Level (None)</SelectItem>
                                        {allCategories
                                            .filter(c => c.id !== selectedCategory?.id && !c.parentId) // Only allow top-level as parents for simplicity, or all except itself
                                            .map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Icon / Emoji</Label>
                                <Input
                                    id="icon"
                                    placeholder="⌚"
                                    className="h-12 rounded-xl text-center text-xl border-zinc-200 focus-visible:ring-primary/20"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-zinc-500">Curation Description</Label>
                            <Input
                                id="description"
                                placeholder="What characterizes this collection?"
                                className="h-12 rounded-xl border-zinc-200 focus-visible:ring-primary/20"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold tracking-tight">Active Status</Label>
                                <p className="text-xs text-zinc-500">Visible in public marketplace</p>
                            </div>
                            <Switch
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData(p => ({ ...p, isActive: checked }))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => {
                            setIsCreateModalOpen(false);
                            setIsEditModalOpen(false);
                        }} className="rounded-xl h-12 flex-1 sm:flex-none">
                            Cancel
                        </Button>
                        <Button
                            onClick={isEditModalOpen ? handleUpdate : handleCreate}
                            className="rounded-xl h-12 flex-1 sm:flex-none px-8"
                            disabled={createCategory.isPending || updateCategory.isPending}
                        >
                            {createCategory.isPending || updateCategory.isPending ? "Syncing..." : isEditModalOpen ? "Save Changes" : "Forge Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function utils_slugify(name: string) {
    return name.toLowerCase().trim().replace(/ /g, "-").replace(/[^\w-]/g, "");
}
