"use client";

import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Store, MapPin } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

interface CuratedForYouProps {
    productsLoading: boolean;
    heroProduct1: any;
    heroProduct2: any;
}

export function CuratedForYou({ productsLoading, heroProduct1, heroProduct2 }: CuratedForYouProps) {
	const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		// Deep Parallax scrub (tied absolutely to scroll)
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "top center", // trigger when the top of section hits center of viewport
				end: "bottom top",
				scrub: 1.5,
			}
		});

		tl.to(".curated-text-content", { y: -100, opacity: 0.2 }, 0);
		tl.to(".curated-visual-content", { y: 100, rotate3d: [1, 0, 0, 5] }, 0);
	}, { scope: containerRef });

    return (
        <section 
            ref={sectionRef} 
            className="relative min-h-[90vh] flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-inherit bg-transparent z-10"
        >
            <div ref={containerRef} className="mx-auto max-w-7xl relative z-10 w-full">
                <div className="grid gap-16 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="curated-text-content flex flex-col justify-center">
                        <div>
                            <Badge className="mb-6 w-fit bg-zinc-950 text-white hover:bg-zinc-800 px-4 py-1.5 text-xs font-bold uppercase tracking-widest border border-transparent">
                                Curated For You
                            </Badge>
                        </div>
                        
                        <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-serif leading-[0.9] tracking-tighter mix-blend-difference">
                            Curated.<br />
                            <span className="italic text-primary font-light">Elevated.</span><br />
                            Yours.
                        </h2>
                        
                        <p className="mt-8 text-xl opacity-70 leading-relaxed max-w-lg font-medium">
                            Discover masterpieces tailored to your taste from independent artisans worldwide.
                        </p>
                        
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" asChild className="h-16 px-10 rounded-full text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all w-fit">
                                <Link href="/marketplace">
                                    Explore More
                                    <ArrowUpRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-16 flex flex-wrap items-center gap-10 border-t border-current/10 pt-10">
                            {[
                                { value: "2.5K+", label: "Verified Artisans" },
                                { value: "50K+", label: "Curated Items" },
                                { value: "4.9/5", label: "Average Rating" }
                            ].map((stat, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors">{stat.value}</div>
                                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-50 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Curated visual grid */}
                    <div className="curated-visual-content grid grid-cols-2 gap-4 lg:pl-10 relative perspective-[1000px]">
                        <Card className="col-span-2 overflow-hidden border-2 border-primary/20 p-8 shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-3xl rounded-[2rem] group hover:border-primary/40 transition-colors">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Store className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg leading-none">Artisan Crafts Co.</div>
                                            <div className="text-[10px] uppercase tracking-widest font-bold text-primary mt-1">Featured Boutique</div>
                                        </div>
                                    </div>
                                    <p className="opacity-70 font-medium">Sustainable, handcrafted decor sourced directly from the creators.</p>
                                </div>
                                <Badge className="bg-primary text-white font-bold tracking-widest text-[9px] uppercase hover:bg-primary">Verified</Badge>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50">
                                <MapPin className="h-4 w-4" />
                                Portland, OR
                            </div>
                        </Card>

                        {/* Product 1 */}
                        <div className="hover:-translate-y-2 transition-transform duration-300">
                            <Card className="overflow-hidden p-3 rounded-[2rem] border-current/10 shadow-lg group bg-background h-full">
                                {productsLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton className="aspect-square rounded-[1.5rem]" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                ) : heroProduct1 ? (
                                    <Link href={`/products/${heroProduct1.id}`} className="block h-full">
                                        <div className="aspect-square rounded-[1.5rem] bg-muted overflow-hidden relative">
                                            <img
                                                src={heroProduct1.images?.[0] || "/placeholder-product.png"}
                                                alt={heroProduct1.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="mt-4 px-2 pb-2">
                                            <div className="text-sm font-bold line-clamp-1">{heroProduct1.name}</div>
                                            <div className="text-sm font-semibold opacity-60 mt-1">${heroProduct1.price}</div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="h-full space-y-3">
                                        <div className="aspect-square rounded-[1.5rem] bg-muted" />
                                        <div className="px-2">
                                            <div className="text-sm font-bold">Ceramic Vase</div>
                                            <div className="text-sm opacity-60 mt-1">$45</div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Product 2 */}
                        <div className="hover:-translate-y-2 transition-transform duration-300">
                            <Card className="overflow-hidden p-3 rounded-[2rem] border-current/10 shadow-lg group bg-background h-full">
                                {productsLoading ? (
                                    <div className="space-y-3">
                                        <Skeleton className="aspect-square rounded-[1.5rem]" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                ) : heroProduct2 ? (
                                    <Link href={`/products/${heroProduct2.id}`} className="block h-full">
                                        <div className="aspect-square rounded-[1.5rem] bg-muted overflow-hidden relative">
                                            <img
                                                src={heroProduct2.images?.[0] || "/placeholder-product.png"}
                                                alt={heroProduct2.name}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="mt-4 px-2 pb-2">
                                            <div className="text-sm font-bold line-clamp-1">{heroProduct2.name}</div>
                                            <div className="text-sm font-semibold opacity-60 mt-1">${heroProduct2.price}</div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="h-full space-y-3">
                                        <div className="aspect-square rounded-[1.5rem] bg-muted" />
                                        <div className="px-2">
                                            <div className="text-sm font-bold">Woven Basket</div>
                                            <div className="text-sm opacity-60 mt-1">$32</div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
