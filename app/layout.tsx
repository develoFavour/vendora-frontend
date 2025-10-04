import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const playfair = Playfair_Display({
	subsets: ["latin"],
	variable: "--font-playfair",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Vendora - Empowering Independent Sellers",
	description:
		"A multi-vendor marketplace connecting conscious consumers with independent sellers",
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}
			>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
