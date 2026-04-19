import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export const useProfile = () => {
    const { isAuthenticated } = useAuthStore();
    return useQuery({
        queryKey: ["profile"],
        queryFn: userAPI.getProfile,
        enabled: isAuthenticated,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { updateUser } = useAuthStore();

    return useMutation({
        mutationFn: userAPI.updateProfile,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });

            // Always sync both locations so sidebar avatar & profile card stay in lockstep
            updateUser({
                name: variables.name,
                profilePicture: variables.profilePicture || "",
                bio: variables.bio,
                profile: {
                    profileImage: variables.profilePicture || "",
                    bio: variables.bio,
                    location: variables.location,
                },
            });

            toast.success("Identity authorization successful!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to authorize specifications.");
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: userAPI.changePassword,
        onSuccess: () => {
            toast.success("Security credentials updated successfully.");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update security credentials.");
        },
    });
};
