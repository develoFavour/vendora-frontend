import type React from "react";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";

export default function CustomerDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			<CustomerSidebar />
			<main className="flex-1 bg-muted/30">{children}</main>
		</div>
	);
}
