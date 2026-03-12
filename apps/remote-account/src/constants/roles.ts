import type { UserRole } from "@micro/shared-types";

const ROLE_LABELS: Record<UserRole, string> = {
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
};

export const ROLES = ["admin", "editor", "viewer"] as const satisfies readonly UserRole[];

export const ROLE_OPTIONS = ROLES.map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
}));
