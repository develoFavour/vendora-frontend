import type React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SectionCardProps {
	title: string;
	action?: {
		label: string;
		href: string;
	};
	children: React.ReactNode;
}

export function SectionCard({ title, action, children }: SectionCardProps) {
	return (
		<Card className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="font-serif text-xl font-semibold">{title}</h2>
				{action && (
					<Button variant="ghost" size="sm" asChild>
						<Link href={action.href}>{action.label}</Link>
					</Button>
				)}
			</div>
			{children}
		</Card>
	);
}
