"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, ImagePlus, X } from "lucide-react";
import { useCreateReview } from "@/hooks/use-reviews";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    orderId: string;
    productName: string;
}

export function ReviewModal({ isOpen, onClose, productId, orderId, productName }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const createReview = useCreateReview();

    const handleSubmit = () => {
        if (rating === 0) return;
        createReview.mutate({
            productId,
            orderId,
            rating,
            comment,
            images: [] // Image upload logic can be added later
        }, {
            onSuccess: () => {
                onClose();
                setRating(0);
                setComment("");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-white/10 text-white rounded-[2rem] p-8">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-3xl font-bold tracking-tighter text-white">
                        Review the <span className="text-primary italic font-serif">Artifact.</span>
                    </DialogTitle>
                    <p className="text-zinc-500 text-sm">How was your acquisition of <span className="text-zinc-300 font-bold">{productName}</span>?</p>
                </DialogHeader>

                <div className="py-8 space-y-8">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="transition-all duration-300 hover:scale-125 focus:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    <Star
                                        className={cn(
                                            "h-10 w-10 transition-colors",
                                            (hover || rating) >= star
                                                ? "fill-primary text-primary"
                                                : "text-zinc-800"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                            {rating === 5 ? "Exquisite" :
                                rating === 4 ? "Premium" :
                                    rating === 3 ? "Admirable" :
                                        rating === 2 ? "Subpar" :
                                            rating === 1 ? "Disappointing" : "Select a Rating"}
                        </p>
                    </div>

                    {/* Comment Field */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Your Testimony</label>
                        <Textarea
                            placeholder="Share your experience with this artisan creation..."
                            className="bg-zinc-900/50 border-white/5 rounded-2xl min-h-[120px] focus:ring-primary/20 text-sm"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 rounded-xl text-zinc-500 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={rating === 0 || !comment || createReview.isPending}
                        className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest"
                    >
                        {createReview.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Submit Review"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
