"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ShieldCheck,
    User,
    Building2,
    Lock,
    Smartphone,
    Globe,
    Camera,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Zap,
    BarChart3,
    Package,
    Store,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useWalletOverview } from "@/hooks/use-wallet";
import { useTierEligibility, useTierHistory, useTierStatus } from "@/hooks/use-tier";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/use-user";
import { mediaAPI } from "@/lib/api";
import TierUpgradeModal from "@/components/vendor/TierUpgradeModal";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const TIER_DETAILS = {
    individual: {
        label: "Individual Seller",
        icon: User,
        color: "text-zinc-500",
        bgColor: "rgba(244, 244, 245, 1)", // bg-zinc-100
        limits: {
            products: "50",
            monthlySales: "$5,000",
            fee: "5.0%",
            payoutHold: "7 Days",
        }
    },
    verified: {
        label: "Verified Merchant",
        icon: ShieldCheck,
        color: "text-blue-500",
        bgColor: "rgba(239, 246, 255, 1)", // bg-blue-50
        limits: {
            products: "200",
            monthlySales: "$25,000",
            fee: "3.5%",
            payoutHold: "3 Days",
        }
    },
    business: {
        label: "Enterprise Entity",
        icon: Building2,
        color: "text-primary",
        bgColor: "rgba(255, 241, 242, 1)", // bg-primary/5 (assuming primary is terracotta)
        limits: {
            products: "Unlimited",
            monthlySales: "Unlimited",
            fee: "2.5%",
            payoutHold: "24 Hours",
        }
    }
};

export default function VendorSettingsPage() {
    const { user } = useAuthStore();
    const { data: walletRes } = useWalletOverview();
    const { data: eligibilityRes, isLoading: isTierLoading } = useTierEligibility();
    const { data: historyRes } = useTierHistory();
    const { data: statusRes } = useTierStatus();

    const wallet = walletRes?.data;
    const eligibility = eligibilityRes?.data;

    const currentTier = (wallet?.balance?.tier as keyof typeof TIER_DETAILS) || "individual";
    const tierInfo = TIER_DETAILS[currentTier];

    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();
    const { data: profileRes, isLoading: loadingProfile } = useProfile();
    const serverUser = profileRes?.data?.user || profileRes?.user || profileRes?.data || profileRes;

    const [activeTab, setActiveTab] = useState("general");

    const [storeName, setStoreName] = useState("");
    const [storeBio, setStoreBio] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Security Tab State
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    React.useEffect(() => {
        if (serverUser) {
            setStoreName(serverUser.name || "");
            setStoreBio(serverUser.profile?.bio || serverUser.bio || "");
            setProfilePicture(serverUser.profile?.profileImage || serverUser.profilePicture || "");
        }
    }, [serverUser]);

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                setIsUploading(true);
                const res = await mediaAPI.upload(e.target.files[0]);
                if (res?.url) {
                    setProfilePicture(res.url);
                    toast.success("Image uploaded. Remember to 'Save Changes'.");
                }
            } catch (err) {
                toast.error("Failed to upload image.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSaveProfile = () => {
        updateProfile.mutate({
            name: storeName,
            bio: storeBio,
            profilePicture: profilePicture
        });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        changePassword.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setIsEditingPassword(false);
                }
            }
        );
    };

    const retries = eligibility?.retries || 0;
    const isSuspended = eligibility?.isSuspended;
    const isRejected = statusRes?.data?.request?.status === 'rejected';

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Master Configuration</p>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900">Merchant Settings</h1>
                <p className="text-zinc-500 text-sm font-medium italic">Architect your store identity and oversight protocols.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-1">
                    <TabsList className="bg-transparent gap-8 p-0">
                        {[
                            { id: "general", label: "Profile", icon: Store },
                            { id: "verification", label: "Tiers & KYC", icon: ShieldCheck },
                            { id: "security", label: "Security", icon: Lock },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="bg-transparent border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-0 py-4 text-[11px] font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900 transition-all gap-2"
                            >
                                <tab.icon className="h-3.5 w-3.5" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-zinc-50/50 p-8 border-b border-zinc-100">
                                    <CardTitle className="text-xl">Store Identity</CardTitle>
                                    <CardDescription className="font-serif italic text-xs">Public persona and aesthetic markers.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div 
                                            onClick={handleUploadClick}
                                            className="h-24 w-24 rounded-2xl bg-zinc-100 flex items-center justify-center border-2 border-dashed border-zinc-200 group cursor-pointer hover:bg-zinc-50 transition-all overflow-hidden relative"
                                        >
                                            {isUploading ? (
                                                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                            ) : profilePicture ? (
                                                <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <Camera className="h-8 w-8 text-zinc-300 group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            ref={fileInputRef} 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-zinc-900 leading-tight">Brand Logo</p>
                                            <p className="text-xs text-zinc-500 italic max-w-xs">SVG or PNG preferred. Minimum resolution 512x512px.</p>
                                            <Button 
                                                variant="link" 
                                                onClick={handleUploadClick}
                                                className="p-0 h-auto text-[10px] uppercase font-bold tracking-widest text-primary"
                                            >
                                                Upload New Logo
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Store Name</label>
                                            <input
                                                value={storeName}
                                                onChange={(e) => setStoreName(e.target.value)}
                                                className="w-full h-12 px-4 rounded-xl border border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all outline-none font-medium"
                                                placeholder="Seller Alias"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Store Narrative</label>
                                            <textarea
                                                value={storeBio}
                                                onChange={(e) => setStoreBio(e.target.value)}
                                                className="w-full p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all outline-none font-medium min-h-[120px]"
                                                placeholder="Tell your story..."
                                            />
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleSaveProfile}
                                        disabled={updateProfile.isPending}
                                        className="h-12 px-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-200"
                                    >
                                        {updateProfile.isPending ? "Applying..." : "Save Changes"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary/5">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-primary" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Regional Visibility</p>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-serif italic leading-relaxed">Your store is currently visible to discovery nodes in <span className="font-bold text-zinc-900">Global Market A-1</span>.</p>
                                    <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-primary uppercase">Status</span>
                                        <Badge className="bg-emerald-500 text-white border-none py-0 px-2 h-4 text-[8px]">Online</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Verification & Tiers */}
                <TabsContent value="verification" className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            {/* Current Tier Status */}
                            <Card className="border-none shadow-xl shadow-zinc-100/50 rounded-[2.5rem] overflow-hidden">
                                <div className="p-10 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center shadow-lg" style={{ backgroundColor: tierInfo.bgColor }}>
                                                <tierInfo.icon className={cn("h-8 w-8", tierInfo.color)} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{tierInfo.label}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[8px] font-bold uppercase tracking-widest">Active Status</Badge>
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Verified via AI Audit</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 text-right">
                                            <TierUpgradeModal currentTier={currentTier} />
                                            {isRejected && !isSuspended && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-[10px] font-bold text-red-600">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {3 - retries} Attempts Remaining
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Product Limit", value: tierInfo.limits.products, icon: Package },
                                            { label: "Sales Ceiling", value: tierInfo.limits.monthlySales, icon: Activity },
                                            { label: "Protocol Fee", value: tierInfo.limits.fee, icon: BarChart3 },
                                            { label: "Capital Hold", value: tierInfo.limits.payoutHold, icon: Smartphone },
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-100/50">
                                                <stat.icon className="h-4 w-4 text-zinc-400 mb-3" />
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                                                <p className="text-lg font-bold text-zinc-900">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {currentTier !== "business" && (
                                        <div className="pt-8 border-t border-zinc-50">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Elevation Progress</p>
                                                    <p className="text-xs text-zinc-500 italic mt-0.5">Automated eligibility for {eligibility?.nextTier || "Next Tier"}</p>
                                                </div>
                                                <span className="text-xs font-bold text-primary">{eligibility?.progress || 0}% to {eligibility?.nextTier || "Verified"}</span>
                                            </div>
                                            <Progress value={eligibility?.progress || 0} className="h-2 rounded-full bg-zinc-100" />
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                                                {eligibility?.requirements?.map((req: any, i: number) => (
                                                    <div key={i} className={cn("flex items-center gap-3 transition-opacity", !req.met && "opacity-40")}>
                                                        <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", req.met ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-100 text-zinc-300")}>
                                                            {req.met ? <CheckCircle2 className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tight">{req.label}</span>
                                                            <span className="text-[9px] text-zinc-400 font-medium italic">Current: {req.current} / Target: {req.target}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Verification Ledger */}
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                                <CardHeader className="bg-zinc-50/50 p-8 border-b border-zinc-100">
                                    <CardTitle className="text-xl">Verification History</CardTitle>
                                    <CardDescription className="font-serif italic text-xs">A record of your compliance audits and document submittals.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-zinc-50">
                                        {historyRes?.data?.history?.map((log: any, i: number) => {
                                            const statusColors = {
                                                'approved': 'bg-emerald-50 text-emerald-600',
                                                'rejected': 'bg-red-50 text-red-600',
                                                'pending': 'bg-amber-50 text-amber-600'
                                            };
                                            const badgeClass = statusColors[log.status as keyof typeof statusColors] || 'bg-zinc-50 text-zinc-600';
                                            return (
                                                <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center">
                                                            {log.status === 'approved' ? <ShieldCheck className="h-5 w-5 text-emerald-400" /> : log.status === 'rejected' ? <AlertCircle className="h-5 w-5 text-red-400" /> : <Activity className="h-5 w-5 text-amber-400" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-zinc-900">Tier {log.requestedTier} Request</p>
                                                            <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(log.createdAt).toLocaleDateString()} • System Check</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={cn("border-none text-[8px] py-1 px-3 font-bold uppercase tracking-widest", badgeClass)}>{log.status}</Badge>
                                                </div>
                                            )
                                        })}
                                        {(!historyRes?.data?.history || historyRes.data.history.length === 0) && (
                                            <div className="px-8 py-8 text-center text-zinc-400 text-xs italic font-medium">
                                                No verification records found.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-zinc-900 text-white">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-4 w-4 text-primary fill-primary" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Upgrade Tip</p>
                                    </div>
                                    <p className="text-xs text-zinc-400 leading-relaxed italic">
                                        &ldquo;Transitioning to <span className="text-white font-bold">Tier 2: Verified Merchant</span> unlocks bulk ordering capabilities and reduces your maturation hold from 7 days down to 3.&rdquo;
                                    </p>
                                    <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
                                        View All Tier Benefits
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-amber-500/5 border border-amber-500/10">
                                <CardContent className="p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-900 underline underline-offset-4">Security Warning</p>
                                    </div>
                                    <p className="text-xs text-amber-700 font-medium leading-relaxed italic">
                                        Accessing Tier 3 requires incorporation documents. Unregistered entities are capped at Tier 2.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="bg-zinc-50/50 p-8 border-b border-zinc-100">
                            <CardTitle className="text-xl">Access Protocols</CardTitle>
                            <CardDescription className="font-serif italic text-xs">Protect your merchant account and data integrity.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                                        <Lock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">Change Authentication Phrase</p>
                                        <p className="text-xs text-zinc-500 italic">Rotate your account's primary access key.</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                                    className="h-10 px-6 rounded-xl border-zinc-100 font-bold text-[9px] uppercase tracking-widest"
                                >
                                    {isEditingPassword ? "Cancel" : "Update"}
                                </Button>
                            </div>

                            {isEditingPassword && (
                                <form onSubmit={handleUpdatePassword} className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ml-16 mt-[-1rem]">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Password</label>
                                        <Input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-medium max-w-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">New Password</label>
                                        <Input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="h-11 rounded-xl bg-zinc-50 border-zinc-100 font-medium max-w-sm"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        disabled={changePassword.isPending}
                                        className="h-10 px-8 rounded-xl bg-primary text-white font-bold text-[10px] uppercase tracking-widest"
                                    >
                                        {changePassword.isPending ? "Validating..." : "Confirm Rotation"}
                                    </Button>
                                </form>
                            )}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                                        <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-900">Multi-Factor Authentication</p>
                                        <p className="text-xs text-zinc-500 italic">Enhance security with SMS or Authenticator App.</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] py-1 px-3 font-bold uppercase tracking-widest">Enabled</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
