import { ROLES } from "@/constants/roles";
import { z } from "zod";

const roleSchema = z.enum(ROLES, { error: "Please select a valid role" });

export const settingsSchema = z
    .object({
        fullName: z
            .string()
            .min(2, "Full name must be at least 2 characters")
            .max(80, "Full name must be under 80 characters")
            .regex(/^[a-zA-Z\s'-]+$/, { error: "Name can only contain letters, spaces, hyphens, and apostrophes" }),

        email: z.string().min(1, "Email is required").email("Please enter a valid email address"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
            .regex(/[0-9]/, { error: "Password must contain at least one number" })
            .or(z.literal("")),

        confirmPassword: z.string(),

        role: roleSchema,

        marketingEmails: z.boolean(),

        bio: z.string().max(300, "Bio must be under 300 characters").optional(),
    })
    .superRefine((data, ctx) => {
        if (data.password && data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }
    });

export type SettingsFormData = z.infer<typeof settingsSchema>;
