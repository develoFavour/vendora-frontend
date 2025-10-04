import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon: LucideIcon;
	trend?: {
		value: string;
		isPositive: boolean;
	};
	variant?: "primary" | "accent";
}

export function StatCard({
	title,
	value,
	description,
	icon: Icon,
	trend,
	variant = "primary",
}: StatCardProps) {
	return (
		<Card className="p-6">
			<div className="flex items-center justify-between">
				<div
					className={`flex h-12 w-12 items-center justify-center rounded-lg ${
						variant === "primary" ? "bg-primary/10" : "bg-accent/10"
					}`}
				>
					<Icon
						className={`h-6 w-6 ${
							variant === "primary" ? "text-primary" : "text-accent"
						}`}
					/>
				</div>
				{trend && (
					<div
						className={`text-sm font-medium ${
							trend.isPositive ? "text-green-600" : "text-red-600"
						}`}
					>
						{trend.value}
					</div>
				)}
			</div>
			<div className="mt-4">
				<div className="text-2xl font-bold">{value}</div>
				<div className="text-sm text-muted-foreground">{title}</div>
			</div>
			{description && (
				<div className="mt-2 text-xs text-muted-foreground">{description}</div>
			)}
		</Card>
	);
}
