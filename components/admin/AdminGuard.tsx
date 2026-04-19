"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2, Shield } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && (!isAuthenticated || user?.role !== "admin")) {
            router.replace("/admin/login");
        }
    }, [user, isAuthenticated, mounted, router]);

    // While the store is hydrating from localStorage, show a branded loader
    if (!mounted) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-500 mx-auto" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">
                        Verifying clearance...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== "admin") {
        return null;
    }

    return <>{children}</>;
}
