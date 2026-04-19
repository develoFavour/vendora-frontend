"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Settings, Loader2, MapPin, User as UserIcon, ShieldCheck, TrendingUp, Lock, Bell, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/use-user";
import { mediaAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CustomerProfilePage() {
	const { user: authUser } = useAuthStore();
	const { data: profileRes, isLoading: isProfileLoading } = useProfile();
	const updateProfile = useUpdateProfile();
	const changePassword = useChangePassword();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const user = profileRes?.data?.user;
	const [isUploading, setIsUploading] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
		location: "",
		bio: "",
		profilePicture: ""
	});

	// Password State
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	const [showPasswords, setShowPasswords] = useState({
		current: false,
		new: false,
		confirm: false
	});

	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				phone: user.phone || "",
				address: user.address || "",
				location: user.profile?.location || "",
				bio: user.profile?.bio || "",
				profilePicture: user.profile?.profileImage || ""
			});
		}
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = e.target;
		setFormData(prev => ({ ...prev, [id]: value }));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setPasswordData(prev => ({ ...prev, [id]: value }));
	};

	const handleUpdate = () => {
		updateProfile.mutate(formData);
	};

	const handlePasswordUpdate = (e: React.FormEvent) => {
		e.preventDefault();
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error("New passwords do not match.");
			return;
		}
		if (passwordData.newPassword.length < 6) {
			toast.error("New password must be at least 6 characters.");
			return;
		}

		changePassword.mutate({
			currentPassword: passwordData.currentPassword,
			newPassword: passwordData.newPassword
		}, {
			onSuccess: () => {
				setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
			}
		});
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setIsUploading(true);
			toast.loading("Uploading new portrait...", { id: "uploading-portrait" });

			const res = await mediaAPI.upload(file);
			const updatedData = { ...formData, profilePicture: res.url };

			setFormData(updatedData);

			// Auto-sync with backend for immediate save
			updateProfile.mutate(updatedData, {
				onSuccess: () => {
					toast.success("Portrait updated & authorized instantly!", { id: "uploading-portrait" });
				},
				onError: () => {
					toast.error("Portrait uploaded but failed to sync with vault.", { id: "uploading-portrait" });
				}
			});
		} catch (error: any) {
			toast.error(error.message || "Upload failed", { id: "uploading-portrait" });
		} finally {
			setIsUploading(false);
		}
	};

	const userInitials = formData.name
		? formData.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
		: "U";

	if (isProfileLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center text-primary bg-zinc-950">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="p-10 max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-700">
			{/* Header Section */}
			<div className="flex flex-col gap-4 text-left">
				<Badge className="w-fit bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
					Member Identity
				</Badge>
				<h1 className="text-5xl font-bold tracking-tighter text-white">
					Identity <span className="italic text-primary font-serif">Center.</span>
				</h1>
				<p className="text-zinc-500 font-medium italic">Refine your persona and secure your collection gateway.</p>
			</div>

			<Tabs defaultValue="identity" className="w-full space-y-12">
				<TabsList className="bg-zinc-900/50 border border-white/5 p-1 rounded-2xl h-auto">
					<TabsTrigger value="identity" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-widest text-[10px] transition-all">
						<UserIcon className="h-4 w-4 mr-2" />
						Identity Specifications
					</TabsTrigger>
					<TabsTrigger value="security" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-widest text-[10px] transition-all">
						<Lock className="h-4 w-4 mr-2" />
						Security
					</TabsTrigger>
					<TabsTrigger value="intel" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-widest text-[10px] transition-all">
						<Bell className="h-4 w-4 mr-2" />
						Intel (Notifications)
					</TabsTrigger>
				</TabsList>

				<div className="grid gap-8 lg:grid-cols-3">
					{/* Private Identity Card - Always Visible or Tab Specific? User requested a tabbed interface. Usually cards like this stay static or top. Let's keep it static on the left. */}
					<div className="lg:col-span-1">
						<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center rounded-[2.5rem] sticky top-8">
							<div className="relative group">
								<div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
								<Avatar className="h-40 w-40 border-4 border-white/10 relative z-10 transition-transform duration-500 group-hover:scale-105">
									<AvatarImage src={formData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
									<AvatarFallback className="bg-zinc-800 text-primary text-5xl font-bold">
										{isUploading ? <Loader2 className="animate-spin h-10 w-10" /> : userInitials}
									</AvatarFallback>
								</Avatar>
								{isUploading && (
									<div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 rounded-full">
										<Loader2 className="h-10 w-10 animate-spin text-primary" />
									</div>
								)}
								<Button
									size="icon"
									onClick={() => fileInputRef.current?.click()}
									className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl z-20 border-4 border-zinc-900"
								>
									<Camera className="h-5 w-5" />
								</Button>
							</div>
							<div className="mt-8 space-y-2">
								<h2 className="text-2xl font-bold text-white tracking-tight">{formData.name || user?.name}</h2>
								<p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
									<ShieldCheck className="h-3 w-3 text-primary shrink-0" />
									Verified Member
								</p>
							</div>

							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={handleFileUpload}
							/>

							<div className="mt-10 w-full space-y-4">
								<Button
									variant="outline"
									className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
									onClick={() => fileInputRef.current?.click()}
									disabled={isUploading}
								>
									{isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
									{isUploading ? "Uploading Artifact..." : "Swap Portrait"}
								</Button>
								<p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic flex items-center justify-center gap-1.5">
									<TrendingUp className="h-2.5 w-2.5" />
									Portrait updates auto-sync with vault.
								</p>
							</div>
						</Card>
					</div>

					{/* Tab Contents */}
					<div className="lg:col-span-2 space-y-8">
						<TabsContent value="identity" className="m-0 space-y-8 animate-in slide-in-from-right-4 duration-500">
							{/* Identity Specifications Form */}
							<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
								<div className="mb-10 flex items-center gap-3">
									<div className="w-1 h-6 bg-primary rounded-full" />
									<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Persona Details</h2>
								</div>

								<div className="space-y-8">
									<div className="grid gap-6 sm:grid-cols-2">
										<div className="space-y-3">
											<Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Full Name</Label>
											<Input
												id="name"
												className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white"
												value={formData.name}
												onChange={handleChange}
											/>
										</div>
										<div className="space-y-3">
											<Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Artisan Bio</Label>
											<Input
												id="bio"
												placeholder="Your short collection philosophy..."
												className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white"
												value={formData.bio}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="grid gap-6 sm:grid-cols-2">
										<div className="space-y-3">
											<Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Contact Information (Phone)</Label>
											<Input
												id="phone"
												className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white"
												type="tel"
												placeholder="+1 (555) 000-0000"
												value={formData.phone}
												onChange={handleChange}
											/>
										</div>
										<div className="space-y-3">
											<Label htmlFor="location" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">State (Loc)</Label>
											<Input
												id="location"
												className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white"
												placeholder="e.g. Portland, OR"
												value={formData.location}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className="space-y-3">
										<Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Home Address (Vault)</Label>
										<Textarea
											id="address"
											className="min-h-[100px] rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white p-4"
											placeholder="Your primary shipping stronghold..."
											value={formData.address}
											onChange={handleChange}
										/>
									</div>

									<div className="pt-4">
										<Button
											onClick={handleUpdate}
											disabled={updateProfile.isPending}
											className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl shadow-primary/20 transition-all border-none uppercase tracking-widest text-[10px]"
										>
											{updateProfile.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Authorize Specifications"}
										</Button>
									</div>
								</div>
							</Card>

							{/* Distribution Strongholds */}
							<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
								<div className="mb-10 flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-1 h-6 bg-accent rounded-full" />
										<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Verified Strongholds</h2>
									</div>
									<Button variant="ghost" className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:text-primary/80">
										Add Stronghold
									</Button>
								</div>

								<div className="grid gap-6">
									{[
										{ label: "PRIMARY VAULT", address: formData.address || "No address specified yet", isDefault: true },
									].map((addr, i) => (
										<div key={i} className={cn(
											"group p-8 rounded-[2rem] border transition-all duration-500",
											addr.isDefault
												? "bg-primary/5 border-primary/20 shadow-2xl shadow-primary/5"
												: "bg-white/[0.02] border-white/5 hover:border-white/10"
										)}>
											<div className="flex items-center justify-between mb-6">
												<div className="flex items-center gap-3">
													<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">{addr.label}</span>
													{addr.isDefault && <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-bold uppercase tracking-widest">Active</Badge>}
												</div>
												<div className="flex gap-2">
													<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-zinc-500 hover:text-white">
														<Settings className="h-4 w-4" />
													</Button>
												</div>
											</div>
											<p className="text-sm font-medium text-zinc-400 leading-relaxed italic pr-10">
												&ldquo;{addr.address}&rdquo;
											</p>
											<div className="mt-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
												<button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Revise</button>
												<button className="text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors">Decommission</button>
											</div>
										</div>
									))}
								</div>
							</Card>
						</TabsContent>

						<TabsContent value="security" className="m-0 space-y-8 animate-in slide-in-from-right-4 duration-500">
							<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
								<div className="mb-10 flex items-center gap-3">
									<div className="w-1 h-6 bg-primary rounded-full" />
									<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Manage Password</h2>
								</div>

								<form onSubmit={handlePasswordUpdate} className="space-y-8">
									<div className="space-y-3 relative">
										<Label htmlFor="currentPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Current Passcode</Label>
										<div className="relative">
											<Input
												id="currentPassword"
												type={showPasswords.current ? "text" : "password"}
												className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white pr-12"
												value={passwordData.currentPassword}
												onChange={handlePasswordChange}
												required
											/>
											<button
												type="button"
												onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
												className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
											>
												{showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
											</button>
										</div>
									</div>

									<div className="grid gap-6 sm:grid-cols-2">
										<div className="space-y-3 relative">
											<Label htmlFor="newPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">New Identity Code</Label>
											<div className="relative">
												<Input
													id="newPassword"
													type={showPasswords.new ? "text" : "password"}
													className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white pr-12"
													value={passwordData.newPassword}
													onChange={handlePasswordChange}
													required
												/>
												<button
													type="button"
													onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
													className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
												>
													{showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
												</button>
											</div>
										</div>
										<div className="space-y-3 relative">
											<Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Confirm Identity Code</Label>
											<div className="relative">
												<Input
													id="confirmPassword"
													type={showPasswords.confirm ? "text" : "password"}
													className="h-14 rounded-2xl bg-zinc-950 border-white/10 focus:border-primary/40 focus:bg-zinc-950 transition-all text-white pr-12"
													value={passwordData.confirmPassword}
													onChange={handlePasswordChange}
													required
												/>
												<button
													type="button"
													onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
													className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
												>
													{showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
												</button>
											</div>
										</div>
									</div>

									<div className="pt-4">
										<Button
											type="submit"
											disabled={changePassword.isPending}
											className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl shadow-primary/20 transition-all border-none uppercase tracking-widest text-[10px]"
										>
											{changePassword.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : "Change Password"}
										</Button>
									</div>
								</form>
							</Card>

							<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
								<div className="mb-10 flex items-center gap-3">
									<div className="w-1 h-6 bg-emerald-500 rounded-full" />
									<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Two-Factor Authorization</h2>
								</div>
								<div className="flex items-center justify-between p-8 rounded-[2rem] border border-white/5 bg-white/[0.02]">
									<div className="space-y-2">
										<p className="text-sm font-bold text-white uppercase tracking-wider">Multi-Factor Protocol</p>
										<p className="text-xs text-zinc-500 italic">Secure your vault with an additional layer of verification.</p>
									</div>
									<Button variant="outline" className="border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
										Initialize
									</Button>
								</div>
							</Card>
						</TabsContent>

						<TabsContent value="intel" className="m-0 space-y-8 animate-in slide-in-from-right-4 duration-500">
							<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl rounded-[2.5rem]">
								<div className="mb-10 flex items-center gap-3">
									<div className="w-1 h-6 bg-primary rounded-full" />
									<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Communication Nodes</h2>
								</div>

								<div className="space-y-6">
									{[
										{ title: "Acquisition Alerts", desc: "Real-time signals when a new artifact enters your transit pipeline.", enabled: true },
										{ title: "Marketplace Intel", desc: "Curated transmissions based on your collection philosophy.", enabled: false },
										{ title: "Security Protocols", desc: "Critical alerts regarding access to your identity center.", enabled: true },
									].map((node, i) => (
										<div key={i} className="flex items-center justify-between p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors">
											<div className="space-y-1">
												<p className="text-sm font-bold text-white uppercase tracking-wider">{node.title}</p>
												<p className="text-xs text-zinc-500 italic">{node.desc}</p>
											</div>
											<div className={cn(
												"w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer",
												node.enabled ? "bg-primary" : "bg-zinc-800"
											)}>
												<div className={cn(
													"w-4 h-4 bg-white rounded-full transition-all duration-300",
													node.enabled ? "translate-x-6" : "translate-x-0"
												)} />
											</div>
										</div>
									))}
								</div>
							</Card>
						</TabsContent>
					</div>
				</div>
			</Tabs>
		</div>
	);
}
