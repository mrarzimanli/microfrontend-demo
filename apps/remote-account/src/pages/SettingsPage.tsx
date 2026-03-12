import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@micro/shared-utils";
import { PageHeader, FormSkeleton, Skeleton, Alert } from "@micro/shared-ui";
import { FormField, TextInput, SelectInput, ToggleSwitch } from "@/components/form";
import { settingsSchema, type SettingsFormData } from "@/schemas/settings.schema";
import { ROLE_OPTIONS } from "@/constants/roles";
import { ACCOUNT_ROUTES } from "@/constants/routes";
import { useProfileQuery, useUpdateProfileMutation } from "@/queries/profile.queries";

interface Props {
    basePath: string;
}

function SettingsSkeleton() {
    return (
        <div className="border-border bg-surface shadow-card rounded-xl border">
            <div className="border-border border-b px-6 py-5">
                <Skeleton className="h-4 w-40" />
            </div>
            <div className="p-6">
                <FormSkeleton fields={6} />
            </div>
        </div>
    );
}

export function SettingsPage({ basePath }: Props) {
    const { data: profile, isLoading: profileLoading } = useProfileQuery();
    const mutation = useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors, isSubmitting, isDirty },
        reset,
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        values: profile
            ? {
                  fullName: profile.fullName,
                  email: profile.email,
                  role: profile.role,
                  bio: profile.bio,
                  marketingEmails: profile.marketingEmails,
                  password: "",
                  confirmPassword: "",
              }
            : undefined,
        mode: "onTouched",
    });

    const isDisabled = isSubmitting || mutation.isPending;
    const showSuccess = mutation.isSuccess && mutation.data?.success;

    async function onSubmit(data: SettingsFormData) {
        const result = await mutation.mutateAsync(data);

        if (!result.success) {
            setError(result.serverError.field as keyof SettingsFormData, {
                type: "server",
                message: result.serverError.message,
            });
            return;
        }

        reset(data);
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Account settings"
                description="Manage your profile information and preferences."
                actions={
                    <Link
                        to={`${basePath}${ACCOUNT_ROUTES.PROFILE}`}
                        className="border-border text-foreground-muted hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Back to profile
                    </Link>
                }
            />

            {showSuccess && (
                <Alert
                    variant="success"
                    title="Settings saved!"
                >
                    Your profile has been updated successfully.
                </Alert>
            )}

            {profileLoading ? (
                <SettingsSkeleton />
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="border-border bg-surface shadow-card rounded-xl border"
                >
                    <div className="border-border border-b px-6 py-5">
                        <h2 className="text-foreground-muted text-xs font-semibold tracking-widest uppercase">
                            Personal Information
                        </h2>
                    </div>

                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                        <FormField
                            label="Full Name"
                            htmlFor="fullName"
                            error={errors.fullName}
                            required
                        >
                            <TextInput
                                id="fullName"
                                type="text"
                                placeholder="Alex Johnson"
                                autoComplete="name"
                                disabled={isDisabled}
                                hasError={!!errors.fullName}
                                {...register("fullName")}
                            />
                        </FormField>

                        <FormField
                            label="Email Address"
                            htmlFor="email"
                            error={errors.email}
                            required
                            // hint='Use "taken@example.com" to simulate a server validation error.'
                        >
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={isDisabled}
                                hasError={!!errors.email}
                                {...register("email")}
                            />
                        </FormField>

                        <FormField
                            label="New Password"
                            htmlFor="password"
                            error={errors.password}
                            // hint="Leave blank to keep your current password"
                        >
                            <TextInput
                                id="password"
                                type="password"
                                placeholder="At least 8 characters, 1 uppercase, 1 number"
                                autoComplete="new-password"
                                disabled={isDisabled}
                                hasError={!!errors.password}
                                {...register("password")}
                            />
                        </FormField>

                        <FormField
                            label="Confirm New Password"
                            htmlFor="confirmPassword"
                            error={errors.confirmPassword}
                        >
                            <TextInput
                                id="confirmPassword"
                                type="password"
                                placeholder="Repeat new password"
                                autoComplete="new-password"
                                disabled={isDisabled}
                                hasError={!!errors.confirmPassword}
                                {...register("confirmPassword")}
                            />
                        </FormField>

                        <FormField
                            label="Role"
                            htmlFor="role"
                            error={errors.role}
                            required
                        >
                            <SelectInput
                                id="role"
                                options={ROLE_OPTIONS}
                                placeholder="Select a role..."
                                disabled={isDisabled}
                                hasError={!!errors.role}
                                {...register("role")}
                            />
                        </FormField>

                        <div className="sm:col-span-2">
                            <FormField
                                label="Bio"
                                htmlFor="bio"
                                error={errors.bio}
                                hint="Short bio shown on your profile (max 300 characters)."
                            >
                                <textarea
                                    id="bio"
                                    rows={3}
                                    placeholder="Tell others a bit about yourself..."
                                    disabled={isDisabled}
                                    className={cn(
                                        "bg-surface text-foreground block w-full rounded-lg border px-3 py-2.5 text-sm",
                                        "placeholder:text-foreground-muted resize-none",
                                        "transition-colors focus:ring-2 focus:outline-none",
                                        errors.bio
                                            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                                            : "border-border focus:border-ring focus:ring-ring/20",
                                        "disabled:bg-muted disabled:cursor-not-allowed",
                                    )}
                                    {...register("bio")}
                                />
                            </FormField>
                        </div>
                    </div>

                    <div className="border-border border-t px-6 py-5">
                        <h2 className="text-foreground-muted text-xs font-semibold tracking-widest uppercase">
                            Preferences
                        </h2>
                    </div>

                    <div className="px-6 pb-6">
                        <Controller
                            name="marketingEmails"
                            control={control}
                            render={({ field }) => (
                                <ToggleSwitch
                                    id="marketingEmails"
                                    label="Marketing emails"
                                    description="Receive product updates, tips, and promotional offers."
                                    checked={field.value}
                                    disabled={isDisabled}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>

                    <div className="border-border flex items-center justify-between border-t px-6 py-4">
                        <p className="text-foreground-muted text-xs">
                            {isDirty ? "You have unsaved changes." : "No unsaved changes."}
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                disabled={isDisabled || !isDirty}
                                onClick={() => reset()}
                                className="border-border text-foreground-muted hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={isDisabled}
                                className="bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-ring inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDisabled ? (
                                    <>
                                        <Loader2
                                            className="h-4 w-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
