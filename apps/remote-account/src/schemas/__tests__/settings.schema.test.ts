import { settingsSchema } from "@/schemas/settings.schema";

/** A fully valid payload — mutate individual fields in each test case. */
const valid = {
    fullName: "Alex Johnson",
    email: "alex@example.com",
    password: "",
    confirmPassword: "",
    role: "editor" as const,
    marketingEmails: false,
    bio: "A short bio.",
};

describe("settingsSchema", () => {
    describe("valid payloads", () => {
        it("accepts a complete, well-formed settings payload", () => {
            expect(settingsSchema.safeParse(valid).success).toBe(true);
        });

        it("accepts an empty password (leave unchanged scenario)", () => {
            expect(settingsSchema.safeParse({ ...valid, password: "", confirmPassword: "" }).success).toBe(true);
        });

        it("accepts matching passwords that meet all requirements", () => {
            const result = settingsSchema.safeParse({
                ...valid,
                password: "Secure1Password",
                confirmPassword: "Secure1Password",
            });
            expect(result.success).toBe(true);
        });

        it("accepts an omitted bio (optional field)", () => {
            const { bio: _, ...withoutBio } = valid;
            expect(settingsSchema.safeParse(withoutBio).success).toBe(true);
        });
    });

    describe("fullName validation", () => {
        it("rejects names shorter than 2 characters", () => {
            const result = settingsSchema.safeParse({ ...valid, fullName: "A" });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some((i) => i.path[0] === "fullName")).toBe(true);
            }
        });

        it("rejects names longer than 80 characters", () => {
            const result = settingsSchema.safeParse({ ...valid, fullName: "A".repeat(81) });
            expect(result.success).toBe(false);
        });

        it("rejects names containing numbers", () => {
            const result = settingsSchema.safeParse({ ...valid, fullName: "Alex123" });
            expect(result.success).toBe(false);
        });

        it("rejects names containing special characters other than hyphens and apostrophes", () => {
            const result = settingsSchema.safeParse({ ...valid, fullName: "Alex@Johnson" });
            expect(result.success).toBe(false);
        });

        it("accepts names with hyphens and apostrophes", () => {
            const result = settingsSchema.safeParse({ ...valid, fullName: "O'Brien-Smith" });
            expect(result.success).toBe(true);
        });
    });

    describe("email validation", () => {
        it("rejects a missing email", () => {
            const result = settingsSchema.safeParse({ ...valid, email: "" });
            expect(result.success).toBe(false);
        });

        it("rejects a malformed email address", () => {
            const result = settingsSchema.safeParse({ ...valid, email: "not-an-email" });
            expect(result.success).toBe(false);
        });

        it("rejects an email without a domain", () => {
            const result = settingsSchema.safeParse({ ...valid, email: "user@" });
            expect(result.success).toBe(false);
        });
    });

    describe("password validation", () => {
        it("rejects passwords shorter than 8 characters", () => {
            const result = settingsSchema.safeParse({ ...valid, password: "Ab1", confirmPassword: "Ab1" });
            expect(result.success).toBe(false);
        });

        it("rejects passwords without an uppercase letter", () => {
            const result = settingsSchema.safeParse({
                ...valid,
                password: "alllowercase1",
                confirmPassword: "alllowercase1",
            });
            expect(result.success).toBe(false);
        });

        it("rejects passwords without a number", () => {
            const result = settingsSchema.safeParse({
                ...valid,
                password: "NoNumberHere",
                confirmPassword: "NoNumberHere",
            });
            expect(result.success).toBe(false);
        });

        it("rejects mismatched passwords and targets the confirmPassword field", () => {
            const result = settingsSchema.safeParse({
                ...valid,
                password: "Valid1Password",
                confirmPassword: "Different1",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues.some((i) => i.path[0] === "confirmPassword")).toBe(true);
            }
        });

        it("does not report a mismatch when both password fields are empty", () => {
            const result = settingsSchema.safeParse({ ...valid, password: "", confirmPassword: "" });
            expect(result.success).toBe(true);
        });
    });

    describe("role validation", () => {
        it("accepts all defined roles", () => {
            for (const role of ["admin", "editor", "viewer"] as const) {
                expect(settingsSchema.safeParse({ ...valid, role }).success).toBe(true);
            }
        });

        it("rejects an unrecognised role", () => {
            const result = settingsSchema.safeParse({ ...valid, role: "superuser" });
            expect(result.success).toBe(false);
        });
    });

    describe("bio validation", () => {
        it("rejects a bio over 300 characters", () => {
            const result = settingsSchema.safeParse({ ...valid, bio: "x".repeat(301) });
            expect(result.success).toBe(false);
        });

        it("accepts a bio of exactly 300 characters", () => {
            const result = settingsSchema.safeParse({ ...valid, bio: "x".repeat(300) });
            expect(result.success).toBe(true);
        });
    });
});
