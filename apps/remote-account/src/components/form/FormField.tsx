import React from "react";
import type { FieldError } from "react-hook-form";

type FormFieldProps = {
    label: string;
    htmlFor: string;
    error?: FieldError;
    required?: boolean;
    hint?: string;
    children: React.ReactNode;
};

export function FormField({ label, htmlFor, error, required, hint, children }: FormFieldProps) {
    const errorId = `${htmlFor}-error`;
    const hintId = `${htmlFor}-hint`;

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={htmlFor}
                className="text-foreground text-sm font-medium"
            >
                {label}
                {required && (
                    <span
                        className="text-destructive ml-1"
                        aria-hidden="true"
                    >
                        *
                    </span>
                )}
            </label>

            {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
                      "aria-describedby":
                          [hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined,
                      "aria-invalid": error ? true : undefined,
                  })
                : children}

            {hint && (
                <p
                    id={hintId}
                    className="text-foreground-muted text-xs"
                >
                    {hint}
                </p>
            )}

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-destructive text-xs font-medium"
                >
                    {error.message}
                </p>
            )}
        </div>
    );
}
