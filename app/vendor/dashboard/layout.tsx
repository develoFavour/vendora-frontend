import type React from "react";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";

export default function VendorDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen">
			<VendorSidebar />
			<main className="flex-1 bg-muted/30">{children}</main>
		</div>
	);
}
