import React from "react";
import { cn } from "@micro/shared-utils";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ hasError = false, className, ...props }, ref) => (
        <input
            ref={ref}
            className={cn(
                "bg-surface text-foreground block w-full rounded-lg border px-3 py-2.5 text-sm",
                "placeholder:text-foreground-muted",
                "focus:ring-2 focus:outline-none",
                hasError
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-ring focus:ring-ring/20",
                "disabled:bg-muted disabled:text-foreground-muted disabled:cursor-not-allowed",
                className,
            )}
            {...props}
        />
    ),
);

TextInput.displayName = "TextInput";
