"use client";

import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/stores/product-store";
import { mediaAPI } from "@/lib/api";
import { toast } from "sonner";
import { useRef, useState } from "react";

export function ProductMedia() {
    const { data, addImage, removeImage, updateData } = useProductStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const file = files[0];

        try {
            const response = await mediaAPI.upload(file);
            if (response.success && response.url) {
                addImage(response.url);
                toast.success("Image uploaded successfully");
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>
                    Upload high-quality images. The first image will be the cover.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <div
                            onClick={!isUploading ? triggerUpload : undefined}
                            className={`aspect-square relative rounded-md border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                            ) : (
                                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                            <span className="text-xs text-muted-foreground mt-2 font-medium">
                                {isUploading ? 'Uploading...' : 'Upload'}
                            </span>
                        </div>

                        {data.images.map((img, index) => (
                            <div key={index} className="aspect-square relative rounded-md border border-border overflow-hidden bg-background group">
                                <img src={img} alt="Product" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3 w-3 text-destructive hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        ))}

                        {/* Placeholders if empty */}
                        {data.images.length === 0 && (
                            <>
                                <div className="aspect-square relative rounded-md border border-border overflow-hidden bg-background">
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                    </div>
                                </div>
                                <div className="aspect-square relative rounded-md border border-border overflow-hidden bg-background">
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            id="video-url"
                            placeholder="Video URL (YouTube/Vimeo)"
                            className="flex-1"
                            value={data.videoUrl}
                            onChange={(e) => updateData({ videoUrl: e.target.value })}
                        />
                        <Button variant="secondary">Add Video</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
