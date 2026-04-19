"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Users, Mail, Phone, Calendar, ArrowUpRight } from "lucide-react";
import { useAdminCustomers } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

export default function AdminCustomersPage() {
    const [search, setSearch] = useState("");

    const { data: customersRes, isLoading } = useAdminCustomers({ search: search || undefined });
    const customers = customersRes?.data?.customers || [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">CRM Dashboard</p>
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">Customer Base</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage the global Vendora user base and monitor buyer engagement.</p>
            </div>

            {/* Search */}
            <Card className="p-4 border-border bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                        placeholder="Search customers by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 rounded-xl bg-zinc-50 border-zinc-100 h-11"
                    />
                </div>
            </Card>

            {/* Customers list */}
            <Card className="overflow-hidden border-border bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm">
                {isLoading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-zinc-300" /></div>
                ) : customers.length === 0 ? (
                    <div className="p-20 text-center">
                        <Users className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-400 font-medium italic">No customers found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    {["Customer", "Contact Details", "Membership", "Activity Status", "Joined"].map((h) => (
                                        <th key={h} className="px-6 py-4 text-left text-[9px] font-bold uppercase tracking-widest text-zinc-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {customers.map((c: any, id: number) => (
                                    <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                                    {c.name?.charAt(0).toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-zinc-900 dark:text-white">{c.name || "Unnamed Buyer"}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5 uppercase tracking-tighter">ID: {c.id || c._id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="text-xs font-medium">{c.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Phone className="h-3 w-3 opacity-50" />
                                                    <span className="text-[10px] font-medium">{c.phone || "No phone listed"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-zinc-50 border-zinc-200 text-zinc-600 text-[8px] uppercase tracking-widest font-bold py-1 px-3 rounded-full">
                                                Active Buyer
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">In Good Standing</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4 justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                                        {new Date(c.createdAt || Date.now()).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                                                    </span>
                                                </div>
                                                <ArrowUpRight className="h-4 w-4 text-zinc-200 group-hover:text-zinc-400 transition-colors" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
