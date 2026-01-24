import type React from "react";
import { VendorSidebar } from "@/components/vendor/vendor-sidebar";

export default function VendorDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen overflow-hidden">
			<VendorSidebar />
			<main className="flex-1 overflow-y-auto bg-muted/30">{children}</main>
		</div>
	);
}
