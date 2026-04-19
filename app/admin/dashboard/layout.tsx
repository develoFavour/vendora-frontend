import type React from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdminGuard>
			<div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
				<AdminSidebar />
				<div className="flex-1 flex flex-col h-screen overflow-hidden">
					<AdminHeader />
					<main className="flex-1 overflow-auto">{children}</main>
				</div>
			</div>
		</AdminGuard>
	);
}
