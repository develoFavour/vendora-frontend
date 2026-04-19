import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Zap,
    ShieldCheck,
    Store,
    ArrowUpRight,
    Check,
    Lock,
    Upload,
    Loader2
} from "lucide-react";
import { useTierStatus, useRequestUpgrade, useTierEligibility, useAppealSuspension } from "@/hooks/use-tier";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { mediaAPI } from "@/lib/api";
import { AlertCircle, Clock, ShieldAlert } from "lucide-react";

interface TierUpgradeModalProps {
    currentTier: string;
}

const TIER_BENEFITS = {
    verified: {
        name: "Verified Merchant",
        icon: ShieldCheck,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        benefits: [
            "Monthly Limit: $25,000",
            "Hold Period: 5 Days",
            "Transaction Fee: 3.5%",
            "Verified Badge on Profile"
        ],
        requirements: [
            { label: "Official Government ID", key: "government_id" },
            { label: "Liveness Selfie Verification", key: "selfie" },
            { label: "Social Media Linking", key: "social_proof" }
        ]
    },
    business: {
        name: "Enterprise Vault",
        icon: Store,
        color: "text-primary",
        bgColor: "bg-primary/5",
        benefits: [
            "Monthly Limit: Unlimited",
            "Hold Period: 24 Hours",
            "Transaction Fee: 2.0%",
            "Direct API Access"
        ],
        requirements: [
            { label: "Business Registration Certificate", key: "business_registration" },
            { label: "Tax Identification Number (TIN/EIN)", key: "tax_id" },
            { label: "3-Month Bank Statement", key: "bank_statement" }
        ]
    }
};

export default function TierUpgradeModal({ currentTier }: TierUpgradeModalProps) {
    const { data: statusRes } = useTierStatus();
    const requestUpgrade = useRequestUpgrade();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<'verified' | 'business'>(
        currentTier === 'individual' ? 'verified' : 'business'
    );
    const [documents, setDocuments] = useState<{ file: File; type: string }[]>([]);
    const [businessInfo, setBusinessInfo] = useState({
        businessName: "",
        description: "",
        location: "",
        url: ""
    });
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [activeUploadType, setActiveUploadType] = useState<string | null>(null);
    const [aiStatus, setAiStatus] = useState<string>("");

    const { data: eligibilityRes } = useTierEligibility();
    const appealSuspension = useAppealSuspension();
    const [isAppealing, setIsAppealing] = useState(false);
    const [appealReason, setAppealReason] = useState("");

    const isSuspended = eligibilityRes?.data?.isSuspended;
    const retries = eligibilityRes?.data?.retries || 0;
    const suspendedUntil = eligibilityRes?.data?.suspendedUntil;
    const appealStatus = eligibilityRes?.data?.appealStatus;

    const requestNode = statusRes?.data?.request;
    const isPending = requestNode?.status === 'pending';
    const isRejected = requestNode?.status === 'rejected';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeUploadType) {
            // Remove existing document of same type if any
            setDocuments(prev => [
                ...prev.filter(d => d.type !== activeUploadType),
                { file, type: activeUploadType }
            ]);
            toast.success(`${activeUploadType.replace(/_/g, ' ')} uploaded successfully`);
        }
    };

    const triggerUpload = (type: string) => {
        setActiveUploadType(type);
        fileInputRef.current?.click();
    };

    const handleUpgrade = async () => {
        // Validation
        const requiredDocTypes = TIER_BENEFITS[selectedTier].requirements.map(r => r.key);
        const missingDocs = requiredDocTypes.filter(type => !documents.find(d => d.type === type));

        if (missingDocs.length > 0) {
            toast.error("Please upload all required documents first");
            return;
        }

        try {
            setAiStatus("Uploading documents securely...");

            // 1. Upload all documents to Cloudinary
            const uploadedDocs = [];
            for (const doc of documents) {
                const response = await mediaAPI.upload(doc.file);
                if (response.success) {
                    uploadedDocs.push({
                        documentType: doc.type,
                        fileName: doc.file.name,
                        fileUrl: response.url
                    });
                }
            }

            // 2. Start AI Scanning Animation
            const statusInterval = setInterval(() => {
                setAiStatus((prev) => {
                    if (prev === "Uploading documents securely...") return "🤖 AI scanning Identity Document...";
                    if (prev === "🤖 AI scanning Identity Document...") return "👤 Matching face to profile...";
                    if (prev === "👤 Matching face to profile...") return "✨ Finalizing verification...";
                    return prev;
                });
            }, 2500);

            // 3. Submit request with real URLs
            const response = await requestUpgrade.mutateAsync({
                requestedTier: selectedTier,
                documents: uploadedDocs,
                businessInfo: selectedTier === 'business' ? businessInfo : null
            });

            clearInterval(statusInterval);
            setAiStatus("");

            const resStatus = response?.data?.status;

            if (resStatus === 'approved') {
                toast.success("Identity Verified!", {
                    description: "Your account has been upgraded successfully by our AI.",
                    duration: 6000
                });
                setIsOpen(false);
                setDocuments([]);
            } else if (resStatus === 'rejected') {
                // Stay open — the modal will now show the rejection state from the refetched data
                toast.error("Verification Failed", {
                    description: response?.data?.notes || "AI could not verify your documents. Please review the notes.",
                    duration: 8000
                });
                // Don't close — let the status refetch show the rejected UI
                setDocuments([]);
            } else {
                // Pending manual review
                toast.info("Under Manual Review", {
                    description: "Our AI flagged some details. A team member will review within 24-48 hours.",
                    duration: 6000
                });
                setIsOpen(false);
                setDocuments([]);
            }
        } catch (error: any) {
            setAiStatus("");
            const msg = error.response?.data?.error || error.message || "Failed to process upgrade";
            toast.error(msg);
        }
    };

    if (currentTier === 'business') return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "h-9 px-4 rounded-full border border-primary/20 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                        isSuspended ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" :
                            isPending ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" :
                                isRejected ? "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10" :
                                    "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                    )}
                >
                    {isSuspended ? (
                        <>
                            <ShieldAlert className="h-3 w-3 fill-red-100 text-red-500" />
                            Account Suspended
                        </>
                    ) : isPending ? (
                        <>
                            <Clock className="h-3 w-3 text-amber-500" />
                            Review Pending
                        </>
                    ) : isRejected ? (
                        <>
                            <Zap className="h-3 w-3 fill-primary text-primary" />
                            Retry Level Up
                        </>
                    ) : (
                        <>
                            <Zap className="h-3 w-3 fill-primary text-primary" />
                            Level Up
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl sm:max-w-4xl w-full bg-white border-none rounded-[2.5rem] p-0 overflow-hidden shadow-2xl h-[80vh] min-h-[650px]">
                <DialogTitle className="sr-only">Tier Upgrade Options</DialogTitle>
                <div className="flex h-full">
                    {/* Left Panel: Tiers */}
                    <div className="w-1/3 bg-zinc-50 p-8 border-r border-zinc-100 flex flex-col gap-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Select Elevation</p>

                        {(['verified', 'business'] as const).map((tier) => {
                            const data = TIER_BENEFITS[tier];
                            const isAvailable = (currentTier === 'individual' && tier === 'verified') || (currentTier === 'verified' && tier === 'business');
                            const isSelected = selectedTier === tier;

                            return (
                                <button
                                    key={tier}
                                    disabled={!isAvailable}
                                    onClick={() => setSelectedTier(tier)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl text-left transition-all relative group",
                                        isSelected ? "bg-white shadow-xl shadow-zinc-200/50 scale-[1.02] z-10" : "hover:bg-zinc-100",
                                        !isAvailable && "opacity-40 cursor-not-allowed"
                                    )}
                                >
                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", data.bgColor)}>
                                        <data.icon className={cn("h-5 w-5", data.color)} />
                                    </div>
                                    <p className="font-bold text-sm text-zinc-900 leading-tight mb-1">{data.name}</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Tier {tier === 'verified' ? '2' : '3'}</p>

                                    {isSelected && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                                <Check className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Panel: Content */}
                    <div className="flex-1 p-10 flex flex-col justify-between w-full">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-bold tracking-tight text-zinc-900">
                                    {TIER_BENEFITS[selectedTier].name}
                                </h3>
                                <Badge className="bg-primary/5 text-primary border-none text-[8px] uppercase tracking-[0.2em] font-bold py-1 px-3">
                                    Benefits Hub
                                </Badge>
                            </div>

                            <div className="space-y-6">
                                {isSuspended ? (
                                    <div className="p-6 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center justify-center text-center gap-3">
                                        <ShieldAlert className="h-10 w-10 text-red-500" />
                                        <h4 className="font-bold text-red-900 text-lg">Verification Suspended</h4>
                                        <p className="text-sm text-red-700 max-w-sm">
                                            You have exceeded the maximum number of failed verification attempts. Your ability to upgrade is temporarily suspended.
                                        </p>
                                        {suspendedUntil && (
                                            <p className="text-xs font-bold text-red-600 bg-red-100/50 px-3 py-1 rounded-full mt-2">
                                                Suspended until: {new Date(suspendedUntil).toLocaleDateString()}
                                            </p>
                                        )}
                                        {appealStatus === "pending" ? (
                                            <p className="text-xs font-bold text-amber-600 mt-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                                Appeal pending admin review
                                            </p>
                                        ) : isAppealing ? (
                                            <div className="w-full max-w-sm mt-4 flex flex-col gap-2 relative">
                                                <textarea
                                                    value={appealReason}
                                                    onChange={e => setAppealReason(e.target.value)}
                                                    placeholder="Explain why your account should be unsuspended..."
                                                    className="w-full text-xs p-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[80px]"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setIsAppealing(false)} className="h-7 text-[10px] text-red-700 font-bold">Cancel</Button>
                                                    <Button
                                                        size="sm"
                                                        disabled={!appealReason || appealSuspension.isPending}
                                                        className="h-7 text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold"
                                                        onClick={() => {
                                                            appealSuspension.mutate(appealReason, {
                                                                onSuccess: () => {
                                                                    setIsAppealing(false);
                                                                    toast.success("Appeal submitted to admins");
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        {appealSuspension.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Submit Appeal"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button variant="link" onClick={() => setIsAppealing(true)} className="text-red-600 font-bold mt-2">
                                                Lodge Complaint
                                            </Button>
                                        )}
                                    </div>
                                ) : isPending ? (
                                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center text-center gap-3">
                                        <Clock className="h-10 w-10 text-amber-500" />
                                        <h4 className="font-bold text-amber-900 text-lg">Under Manual Review</h4>
                                        <p className="text-sm text-amber-700 max-w-sm">
                                            {requestNode?.reviewNotes ? "Our AI flagged some details for manual verification." : "Your request is currently being reviewed by our team."}
                                        </p>
                                        {requestNode?.reviewNotes && (
                                            <div className="mt-4 p-3 bg-white/60 rounded-xl text-xs text-amber-800 text-left w-full border border-amber-200/50">
                                                <span className="font-bold uppercase text-[9px] mb-1 block opacity-70">AI System Notes:</span>
                                                {requestNode.reviewNotes}
                                            </div>
                                        )}
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600/60 mt-4">
                                            Estimated time: 24-48 Hours
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {isRejected && (
                                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-red-900 font-bold text-sm leading-tight">Verification Rejected</span>
                                                    <span className="text-red-700 text-xs">
                                                        {requestNode?.adminNotes || "We couldn't verify your details. Please ensure all documents are clear and valid."}
                                                    </span>
                                                    <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[9px] uppercase tracking-wider rounded w-fit">
                                                        Attempts remaining: {3 - retries}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <section>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Tier Privileges</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {TIER_BENEFITS[selectedTier].benefits.map((benefit, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100/50">
                                                        <div className="h-5 w-5 rounded-md bg-white border border-zinc-100 flex items-center justify-center flex-shrink-0">
                                                            <Check className="h-3 w-3 text-emerald-500" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-zinc-600 truncate">{benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <section>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Required Intelligence</p>
                                            <div className="space-y-2">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                    accept="image/*,application/pdf"
                                                />
                                                {TIER_BENEFITS[selectedTier].requirements.map((req, i) => {
                                                    const isUploaded = documents.find(d => d.type === req.key);
                                                    return (
                                                        <div
                                                            key={i}
                                                            onClick={() => triggerUpload(req.key)}
                                                            className={cn(
                                                                "flex items-center justify-between p-3 rounded-xl border border-dashed cursor-pointer transition-all",
                                                                isUploaded ? "border-emerald-500 bg-emerald-50/50" : "border-zinc-200 hover:border-primary/50 hover:bg-zinc-50"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className={cn("text-[10px] font-medium", isUploaded ? "text-emerald-700" : "text-zinc-500")}>
                                                                    {req.label}
                                                                </span>
                                                                {isUploaded && (
                                                                    <span className="text-[8px] text-emerald-600 italic font-medium">({isUploaded.file.name})</span>
                                                                )}
                                                            </div>
                                                            {isUploaded ? (
                                                                <Check className="h-3 w-3 text-emerald-500" />
                                                            ) : (
                                                                <Upload className="h-3 w-3 text-zinc-300" />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </section>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-50 flex items-center justify-between relative">
                            {aiStatus && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-xl">
                                    <div className="flex items-center gap-3 text-primary animate-pulse">
                                        <div className="w-5 h-5 relative">
                                            <div className="absolute inset-0 border-2 border-primary/20 rounded-full"></div>
                                            <div className="absolute inset-0 border-2 border-primary rounded-full border-t-transparent animate-spin"></div>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{aiStatus}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-zinc-400">
                                <Lock className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                            </div>

                            {isSuspended ? (
                                <Button disabled className="h-12 px-8 rounded-xl bg-red-50 text-red-300 font-bold text-[10px] uppercase tracking-widest border border-red-100/50">
                                    Account Locked
                                </Button>
                            ) : isPending ? (
                                <Button disabled className="h-12 px-8 rounded-xl bg-zinc-100 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                                    Review Pending
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleUpgrade}
                                    disabled={requestUpgrade.isPending || !!aiStatus}
                                    className="h-12 px-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-zinc-200"
                                >
                                    {requestUpgrade.isPending || aiStatus ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Initiate Level Up"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
