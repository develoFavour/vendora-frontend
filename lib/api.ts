// API utility functions and axios client
import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/auth-store";

// API utility functions for onboarding
// const API_BASE_URL =
// 	process.env.NEXT_PUBLIC_BASE_API_URL ||
// 	"https://vendora-backend-production.up.railway.app";
const API_BASE_URL = "http://localhost:8080";

// Get auth token from localStorage or cookies
export const getAuthToken = () => {
	if (typeof window !== "undefined") {
		return (
			localStorage.getItem("accessToken") ||
			localStorage.getItem("vendora-auth-token") ||
			getCookie("accessToken")
		);
	}
	return null;
};

// Get refresh token from localStorage or cookies
export const getRefreshToken = () => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("refreshToken") || getCookie("refreshToken");
	}
	return null;
};

// Set auth tokens in localStorage and cookies
export const setAuthTokens = (accessToken: string, refreshToken?: string) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("accessToken", accessToken);
		setCookie("accessToken", accessToken, 1); // Expires in 1 day

		if (refreshToken) {
			localStorage.setItem("refreshToken", refreshToken);
			setCookie("refreshToken", refreshToken, 7); // Expires in 7 days
		}

		// Update Zustand store (preserving existing user)
		const currentStore = useAuthStore.getState();
		if (currentStore.user) {
			currentStore.setAuth(currentStore.user, accessToken, refreshToken || currentStore.refreshToken || undefined);
		}
	}
};

// Clear auth tokens from localStorage and cookies
export const clearAuthTokens = () => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("vendora-auth-token");
		deleteCookie("accessToken");
		deleteCookie("refreshToken");
		// Also clear Zustand store
		useAuthStore.getState().clearAuth();
	}
};

// Cookie helpers
function setCookie(name: string, value: string, days: number) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

function getCookie(name: string) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function deleteCookie(name: string) {
	document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// Onboarding draft API (autosave/resume)
export const onboardingDraftAPI = {
	// Fetch latest draft for current user (optionally by role)
	get: async (role?: string) => {
		const res = await api.get("/api/v1/onboarding/draft", {
			params: role ? { role } : undefined,
		});
		// Normalized backend shape returns { success, data }
		return res.data?.data as {
			id: string;
			userID: string;
			role: string;
			step: number;
			stepCompleted: boolean;
			stepData:
			| Record<string, Record<string, unknown>>
			| Record<string, unknown>;
			version: number;
			updatedAt: string;
		} | null;
	},

	// Upsert current draft
	save: async (payload: {
		role: string;
		step: number;
		stepCompleted: boolean;
		stepData: Record<string, unknown> | Record<string, Record<string, unknown>>;
		version?: number;
	}) => {
		const res = await api.post("/api/v1/onboarding/draft", payload);
		return res.data?.data as {
			id: string;
			userID: string;
			role: string;
			step: number;
			stepCompleted: boolean;
			stepData:
			| Record<string, Record<string, unknown>>
			| Record<string, unknown>;
			version: number;
			updatedAt: string;
		};
	},
};

// Auth API functions
export const authAPI = {
	// Refresh access token using refresh token
	refreshToken: async (refreshToken: string) => {
		const res = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
			refreshToken,
		});
		return res.data;
	},
};

// Axios instance with interceptors
export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
	const token = getAuthToken();
	if (token) {
		config.headers = config.headers || {};
		(config.headers as Record<string, string>)[
			"Authorization"
		] = `Bearer ${token}`;
	}
	return config;
});

type ErrorPayload = { message?: string; error?: string };

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token!);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<ErrorPayload>) => {
		const originalRequest = error.config as any;

		// If error is 401 and we haven't tried refreshing yet
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, add to queue
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = getRefreshToken();
			if (!refreshToken) {
				clearAuthTokens();
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				return Promise.reject(error);
			}

			try {
				const response = await authAPI.refreshToken(refreshToken);
				const newAccessToken = response.data?.accessToken;

				if (newAccessToken) {
					setAuthTokens(newAccessToken, refreshToken);
					processQueue(null, newAccessToken);
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
					return api(originalRequest);
				}
			} catch (refreshError) {
				processQueue(refreshError, null);
				clearAuthTokens();
				// Redirect to login or handle logout
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// Normalize error message
		const payload = error.response?.data;
		const message =
			payload?.message || payload?.error || error.message || "Request failed";
		return Promise.reject(new Error(message));
	}
);

// (legacy fetch helper removed)

// Customer onboarding API functions
export const customerOnboardingAPI = {
	// Update user interests
	updateInterests: async (categories: string[]) => {
		const res = await api.post("/api/v1/onboarding/interests", { categories });
		return res.data;
	},

	// Update user preferences
	updatePreferences: async (preferences: {
		budgetRange: string;
		shoppingFrequency: string;
		specialPrefs?: Record<string, boolean>;
	}) => {
		const res = await api.post("/api/v1/onboarding/preference", preferences);
		return res.data;
	},

	// Complete onboarding and update profile
	completeOnboarding: async (profileData: {
		location: string;
		bio: string;
		profilePicture?: File;
	}) => {
		const formData = new FormData();

		if (profileData.profilePicture) {
			formData.append("profile_picture", profileData.profilePicture);
		}

		formData.append("location", profileData.location);
		formData.append("bio", profileData.bio);

		const res = await api.post("/api/v1/onboarding/profile", formData);
		return res.data;
	},
};

// Seller onboarding API functions
export const sellerOnboardingAPI = {
	// Update business type, size, and experience
	updateBusinessType: async (businessInfo: {
		type: string;
		size: string;
		experience: string;
	}) => {
		const res = await api.post(
			"/api/v1/onboarding/seller/business-type",
			businessInfo
		);
		return res.data;
	},

	// Update business categories
	updateCategories: async (categories: string[]) => {
		const res = await api.post("/api/v1/onboarding/seller/business-category", {
			categories,
		});
		return res.data;
	},

	// Update business details
	updateBusinessDetails: async (businessDetails: {
		businessName: string;
		description: string;
		location: string;
		url?: string;
	}) => {
		const res = await api.post(
			"/api/v1/onboarding/seller/business-details",
			businessDetails
		);
		return res.data;
	},

	// Update store details including logo
	updateStoreDetails: async (storeData: {
		storeName: string;
		storeDescription: string;
		primaryColor?: string;
		accentColor?: string;
		storeLogo?: File;
	}) => {
		const formData = new FormData();

		formData.append("storeName", storeData.storeName);
		formData.append("storeDescription", storeData.storeDescription);

		if (storeData.primaryColor) {
			formData.append("primaryColor", storeData.primaryColor);
		}

		if (storeData.accentColor) {
			formData.append("accentColor", storeData.accentColor);
		}

		if (storeData.storeLogo) {
			formData.append("storeLogo", storeData.storeLogo);
		}

		const res = await api.post(
			"/api/v1/onboarding/seller/store-details",
			formData
		);
		return res.data;
	},

	// Submit verification documents
	submitVerification: async (verificationData: {
		idDocument: File;
		selfieVerification?: File;
	}) => {
		const formData = new FormData();
		formData.append("idDocument", verificationData.idDocument);
		if (verificationData.selfieVerification) {
			formData.append("selfieVerification", verificationData.selfieVerification);
		}

		const res = await api.post(
			"/api/v1/onboarding/seller/verification",
			formData
		);
		return res.data;
	},
};
// Product API functions
export const productAPI = {
	create: async (productData: any) => {
		const res = await api.post("/api/v1/products", productData);
		return res.data;
	},
	listVendorProducts: async (params?: { page?: number; limit?: number; query?: string }) => {
		const res = await api.get("/api/v1/products", { params });
		return res.data;
	},
	get: async (id: string) => {
		const res = await api.get(`/api/v1/products/${id}`);
		return res.data;
	},
	update: async (id: string, productData: any) => {
		const res = await api.put(`/api/v1/products/${id}`, productData);
		return res.data;
	},
	delete: async (id: string) => {
		const res = await api.delete(`/api/v1/products/${id}`);
		return res.data;
	},
};

// Category API functions
export const categoryAPI = {
	list: async () => {
		const res = await api.get("/api/v1/categories");
		return res.data;
	},
};

// Media API functions
export const mediaAPI = {
	upload: async (file: File) => {
		const formData = new FormData();
		formData.append("image", file);
		const res = await api.post("/api/v1/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return res.data; // Expected { success, url, size, type }
	},
};

// Wishlist API functions
export const wishlistAPI = {
	add: async (productId: string) => {
		const res = await api.post("/api/v1/wishlist", { productId });
		return res.data;
	},
	remove: async (productId: string) => {
		const res = await api.delete(`/api/v1/wishlist/${productId}`);
		return res.data;
	},
	get: async () => {
		const res = await api.get("/api/v1/wishlist");
		return res.data;
	},
};

// Cart API functions
export const cartAPI = {
	add: async (item: { productId: string; quantity: number; price: number; name: string }) => {
		const res = await api.post("/api/v1/cart", item);
		return res.data;
	},
	remove: async (productId: string) => {
		const res = await api.delete(`/api/v1/cart/${productId}`);
		return res.data;
	},
	get: async () => {
		const res = await api.get("/api/v1/cart");
		return res.data;
	},
	updateQuantity: async (productId: string, quantity: number) => {
		const res = await api.put(`/api/v1/cart/${productId}`, { quantity });
		return res.data;
	},
	clear: async () => {
		const res = await api.delete("/api/v1/cart");
		return res.data;
	},
};

// Order API functions
export const orderAPI = {
	place: async (orderData: { shippingAddress: string; paymentMethod: string }) => {
		const res = await api.post("/api/v1/orders", orderData);
		return res.data;
	},
	list: async () => {
		const res = await api.get("/api/v1/orders");
		return res.data;
	},
	get: async (id: string) => {
		const res = await api.get(`/api/v1/orders/${id}`);
		return res.data;
	},
	confirmReceipt: async (id: string) => {
		const res = await api.put(`/api/v1/orders/${id}/confirm-receipt`);
		return res.data;
	},
};

// Payment API functions
export const paymentAPI = {
	createIntent: async (orderId: string) => {
		const res = await api.post("/api/v1/payments/create-intent", { orderId });
		return res.data;
	},
};

// Vendor Order API functions
export const vendorOrdersAPI = {
	list: async () => {
		const res = await api.get("/api/v1/vendor/orders");
		return res.data;
	},
	stats: async () => {
		const res = await api.get("/api/v1/vendor/orders/stats");
		return res.data;
	},
	get: async (id: string) => {
		const res = await api.get(`/api/v1/vendor/orders/${id}`);
		return res.data;
	},
	updateStatus: async (id: string, status: string, trackingNumber?: string) => {
		const res = await api.put(`/api/v1/vendor/orders/${id}/status`, { status, trackingNumber });
		return res.data;
	},
};
