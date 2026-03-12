import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/services/profile.api";
import type { SettingsFormData } from "@/schemas/settings.schema";

export const profileKeys = {
    profile: ["profile"] as const,
};

export function useProfileQuery() {
    return useQuery({
        queryKey: profileKeys.profile,
        queryFn: getProfile,
    });
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SettingsFormData) => updateProfile(data),
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: profileKeys.profile });
            }
        },
    });
}
