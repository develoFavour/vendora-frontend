import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface GuestCartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    vendor?: string;
}

interface GuestCartState {
    items: GuestCartItem[];
    addItem: (item: GuestCartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useGuestCartStore = create<GuestCartState>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],

                addItem: (item) =>
                    set((state) => {
                        const existing = state.items.find(
                            (i) => i.productId === item.productId
                        );
                        if (existing) {
                            return {
                                items: state.items.map((i) =>
                                    i.productId === item.productId
                                        ? { ...i, quantity: i.quantity + item.quantity }
                                        : i
                                ),
                            };
                        }
                        return { items: [...state.items, item] };
                    }),

                removeItem: (productId) =>
                    set((state) => ({
                        items: state.items.filter((i) => i.productId !== productId),
                    })),

                updateQuantity: (productId, quantity) =>
                    set((state) => ({
                        items:
                            quantity <= 0
                                ? state.items.filter((i) => i.productId !== productId)
                                : state.items.map((i) =>
                                      i.productId === productId ? { ...i, quantity } : i
                                  ),
                    })),

                clearCart: () => set({ items: [] }),

                totalItems: () =>
                    get().items.reduce((sum, i) => sum + i.quantity, 0),

                totalPrice: () =>
                    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
            }),
            {
                name: "vendora-guest-cart", // localStorage key
            }
        ),
        { name: "GuestCartStore" }
    )
);
