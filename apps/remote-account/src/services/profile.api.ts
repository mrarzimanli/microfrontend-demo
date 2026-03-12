import { delay } from "@micro/shared-utils";
import { MOCK_PROFILE } from "@/data/profile";
import type { SettingsFormData } from "@/schemas/settings.schema";
import type { MutationOutcome, UserProfile } from "@micro/shared-types";

// Simulated network latency
const API_DELAY = {
    FETCH: 800,
    UPDATE: 1200,
} as const;

// Email used to trigger a server-side conflict response
const CONFLICT_EMAIL_FIXTURE = "taken@example.com";

let currentProfile = { ...MOCK_PROFILE };

export async function getProfile(): Promise<UserProfile> {
    await delay(API_DELAY.FETCH);
    return { ...currentProfile };
}

export async function updateProfile(data: SettingsFormData): Promise<MutationOutcome> {
    await delay(API_DELAY.UPDATE);

    if (data.email === CONFLICT_EMAIL_FIXTURE) {
        return {
            success: false,
            serverError: {
                field: "email",
                message: "This email address is already in use by another account.",
            },
        };
    }

    currentProfile = {
        ...currentProfile,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        bio: data.bio ?? "",
        marketingEmails: data.marketingEmails,
    };

    return { success: true };
}
