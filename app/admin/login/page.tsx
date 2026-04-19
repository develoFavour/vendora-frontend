"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Shield, AlertTriangle, Terminal } from "lucide-react";
import { api, setAuthTokens } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const { setAuth, user } = useAuthStore();

    useEffect(() => {
        setMounted(true);
        // Already logged in as admin — redirect immediately
        if (user?.role === "admin") {
            router.replace("/admin/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/api/v1/auth/login", formData);
            const token: string | undefined = data?.accessToken ?? data?.data?.accessToken;
            const refreshToken: string | undefined = data?.refreshToken ?? data?.data?.refreshToken;
            const user = data?.user ?? data?.data?.user;

            if (!user || user.role !== "admin") {
                setError("Access denied. This portal is restricted to platform administrators.");
                setLoading(false);
                return;
            }

            if (token && user) {
                setAuth(user, token, refreshToken);
                setAuthTokens(token, refreshToken);
            }

            toast.success("Identity verified. Welcome back, Administrator.");
            router.push("/admin/dashboard");
        } catch (err: any) {
            const message = err?.response?.data?.message || "Authentication failed. Check your credentials.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Subtle red glow top-left */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            {/* Subtle glow bottom-right */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl shadow-black/80">

                {/* ── Left branding panel ── */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 border-r border-white/5 relative overflow-hidden">
                    {/* Decorative top strip */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                    <div>
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-16">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg tracking-tight">Vendora</span>
                                <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-primary/70">Control Center</span>
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl font-bold text-white leading-tight mb-6 tracking-tighter">
                            Platform<br />
                            <span className="text-primary italic">Command</span><br />
                            Console.
                        </h1>
                        <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                            Full-spectrum marketplace intelligence. Approve merchants, process tier upgrades, and orchestrate a thriving ecosystem.
                        </p>
                    </div>

                    {/* Status indicators */}
                    <div className="space-y-3">
                        {[
                            { label: "Vendor Applications", value: "Review Queue" },
                            { label: "Tier Upgrade Requests", value: "Approval Panel" },
                            { label: "Payout Orchestration", value: "Treasury Control" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.label}</span>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-600">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right login panel ── */}
                <div className="bg-zinc-950 p-8 lg:p-12 flex flex-col justify-center">
                    {/* Mobile logo */}
                    <div className="flex lg:hidden items-center gap-3 mb-10">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tight">Vendora Admin</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <Terminal className="h-3 w-3 text-primary" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400">Restricted Access</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Administrator<br />
                            <span className="text-zinc-500">Sign In</span>
                        </h2>
                        <p className="text-zinc-600 text-xs font-medium">
                            Authorised personnel only. All access attempts are logged.
                        </p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-400 font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                                Administrator Email
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors duration-200 pointer-events-none" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@vendora.com"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-white/8 rounded-2xl text-white placeholder:text-zinc-700 text-sm font-medium focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                                Passphrase
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors duration-200 pointer-events-none" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-zinc-900 border border-white/8 rounded-2xl text-white placeholder:text-zinc-700 text-sm font-medium focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-4 bg-primary hover:bg-primary/90 disabled:bg-primary/40 text-white font-bold text-[11px] uppercase tracking-[0.25em] rounded-2xl transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/20 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying Identity...
                                </>
                            ) : (
                                <>
                                    <Shield className="h-4 w-4" />
                                    Access Control Panel
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
                            Not an administrator?
                        </p>
                        <Link
                            href="/login"
                            className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 hover:text-primary transition-colors"
                        >
                            Go to Vendora ↗
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
