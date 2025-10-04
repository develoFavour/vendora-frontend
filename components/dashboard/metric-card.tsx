import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
	icon: LucideIcon;
	label: string;
	value: string | number;
	variant?: "primary" | "accent";
}

export function MetricCard({
	icon: Icon,
	label,
	value,
	variant = "primary",
}: MetricCardProps) {
	return (
		<Card className="p-6">
			<div className="flex items-center gap-3">
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
				<div>
					<div className="text-sm text-muted-foreground">{label}</div>
					<div className="text-2xl font-bold">{value}</div>
				</div>
			</div>
		</Card>
	);
}
