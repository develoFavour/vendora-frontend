"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, User, Bell, Database, KeyRound, AlertTriangle } from "lucide-react";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/use-user";

export default function AdminSettingsPage() {
    const { data: profileRes, isLoading: loadingProfile } = useProfile();
    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (profileRes) {
            // Safely destructure depending on if it's wrapped in `data.user`, `user`, or flatly provided.
            const user = profileRes?.data?.user || profileRes?.user || profileRes?.data || profileRes;
            setName(user?.name || "");
            setEmail(user?.email || "");
            setPhone(user?.phone || user?.address || "");
        }
    }, [profileRes]);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile.mutate({ name, phone });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) return;
        changePassword.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    setCurrentPassword("");
                    setNewPassword("");
                }
            }
        );
    };

    if (loadingProfile) {
        return (
            <div className="p-8 max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">System Configuration</p>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">Admin Settings</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage global preferences, identity, and security access controls.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Nav (Simulated/Visual) */}
                <div className="space-y-2 md:col-span-1 border-r border-zinc-100 pr-4">
                    <Button variant="ghost" className="w-full justify-start font-bold bg-primary/5 text-primary">
                        <User className="mr-3 h-4 w-4" /> Identity & Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 font-medium hover:text-zinc-900">
                        <Shield className="mr-3 h-4 w-4" /> Global Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 font-medium hover:text-zinc-900">
                        <Bell className="mr-3 h-4 w-4" /> Alerts & Rules
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 font-medium hover:text-zinc-900">
                        <Database className="mr-3 h-4 w-4" /> Database Mgmt
                    </Button>
                </div>

                {/* Right Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Identity Matrix */}
                    <Card className="p-6 border-zinc-200 shadow-sm rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-zinc-700" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Administrative Identity</h3>
                                <p className="text-xs text-zinc-500">Update your primary dashboard account information.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Full Legal Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-11 rounded-xl bg-zinc-50 border-zinc-200 font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Contact Number</Label>
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-11 rounded-xl bg-zinc-50 border-zinc-200 font-medium"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Secure Email Address</Label>
                                <Input
                                    value={email}
                                    disabled
                                    className="h-11 rounded-xl bg-zinc-100/50 border-zinc-200 text-zinc-500 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-zinc-400">Primary email addresses cannot be actively changed here. Contact sysadmin for domain migration.</p>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={updateProfile.isPending}
                                    className="rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800"
                                >
                                    {updateProfile.isPending ? "Validating..." : "Apply Identity Changes"}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Access Control (Password) */}
                    <Card className="p-6 border-zinc-200 shadow-sm rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                                <KeyRound className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900">Access Key Rotation</h3>
                                <p className="text-xs text-zinc-500">Update your root authentication password.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Current Password</Label>
                                <Input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="h-11 rounded-xl bg-zinc-50 border-zinc-200"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase font-bold text-red-400 tracking-wider">New Password</Label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 rounded-xl bg-red-50/30 border-red-100 focus-visible:ring-red-200"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={changePassword.isPending || !currentPassword || !newPassword}
                                    className="rounded-xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-700"
                                >
                                    {changePassword.isPending ? "Rotating Key..." : "Rotate Key"}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Danger Zone mock */}
                    <Card className="p-6 border-red-100 bg-red-50/50 shadow-sm rounded-3xl">
                        <h3 className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> System Overrides
                        </h3>
                        <p className="text-xs text-red-700 mb-4 leading-relaxed">
                            These actions directly modify core behavior and cannot be undone via this panel. Emergency stop controls affect all active merchant storefronts explicitly.
                        </p>
                        <Button variant="outline" className="border-red-200 text-red-600 bg-white hover:bg-red-50 font-bold" disabled>
                            Initiate Platform Freeze
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
