import React from "react";
import { cn } from "@micro/shared-utils";

interface Option {
    value: string;
    label: string;
}

type SelectInputProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    hasError?: boolean;
    options: Option[];
    placeholder?: string;
};

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
    ({ hasError = false, options, placeholder, className, ...props }, ref) => (
        <select
            ref={ref}
            className={cn(
                "bg-surface text-foreground block w-full rounded-lg border px-3 py-2.5 text-sm",
                "focus:ring-2 focus:outline-none",
                hasError
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-border focus:border-ring focus:ring-ring/20",
                "disabled:bg-muted disabled:text-foreground-muted disabled:cursor-not-allowed",
                className,
            )}
            {...props}
        >
            {placeholder && (
                <option
                    value=""
                    disabled
                >
                    {placeholder}
                </option>
            )}
            {options.map((opt) => (
                <option
                    key={opt.value}
                    value={opt.value}
                >
                    {opt.label}
                </option>
            ))}
        </select>
    ),
);
SelectInput.displayName = "SelectInput";
