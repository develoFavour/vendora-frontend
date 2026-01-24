// Onboarding Context - Centralized state management for the entire onboarding flow
"use client";

import React, {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useRef,
} from "react";
import { onboardingDraftAPI } from "@/lib/api";

// Types for our onboarding system
export type UserRole = "buyer" | "vendor";

export interface OnboardingStep {
	id: string;
	title: string;
	description: string;
	component: React.ComponentType<Record<string, never>>;
	isOptional?: boolean;
	validation?: (data: Record<string, unknown>) => boolean | string;
}

export interface OnboardingState {
	currentStep: number;
	totalSteps: number;
	userRole: UserRole | null;
	completedSteps: Set<string>;
	stepData: Record<string, Record<string, unknown>>;
	isLoading: boolean;
	errors: Record<string, string>;
}

type OnboardingAction =
	| { type: "SET_ROLE"; payload: UserRole }
	| { type: "NEXT_STEP" }
	| { type: "PREV_STEP" }
	| { type: "GO_TO_STEP"; payload: number }
	| {
			type: "SET_STEP_DATA";
			payload: { stepId: string; data: Record<string, unknown> };
	  }
	| { type: "SET_LOADING"; payload: boolean }
	| { type: "SET_ERROR"; payload: { stepId: string; error: string } }
	| { type: "CLEAR_ERROR"; payload: string }
	| { type: "RESET_ONBOARDING" };

const initialState: OnboardingState = {
	currentStep: 0,
	totalSteps: 0,
	userRole: null,
	completedSteps: new Set(),
	stepData: {},
	isLoading: false,
	errors: {},
};

function onboardingReducer(
	state: OnboardingState,
	action: OnboardingAction
): OnboardingState {
	switch (action.type) {
		case "SET_ROLE":
			const totalSteps = action.payload === "vendor" ? 6 : 4; // 6 for vendor, 4 for customer
			return {
				...state,
				userRole: action.payload,
				currentStep: 0,
				totalSteps,
				completedSteps: new Set(),
				stepData: {},
				errors: {},
			};

		case "NEXT_STEP":
			const nextStep = Math.min(state.currentStep + 1, state.totalSteps - 1);
			return {
				...state,
				currentStep: nextStep,
				errors: {}, // Clear errors when moving to the next step
			};

		case "PREV_STEP":
			return {
				...state,
				currentStep: Math.max(state.currentStep - 1, 0),
			};

		case "GO_TO_STEP":
			return {
				...state,
				currentStep: Math.max(
					0,
					Math.min(action.payload, state.totalSteps - 1)
				),
			};

		case "SET_STEP_DATA":
			return {
				...state,
				stepData: {
					...state.stepData,
					[action.payload.stepId]: action.payload.data,
				},
				completedSteps: new Set([
					...state.completedSteps,
					action.payload.stepId,
				]),
			};

		case "SET_LOADING":
			return {
				...state,
				isLoading: action.payload,
			};

		case "SET_ERROR":
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.stepId]: action.payload.error,
				},
			};

		case "CLEAR_ERROR":
			const newErrors = { ...state.errors };
			delete newErrors[action.payload];
			return {
				...state,
				errors: newErrors,
			};

		case "RESET_ONBOARDING":
			return initialState;

		default:
			return state;
	}
}

interface OnboardingContextType {
	state: OnboardingState;
	dispatch: React.Dispatch<OnboardingAction>;
	nextStep: () => void;
	prevStep: () => void;
	goToStep: (step: number) => void;
	setStepData: (stepId: string, data: Record<string, unknown>) => void;
	setError: (stepId: string, error: string) => void;
	clearError: (stepId: string) => void;
	setLoading: (loading: boolean) => void;
	isStepCompleted: (stepId: string) => boolean;
	canProceedToNext: (currentStepId?: string) => boolean;
	getAllFormData: () => Record<string, unknown>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
	undefined
);

export function OnboardingProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, dispatch] = useReducer(onboardingReducer, initialState);
	const draftVersionRef = useRef<number>(0);

	// Persist onboarding data to localStorage
	useEffect(() => {
		const savedData = localStorage.getItem("vendora-onboarding");
		if (savedData) {
			try {
				const parsed = JSON.parse(savedData) as {
					userRole?: UserRole;
					stepData?: Record<string, Record<string, unknown>>;
					currentStep?: number;
				};
				if (parsed.userRole) {
					dispatch({ type: "SET_ROLE", payload: parsed.userRole });
				}
				if (parsed.stepData) {
					Object.entries(parsed.stepData).forEach(([stepId, data]) => {
						dispatch({ type: "SET_STEP_DATA", payload: { stepId, data } });
					});
				}
				if (typeof parsed.currentStep === "number") {
					dispatch({ type: "GO_TO_STEP", payload: parsed.currentStep });
				}
			} catch (error) {
				console.error("Error loading onboarding data:", error);
			}
		}
	}, []);

	// Optional role override from URL (?role=customer|vendor)
	useEffect(() => {
		try {
			const params = new URLSearchParams(window.location.search);
			const role = params.get("role");
			if (role === "buyer" || role === "vendor") {
				dispatch({ type: "SET_ROLE", payload: role });
			}
		} catch {}
	}, []);

	useEffect(() => {
		const dataToSave = {
			userRole: state.userRole,
			stepData: state.stepData,
			currentStep: state.currentStep,
		};
		localStorage.setItem("vendora-onboarding", JSON.stringify(dataToSave));
	}, [state.userRole, state.stepData, state.currentStep]);

	// Load server draft when role is known
	useEffect(() => {
		if (!state.userRole) return;
		let cancelled = false;
		(async () => {
			try {
				const role: string = state.userRole as string;
				const draft = await onboardingDraftAPI.get(role);
				if (cancelled || !draft) return;
				// Merge server draft into context
				if (draft.stepData && typeof draft.stepData === "object") {
					Object.entries(
						draft.stepData as Record<string, Record<string, unknown>>
					).forEach(([stepId, data]) => {
						dispatch({ type: "SET_STEP_DATA", payload: { stepId, data } });
					});
				}
				if (typeof draft.step === "number") {
					dispatch({ type: "GO_TO_STEP", payload: draft.step });
				}
				draftVersionRef.current = draft.version ?? 0;
			} catch (e) {
				// Silent failure: localStorage still works
				console.warn("Failed to load onboarding draft:", e);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [state.userRole]);

	// Debounced autosave to server drafts
	useEffect(() => {
		if (!state.userRole) return;
		const timer = setTimeout(async () => {
			try {
				const role: string = state.userRole as string;
				const saved = await onboardingDraftAPI.save({
					role,
					step: state.currentStep,
					stepCompleted: false,
					stepData: state.stepData,
					version: draftVersionRef.current,
				});
				draftVersionRef.current = saved?.version ?? draftVersionRef.current;
			} catch (e) {
				// Leave retry to next change; localStorage remains source of truth offline
				console.warn("Failed to save onboarding draft:", e);
			}
		}, 800);
		return () => clearTimeout(timer);
	}, [state.userRole, state.currentStep, state.stepData]);

	// Read stepIndex from URL once role/totalSteps are known
	useEffect(() => {
		if (!state.userRole || state.totalSteps <= 0) return;
		try {
			const params = new URLSearchParams(window.location.search);
			const idxStr = params.get("stepIndex");
			const idx = idxStr ? parseInt(idxStr, 10) : NaN;
			if (!Number.isNaN(idx)) {
				const clamped = Math.max(0, Math.min(idx, state.totalSteps - 1));
				dispatch({ type: "GO_TO_STEP", payload: clamped });
			}
		} catch {}
		// run once when prerequisites become available
	}, [state.userRole, state.totalSteps]);

	// Sync URL when currentStep changes
	useEffect(() => {
		// Only sync URL step index if we are on an onboarding-related page
		if (!window.location.pathname.includes("/onboarding")) return;

		try {
			const url = new URL(window.location.href);
			url.searchParams.set("stepIndex", String(state.currentStep));
			window.history.replaceState({}, "", url.toString());
		} catch (error) {
			console.error("Error updating URL:", error);
		}
	}, [state.currentStep]);

	const nextStep = () => dispatch({ type: "NEXT_STEP" });
	const prevStep = () => dispatch({ type: "PREV_STEP" });
	const goToStep = (step: number) =>
		dispatch({ type: "GO_TO_STEP", payload: step });
	const setStepData = (stepId: string, data: Record<string, unknown>) =>
		dispatch({ type: "SET_STEP_DATA", payload: { stepId, data } });
	const setError = (stepId: string, error: string) =>
		dispatch({ type: "SET_ERROR", payload: { stepId, error } });
	const clearError = (stepId: string) =>
		dispatch({ type: "CLEAR_ERROR", payload: stepId });
	const setLoading = (loading: boolean) =>
		dispatch({ type: "SET_LOADING", payload: loading });

	const isStepCompleted = (stepId: string) => state.completedSteps.has(stepId);

	const canProceedToNext = (currentStepId?: string) => {
		if (currentStepId && state.errors[currentStepId]) return false;
		return state.currentStep < state.totalSteps - 1;
	};

	const getAllFormData = () => ({
		userRole: state.userRole,
		...state.stepData,
	});

	const contextValue: OnboardingContextType = {
		state,
		dispatch,
		nextStep,
		prevStep,
		goToStep,
		setStepData,
		setError,
		clearError,
		setLoading,
		isStepCompleted,
		canProceedToNext,
		getAllFormData,
	};

	return (
		<OnboardingContext.Provider value={contextValue}>
			{children}
		</OnboardingContext.Provider>
	);
}

export function useOnboarding() {
	const context = useContext(OnboardingContext);
	if (context === undefined) {
		throw new Error("useOnboarding must be used within an OnboardingProvider");
	}
	return context;
}
