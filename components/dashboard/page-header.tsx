import type React from "react";
interface PageHeaderProps {
	title: string;
	description?: string;
	actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="mb-8 flex items-start justify-between">
			<div>
				<h1 className="font-serif text-3xl font-bold">{title}</h1>
				{description && (
					<p className="mt-2 text-muted-foreground">{description}</p>
				)}
			</div>
			{actions && <div className="flex gap-3">{actions}</div>}
		</div>
	);
}
