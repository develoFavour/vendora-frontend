"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, CheckCircle2, Users, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VendorCardProps {
	id: string;
	name: string;
	description: string;
	category: string;
	location?: string;
	rating?: number;
	verified?: boolean;
	image?: string;
	followers?: number;
	productCount?: number;
	className?: string;
}

export function VendorCard({
	id,
	name,
	description,
	category,
	location,
	rating = 4.9,
	verified = true,
	image,
	followers = 1200,
	productCount = 45,
	className,
}: VendorCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -5 }}
			transition={{ duration: 0.4 }}
			className={cn("h-full", className)}
		>
			<Card className="group relative h-full overflow-hidden border border-border/40 bg-card/30 p-0 backdrop-blur-xl transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
				{/* Header/Cover Placeholder */}
				<div className="h-24 bg-gradient-to-r from-primary/20 via-primary/5 to-accent/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

				<div className="relative -mt-12 px-6 pb-6">
					<Link href={`/vendors/${id}`}>
						<div className="flex flex-col items-center">
							{/* Logo/Avatar */}
							<div className="relative">
								<div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted shadow-xl transition-transform duration-500 group-hover:scale-110">
									<img
										src={image || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
										alt={name}
										className="h-full w-full object-cover"
									/>
								</div>
								{verified && (
									<div className="absolute bottom-1 right-1 rounded-full bg-background p-1 shadow-lg">
										<CheckCircle2 className="h-5 w-5 fill-primary text-background" />
									</div>
								)}
							</div>

							{/* Vendor Info */}
							<div className="mt-4 text-center">
								<h3 className="font-serif text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
									{name}
								</h3>
								<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 mt-1">
									{category}
								</p>
							</div>

							{/* Stats Row */}
							<div className="mt-6 flex w-full justify-around border-y border-border/40 py-4 font-mono text-sm">
								<div className="flex flex-col items-center gap-1">
									<div className="flex items-center gap-1 font-bold text-amber-500">
										<Star className="h-3 w-3 fill-current" />
										{rating}
									</div>
									<span className="text-[9px] uppercase tracking-widest text-muted-foreground">Rating</span>
								</div>
								<div className="flex flex-col items-center gap-1">
									<div className="flex items-center gap-1 font-bold">
										<Users className="h-3 w-3" />
										{(followers / 1000).toFixed(1)}k
									</div>
									<span className="text-[9px] uppercase tracking-widest text-muted-foreground">Followers</span>
								</div>
								<div className="flex flex-col items-center gap-1">
									<div className="flex items-center gap-1 font-bold">
										<ShoppingBag className="h-3 w-3" />
										{productCount}
									</div>
									<span className="text-[9px] uppercase tracking-widest text-muted-foreground">Items</span>
								</div>
							</div>

							{/* Description */}
							<p className="mt-6 line-clamp-2 text-sm text-muted-foreground italic leading-relaxed">
								&ldquo;{description}&rdquo;
							</p>

							{location && (
								<div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									<MapPin className="h-3 w-3" />
									{location}
								</div>
							)}

							<Button
								variant="outline"
								className="mt-8 w-full rounded-full border-primary/20 bg-primary/5 hover:bg-primary hover:text-white transition-all duration-300"
							>
								Visit Boutique
							</Button>
						</div>
					</Link>
				</div>
			</Card>
		</motion.div>
	);
}
