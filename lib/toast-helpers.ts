/**
 * Toast helper utilities for modern UX with proper error handling
 */
import { toast } from "sonner";

/**
 * Error extraction utility
 */
export const extractErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "An unexpected error occurred. Please try again.";
};

/**
 * Wrapper around toast.promise that provides modern UX while allowing error handling
 * 
 * @example
 * ```typescript
 * const result = await toastPromise(
 *   apiCall(),
 *   {
 *     loading: "Saving...",
 *     success: "Saved!",
 *     error: "Failed to save"
 *   }
 * );
 * // result is either the data or throws the error for you to handle
 * ```
 */
export async function toastPromise<T>(
	promise: Promise<T>,
	messages: {
		loading: string;
		success: string;
		error?: string | ((error: unknown) => string);
	}
): Promise<T> {
	const toastId = toast.loading(messages.loading);

	try {
		const result = await promise;
		toast.success(messages.success, { id: toastId });
		return result;
	} catch (error) {
		const errorMessage =
			typeof messages.error === "function"
				? messages.error(error)
				: messages.error || extractErrorMessage(error);

		toast.error(errorMessage, { id: toastId });
		throw error; // Re-throw so caller can handle it
	}
}

/**
 * Alternative: Fire-and-forget toast promise (doesn't re-throw)
 * Use this when you don't need to handle errors in the caller
 */
export async function toastPromiseSafe<T>(
	promise: Promise<T>,
	messages: {
		loading: string;
		success: string;
		error?: string | ((error: unknown) => string);
	}
): Promise<T | null> {
	try {
		return await toastPromise(promise, messages);
	} catch {
		return null;
	}
}
