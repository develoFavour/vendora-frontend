// API utility functions and axios client
import axios, { AxiosError } from "axios";

// API utility functions for onboarding
const API_BASE_URL =
	process.env.NEXT_PUBLIC_BASE_API_URL ||
	"https://vendora-backend-production.up.railway.app";
// const API_BASE_URL = "http://localhost:8080";

// Get auth token from localStorage
const getAuthToken = () => {
	if (typeof window !== "undefined") {
		return (
			localStorage.getItem("accessToken") ||
			localStorage.getItem("vendora-auth-token")
		);
	}
	return null;
};

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

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<ErrorPayload>) => {
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
