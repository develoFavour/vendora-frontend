"use client";

import React, { useState } from "react";
import { useVendorReviews, useRespondToReview } from "@/hooks/use-reviews";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Star,
    MessageSquare,
    User,
    Clock,
    Loader2,
    Send,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VendorReviewsPage() {
    const { data: reviewsRes, isLoading } = useVendorReviews();
    const reviews = reviewsRes?.data?.reviews || [];
    const respondMutation = useRespondToReview();

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [response, setResponse] = useState("");

    const handleRespond = (id: string) => {
        if (!response) return;
        respondMutation.mutate({ id, response }, {
            onSuccess: () => {
                setReplyingTo(null);
                setResponse("");
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-primary">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Reputation Management</p>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Artisan <span className="italic font-serif text-primary">Testimonies.</span></h1>
                <p className="text-zinc-500 font-medium italic">Listen to your acquirers and foster a premium connection.</p>
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <Card className="p-12 text-center border-dashed border-2 text-zinc-400 font-serif italic">
                        No testimonies have been recorded for your store yet...
                    </Card>
                ) : (
                    reviews.map((rev: any) => (
                        <Card key={rev.id} className="p-8 border-border bg-card shadow-sm hover:shadow-md transition-all rounded-[2rem] space-y-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200">
                                        {rev.userImage ? (
                                            <img src={rev.userImage} className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <User className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-zinc-900">{rev.userName}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                            <Clock className="h-3 w-3" />
                                            {new Date(rev.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex gap-1 text-primary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("h-4 w-4", i < rev.rating ? "fill-current" : "text-zinc-200")} />
                                        ))}
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-zinc-100 bg-zinc-50 text-zinc-400">
                                        Order #{rev.orderId?.slice(-8)}
                                    </Badge>
                                </div>
                            </div>

                            <p className="text-zinc-600 italic font-serif leading-relaxed text-lg">"{rev.comment}"</p>

                            {rev.response ? (
                                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 relative group animate-in zoom-in-95">
                                    <div className="absolute top-0 right-6 -translate-y-1/2 p-2 bg-white border border-emerald-100 rounded-full text-emerald-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Your Official Response</p>
                                        <p className="text-zinc-700 font-medium italic">"{rev.response}"</p>
                                    </div>
                                </div>
                            ) : replyingTo === rev.id ? (
                                <div className="space-y-4 animate-in slide-in-from-top-2">
                                    <Textarea
                                        placeholder="Craft a professional response to this testimony..."
                                        className="bg-zinc-50 border-border rounded-2xl min-h-[100px] focus:ring-primary/20 text-sm font-medium"
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="ghost" className="rounded-xl text-zinc-400 text-[10px] font-bold uppercase tracking-widest" onClick={() => setReplyingTo(null)}>Cancel</Button>
                                        <Button
                                            className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest px-6"
                                            onClick={() => handleRespond(rev.id)}
                                            disabled={!response || respondMutation.isPending}
                                        >
                                            {respondMutation.isPending ? <Loader2 className="animate-spin h-3 w-3" /> : <Send className="mr-2 h-3 w-3" />}
                                            Post Response
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                                    onClick={() => setReplyingTo(rev.id)}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Respond to Testimony
                                </Button>
                            )}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
