import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles
// Using a map for faster lookups: Path -> Allowed Roles
const PROTECTED_ROUTES: Record<string, string[]> = {
	"/admin": ["admin"],
	"/vendor": ["vendor", "seller"], // Accepting both just in case
	"/buyer": ["buyer", "customer"], // Accepting both
	"/dashboard": ["admin", "vendor", "seller", "buyer", "customer"], // Generic dashboard access?
};

// Define public routes that don't need authentication
const PUBLIC_ROUTES = [
	"/login",
	"/signup",
	"/verify",
	"/",
	"/about",
	"/marketplace",
	"/forgot-password",
	"/vendors",
];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 1. Check if the route is public
	// We allow if the path starts with any of the public routes (e.g. /login/something)
	// or matches exactly.
	// Also exclude static files usually.
	const isPublicRoute =
		pathname === "/" ||
		PUBLIC_ROUTES.some(
			(route) => route !== "/" && pathname.startsWith(route)
		) ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".");

	if (isPublicRoute) {
		console.log(`[Middleware] Public route: ${pathname}`);
		return NextResponse.next();
	}

	// 2. Check for Access Token
	const token = request.cookies.get("accessToken")?.value;

	if (!token) {
		console.log(
			`[Middleware] No token found for: ${pathname}, redirecting to /login`
		);
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		url.searchParams.set("redirect", pathname);
		return NextResponse.redirect(url);
	}

	// 3. Decode Token to get Role
	// Since we don't have the secret to verify (it's on backend), we decode the payload.
	// NOTE: This represents "soft" security. Real security is on the API/Page data fetching.
	let userRole = "";
	try {
		const payload = token.split(".")[1];
		if (payload) {
			const decoded = JSON.parse(atob(payload));
			userRole = decoded.role || decoded.user_role || "";
			// Normalize role
			userRole = userRole.toLowerCase();
		}
	} catch (e) {
		console.error("Failed to decode token", e);
		// Invalid token, force login
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	console.log(`[Middleware] User Role: ${userRole}, Path: ${pathname}`);

	// 4. Role-based Access Control
	// Check if path matches any protected route prefix
	const matchRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
		pathname.startsWith(route)
	);

	if (matchRoute) {
		const allowedRoles = PROTECTED_ROUTES[matchRoute];
		if (!allowedRoles.includes(userRole)) {
			console.log(
				`[Middleware] Access denied for role ${userRole} to ${pathname}`
			);
			// Redirect to unauthorized or their own dashboard
			const url = request.nextUrl.clone();

			// Simple redirect based on role
			if (userRole === "admin") url.pathname = "/admin/dashboard";
			else if (userRole === "vendor" || userRole === "seller")
				url.pathname = "/vendor/dashboard";
			else if (userRole === "buyer" || userRole === "customer")
				url.pathname = "/buyer/dashboard";
			else url.pathname = "/"; // Fallback

			return NextResponse.redirect(url);
		}
	}

	// 5. specific logic: if user is logged in and tries to go to /login, redirect to dashboard
	// (This logic actually belongs in the public check, but if we are here we have a token)
	if (pathname === "/login" || pathname === "/signup") {
		const url = request.nextUrl.clone();
		if (userRole === "admin") url.pathname = "/admin/dashboard";
		else if (userRole === "vendor" || userRole === "seller")
			url.pathname = "/vendor/dashboard";
		else url.pathname = "/buyer/dashboard";
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
