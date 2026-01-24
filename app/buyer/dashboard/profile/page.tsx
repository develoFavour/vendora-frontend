"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Settings } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export default function CustomerProfilePage() {
	const { user } = useAuthStore();

	const fullName = user?.name || "";
	const [firstName, ...lastNameParts] = fullName.split(" ");
	const lastName = lastNameParts.join(" ");

	const userInitials = user?.name
		? user.name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
		: "U";

	return (
		<div className="p-10 max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-700">
			{/* Header Section */}
			<div className="flex flex-col gap-4">
				<Badge className="w-fit bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] uppercase tracking-[0.3em] font-bold">
					Member Identity
				</Badge>
				<h1 className="text-5xl font-bold tracking-tighter text-white">
					Profile <span className="italic text-primary">Management.</span>
				</h1>
				<p className="text-zinc-500 font-medium italic">Edit your persona and secure your collection gateway.</p>
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Private Identity Card */}
				<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl flex flex-col items-center justify-center text-center">
					<div className="relative group">
						<div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
						<Avatar className="h-40 w-40 border-4 border-white/10 relative z-10 transition-transform duration-500 group-hover:scale-105">
							<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
							<AvatarFallback className="bg-zinc-800 text-primary text-5xl font-bold">
								{userInitials}
							</AvatarFallback>
						</Avatar>
						<Button
							size="icon"
							className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl z-20 border-4 border-zinc-900"
						>
							<Camera className="h-5 w-5" />
						</Button>
					</div>
					<div className="mt-8 space-y-2">
						<h2 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h2>
						<p className="text-zinc-500 text-sm font-medium">{user?.email}</p>
					</div>
					<Button variant="outline" className="mt-10 w-full h-14 rounded-2xl border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
						Swap Portrait
					</Button>
				</Card>

				{/* Identity Specifications Form */}
				<Card className="p-10 lg:col-span-2 bg-zinc-900/40 border-white/5 backdrop-blur-xl">
					<div className="mb-10 flex items-center gap-3">
						<div className="w-1 h-6 bg-primary rounded-full" />
						<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Identity Specifications</h2>
					</div>

					<div className="space-y-8">
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="space-y-3">
								<Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Given Name</Label>
								<Input className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all" defaultValue={firstName} />
							</div>
							<div className="space-y-3">
								<Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Family Name</Label>
								<Input className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all" defaultValue={lastName} />
							</div>
						</div>

						<div className="space-y-3">
							<Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Communication Channel</Label>
							<Input className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all" type="email" defaultValue={user?.email || ""} />
						</div>

						<div className="space-y-3">
							<Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">Contact Reference</Label>
							<Input className="h-14 rounded-2xl bg-white/[0.03] border-white/10 focus:border-primary/40 focus:bg-white/[0.05] transition-all" type="tel" placeholder="+1 (555) 000-0000" />
						</div>

						<div className="pt-4">
							<Button className="h-14 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl shadow-primary/20 transition-all border-none">
								Update Specifications
							</Button>
						</div>
					</div>
				</Card>
			</div>

			{/* Distribution Strongholds (Shipping) */}
			<Card className="p-10 bg-zinc-900/40 border-white/5 backdrop-blur-xl">
				<div className="mb-10 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-1 h-6 bg-accent rounded-full" />
						<h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-[0.1em]">Distribution Strongholds</h2>
					</div>
					<Button variant="ghost" className="text-xs font-bold uppercase tracking-[0.3em] text-primary hover:text-primary/80">
						Add Stronghold
					</Button>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{[
						{ label: "PRIMARY RESIDENCE", address: "123 Main Street, Suite 4B, Portland, OR 97201, USA", isDefault: true },
						{ label: "BUREAU HUB", address: "456 Business Ave, Suite 200, Portland, OR 97204, USA", isDefault: false },
					].map((addr, i) => (
						<div key={i} className={cn(
							"group p-6 rounded-[2rem] border transition-all duration-500",
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
		</div>
	);
}
