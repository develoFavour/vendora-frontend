import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actionLabel?: string;
	actionHref?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	actionHref,
}: EmptyStateProps) {
	return (
		<Card className="p-12 text-center">
			<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
				<Icon className="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 className="mt-6 font-serif text-xl font-semibold">{title}</h3>
			<p className="mt-2 text-muted-foreground">{description}</p>
			{actionLabel && actionHref && (
				<Button className="mt-6" asChild>
					<Link href={actionHref}>{actionLabel}</Link>
				</Button>
			)}
		</Card>
	);
}
