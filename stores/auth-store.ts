import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface User {
    name: string;
    email: string;
    role: string;
    address?: string;
    id?: string;
    profilePicture?: string;
    bio?: string;
    profile?: {
        profileImage?: string;
        bio?: string;
        location?: string;
    };
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
    clearAuth: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,

                setAuth: (user, accessToken, refreshToken) =>
                    set({
                        user,
                        accessToken,
                        refreshToken: refreshToken || null,
                        isAuthenticated: true,
                    }),

                clearAuth: () =>
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                    }),

                updateUser: (userData) =>
                    set((state) => ({
                        user: state.user ? { ...state.user, ...userData } : null,
                    })),
            }),
            {
                name: "vendora-auth",
            }
        ),
        { name: "AuthStore" }
    )
);
