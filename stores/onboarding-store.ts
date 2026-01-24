import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type UserRole = "buyer" | "vendor";

interface OnboardingState {
	currentStep: number;
	totalSteps: number;
	userRole: UserRole | null;
	stepData: Record<string, Record<string, unknown>>;
	completedSteps: Set<string>;
	isLoading: boolean;
	errors: Record<string, string>;
	hydrated: boolean;

	// Actions
	setRole: (role: UserRole) => void;
	nextStep: () => void;
	prevStep: () => void;
	goToStep: (step: number) => void;
	setStepData: (stepId: string, data: Record<string, unknown>) => void;
	setError: (stepId: string, error: string) => void;
	clearError: (stepId: string) => void;
	setLoading: (loading: boolean) => void;
	reset: () => void;
	isStepCompleted: (stepId: string) => boolean;
	canProceedToNext: (currentStepId?: string) => boolean;
	getAllFormData: () => Record<string, unknown>;
	setHydrated: (hydrated: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
	devtools(
		persist(
			(set, get) => ({
				currentStep: 0,
				totalSteps: 0,
				userRole: null,
				stepData: {},
				completedSteps: new Set(),
				isLoading: false,
				errors: {},
				hydrated: false,

				setRole: (role) =>
					set({
						userRole: role,
						totalSteps: role === "vendor" ? 6 : 4,
						currentStep: 0,
						stepData: {},
						completedSteps: new Set(),
						errors: {},
					}),

				nextStep: () =>
					set((state) => ({
						currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
					})),

				prevStep: () =>
					set((state) => ({
						currentStep: Math.max(state.currentStep - 1, 0),
					})),

				goToStep: (step) =>
					set((state) => ({
						currentStep: Math.max(0, Math.min(step, state.totalSteps - 1)),
					})),

				setStepData: (stepId, data) =>
					set((state) => ({
						stepData: { ...state.stepData, [stepId]: data },
						completedSteps: new Set([...state.completedSteps, stepId]),
					})),

				setError: (stepId, error) =>
					set((state) => ({
						errors: { ...state.errors, [stepId]: error },
					})),

				clearError: (stepId) =>
					set((state) => {
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const { [stepId]: _, ...rest } = state.errors;
						return { errors: rest };
					}),

				setLoading: (loading) => set({ isLoading: loading }),

				reset: () =>
					set({
						currentStep: 0,
						totalSteps: 0,
						userRole: null,
						stepData: {},
						completedSteps: new Set(),
						isLoading: false,
						errors: {},
					}),

				isStepCompleted: (stepId) => get().completedSteps.has(stepId),

				canProceedToNext: (currentStepId) => {
					const state = get();
					if (currentStepId && state.errors[currentStepId]) return false;
					return state.currentStep < state.totalSteps - 1;
				},

				getAllFormData: () => {
					const state = get();
					return {
						userRole: state.userRole,
						...state.stepData,
					};
				},

				setHydrated: (hydrated) => set({ hydrated }),
			}),
			{
				name: "vendora-onboarding",
				partialize: (state) => ({
					userRole: state.userRole,
					stepData: state.stepData,
					currentStep: state.currentStep,
				}),
				onRehydrateStorage: () => (state) => {
					// Mark as hydrated after rehydration completes
					if (state) {
						state.setHydrated(true);
					}
				},
			}
		),
		{ name: "OnboardingStore" }
	)
);

// Apply URL role override on mount
if (typeof window !== "undefined") {
	const params = new URLSearchParams(window.location.search);
	const role = params.get("role");
	if (role === "buyer" || role === "vendor") {
		useOnboardingStore.getState().setRole(role);
	}
}
