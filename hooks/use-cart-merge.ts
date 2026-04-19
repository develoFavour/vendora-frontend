import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartAPI } from "@/lib/api";
import { useGuestCartStore } from "@/stores/guest-cart-store";
import { toast } from "sonner";

/**
 * useCartMerge
 *
 * Call this hook AFTER a successful login/signup.
 * It reads any items from the guest cart (localStorage) and ports them
 * into the authenticated user's server-side cart, then clears the guest cart.
 *
 * KEY: Reads state imperatively via .getState() inside mergeCart() to avoid
 * the stale-closure race condition where isAuthenticated is still `false`
 * at the point mergeCart() is called (right after setAuth()).
 */
export const useCartMerge = () => {
    const queryClient = useQueryClient();

    const mergeCart = useCallback(async () => {
        // Check the token directly in localStorage — this is synchronously set
        // by setAuthTokens() before mergeCart() is called, so it's always fresh.
        // We avoid depending on Zustand's isAuthenticated which can lag one render.
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("accessToken") || localStorage.getItem("vendora-auth-token")
                : null;

        const { items, clearCart } = useGuestCartStore.getState();

        if (!token || items.length === 0) return;

        try {
            // Fire all cart additions in parallel for speed
            await Promise.all(
                items.map((item) =>
                    cartAPI.add({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        name: item.name,
                    })
                )
            );

            // Clear guest cart after successful merge
            clearCart();

            // Invalidate so the real cart query refetches immediately
            queryClient.invalidateQueries({ queryKey: ["cart"] });

            toast.success(
                `${items.length} item${items.length > 1 ? "s" : ""} from your session added to your cart!`
            );
        } catch (error) {
            // Non-blocking — don't fail login just because merge had an issue
            console.error("Cart merge failed:", error);
        }
    }, [queryClient]);

    // Expose pendingItemCount so UI can show a badge/indicator
    const { items } = useGuestCartStore();
    return { mergeCart, pendingItemCount: items.length };
};
