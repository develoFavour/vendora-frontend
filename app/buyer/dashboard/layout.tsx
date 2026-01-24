import type React from "react";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";

export default function CustomerDashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen overflow-hidden bg-zinc-950 font-sans selection:bg-primary/30 selection:text-primary-foreground">
			{/* Luxury Background Accents */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
			</div>

			<CustomerSidebar />

			<main className="flex-1 relative min-w-0 overflow-y-auto bg-transparent custom-scrollbar">
				<div className="relative z-10">
					{children}
				</div>
			</main>
		</div>
	);
}
