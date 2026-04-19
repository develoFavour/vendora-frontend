"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    DollarSign,
    Clock,
    ArrowUpRight,
    History,
    Wallet,
    CreditCard,
    ArrowDownRight,
    TrendingUp,
    ShieldCheck,
    Loader2,
    Plus,
    Banknote,
    ChevronRight
} from "lucide-react";
import { useWalletOverview, useRequestPayout } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TierUpgradeModal from "@/components/vendor/TierUpgradeModal";

export default function VendorWalletPage() {
    const { data: walletRes, isLoading } = useWalletOverview();
    const requestPayout = useRequestPayout();

    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [payoutData, setPayoutData] = useState({
        amount: "",
        method: "bank_transfer",
        accountName: "",
        accountNumber: "",
        bankName: ""
    });

    const wallet = walletRes?.data;
    const balance = wallet?.balance;
    const transactions = wallet?.transactions || [];
    const payouts = wallet?.payouts || [];

    const handleRequestPayout = (e: React.FormEvent) => {
        e.preventDefault();
        requestPayout.mutate({
            amount: parseFloat(payoutData.amount),
            method: payoutData.method,
            accountDetails: {
                accountName: payoutData.accountName,
                accountNumber: payoutData.accountNumber,
                bankName: payoutData.bankName
            }
        }, {
            onSuccess: () => {
                setIsPayoutModalOpen(false);
                setPayoutData({
                    amount: "",
                    method: "bank_transfer",
                    accountName: "",
                    accountNumber: "",
                    bankName: ""
                });
            }
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Financial Vault</p>
                    <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-white">Merchant Treasury</h1>
                    <p className="text-zinc-500 text-sm font-medium italic">Monitor your acquisitions and manage your capital transmissions.</p>
                </div>

                <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-14 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-xl shadow-zinc-200 transition-all border-none uppercase tracking-widest text-[10px] flex items-center gap-3">
                            <ArrowUpRight className="h-4 w-4" />
                            Initiate Payout
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white border-none rounded-[2rem] p-8 shadow-2xl">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-bold tracking-tight">Initiate Transmission</DialogTitle>
                            <DialogDescription className="text-zinc-500 italic">
                                Authorize the transfer of available capital to your verified account.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleRequestPayout} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Withdrawal Amount ($)</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-14 bg-zinc-50 border-zinc-100 rounded-xl font-bold text-lg"
                                    value={payoutData.amount}
                                    onChange={(e) => setPayoutData({ ...payoutData, amount: e.target.value })}
                                    required
                                />
                                <p className="text-[10px] text-zinc-400 italic">Available: ${balance?.available?.toLocaleString()}</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Transfer Protocol</Label>
                                <Select value={payoutData.method} onValueChange={(v) => setPayoutData({ ...payoutData, method: v })}>
                                    <SelectTrigger className="h-14 bg-zinc-50 border-zinc-100 rounded-xl">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-zinc-100">
                                        <SelectItem value="bank_transfer">Standard Bank Wire</SelectItem>
                                        <SelectItem value="instant_transfer">Instant Liquidity (Tier 3 Only)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-50">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Beneficiary Name</Label>
                                    <Input
                                        placeholder="Exact account name"
                                        className="h-12 bg-zinc-50 border-zinc-100 rounded-xl"
                                        value={payoutData.accountName}
                                        onChange={(e) => setPayoutData({ ...payoutData, accountName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Account Identity Code</Label>
                                    <Input
                                        placeholder="Account number"
                                        className="h-12 bg-zinc-50 border-zinc-100 rounded-xl"
                                        value={payoutData.accountNumber}
                                        onChange={(e) => setPayoutData({ ...payoutData, accountNumber: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Receiving Institution</Label>
                                    <Input
                                        placeholder="Bank name"
                                        className="h-12 bg-zinc-50 border-zinc-100 rounded-xl"
                                        value={payoutData.bankName}
                                        onChange={(e) => setPayoutData({ ...payoutData, bankName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={requestPayout.isPending}
                                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                            >
                                {requestPayout.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authorize Transfer"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Balance Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="relative overflow-hidden p-8 border-none bg-zinc-900 text-white rounded-[2.5rem] shadow-2xl">
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Available Liquid Capital</p>
                            </div>
                            <h2 className="text-5xl font-bold tracking-tighter">${balance?.available?.toLocaleString()}</h2>
                        </div>
                        <div className="flex items-center justify-between">
                            <Badge className="bg-white/10 text-white border-none text-[8px] uppercase tracking-widest py-1.5 px-3 rounded-full backdrop-blur-md">
                                Ready for Payout
                            </Badge>
                            <Wallet className="h-8 w-8 text-white/10" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
                </Card>

                <Card className="p-8 border-border bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col justify-between h-full min-h-[160px]">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-3 w-3 text-amber-500" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Vaulted Funds (Pending)</p>
                            </div>
                            <h2 className="text-4xl font-bold tracking-tighter text-zinc-900">${balance?.pending?.toLocaleString()}</h2>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                                <span>Maturation Status</span>
                                <span>Hold: {balance?.holdDays || 7} Days</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 w-2/3" />
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-border bg-zinc-50/50 rounded-[2.5rem] shadow-sm">
                    <div className="flex flex-col justify-between h-full min-h-[160px]">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-3 w-3 text-primary" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Life-Time Acquisitions</p>
                            </div>
                            <h2 className="text-4xl font-bold tracking-tighter text-zinc-900">${balance?.lifetime?.toLocaleString()}</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-primary/5 text-primary border-none text-[8px] uppercase tracking-widest py-1.5 px-3 rounded-full">
                                Level {balance?.tier === 'business' ? '3' : balance?.tier === 'verified' ? '2' : '1'} Merchant
                            </Badge>
                            <TierUpgradeModal currentTier={balance?.tier || 'individual'} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* History Tabs */}
            <div className="space-y-6">
                <Tabs defaultValue="transactions" className="w-full">
                    <div className="flex items-center justify-between mb-8">
                        <TabsList className="bg-zinc-100 p-1 rounded-2xl">
                            <TabsTrigger value="transactions" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase tracking-widest">
                                Acquisition Log
                            </TabsTrigger>
                            <TabsTrigger value="payouts" className="rounded-xl px-8 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] font-bold uppercase tracking-widest">
                                Transmission History
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="transactions">
                        <Card className="overflow-hidden border-border bg-white rounded-[2rem] shadow-sm">
                            <div className="divide-y divide-zinc-50">
                                {transactions.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <History className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
                                        <p className="text-zinc-500 font-medium italic">No financial movements recorded yet.</p>
                                    </div>
                                ) : (
                                    transactions.map((tx: any) => (
                                        <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-12 w-12 rounded-2xl flex items-center justify-center",
                                                    tx.type === 'sale' ? "bg-emerald-50" : "bg-zinc-100"
                                                )}>
                                                    {tx.type === 'sale' ? (
                                                        <ArrowDownRight className="h-6 w-6 text-emerald-600" />
                                                    ) : (
                                                        <ArrowUpRight className="h-6 w-6 text-zinc-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 text-sm">
                                                        {tx.type === 'sale' ? 'Order Acquisition' : tx.type.toUpperCase()}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        {tx.status === 'pending' && (
                                                            <Badge className="bg-amber-50 text-amber-600 border-none text-[8px] py-0.5 px-2 font-bold uppercase tracking-tighter">Pending Hold</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn(
                                                    "font-bold text-lg tracking-tight",
                                                    tx.type === 'sale' ? "text-emerald-600" : "text-zinc-900"
                                                )}>
                                                    {tx.type === 'sale' ? '+' : '-'}${tx.amount?.toLocaleString()}
                                                </p>
                                                <p className="text-[9px] text-zinc-400 font-medium italic">ID: {tx.reference}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payouts">
                        <Card className="overflow-hidden border-border bg-white rounded-[2rem] shadow-sm">
                            <div className="divide-y divide-zinc-50">
                                {payouts.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <Banknote className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
                                        <p className="text-zinc-500 font-medium italic">No capital transmissions initiated.</p>
                                    </div>
                                ) : (
                                    payouts.map((p: any) => (
                                        <div key={p.id} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                                    <CreditCard className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-zinc-900 text-sm">Capital Withdrawal</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                            Requested: {new Date(p.requestedAt).toLocaleDateString()}
                                                        </span>
                                                        <Badge className={cn(
                                                            "border-none text-[8px] py-0.5 px-2 font-bold uppercase tracking-tighter",
                                                            p.status === 'processed' ? "bg-emerald-50 text-emerald-600" :
                                                                p.status === 'pending' ? "bg-blue-50 text-blue-600" :
                                                                    "bg-zinc-100 text-zinc-400"
                                                        )}>
                                                            {p.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex items-center gap-6">
                                                <div>
                                                    <p className="font-bold text-zinc-900 text-lg tracking-tight">
                                                        -${p.amount?.toLocaleString()}
                                                    </p>
                                                    <p className="text-[9px] text-zinc-400 font-medium italic">{p.method.replace('_', ' ')}</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-zinc-200" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Security Notice */}
            <div className="bg-zinc-50/50 border border-zinc-100 rounded-[2rem] p-8 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-zinc-400" />
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Security & Compliance</p>
                    <p className="text-xs text-zinc-500 leading-relaxed font-serif italic">
                        All transmissions are subject to the Vendora security maturation period of {balance?.holdDays || 7} days. High-velocity transactions may undergo manual auditing
                        by our risk assessment unit. Your tier status determines your withdrawal velocity and monthly capital ceilings.
                    </p>
                </div>
            </div>
        </div>
    );
}
