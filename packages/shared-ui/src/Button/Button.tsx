import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@micro/shared-utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: React.ReactNode;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: [
        "bg-primary text-primary-foreground",
        "hover:bg-primary-hover",
        "focus-visible:ring-primary",
        "disabled:opacity-50",
    ].join(" "),
    secondary: [
        "bg-secondary text-secondary-foreground border border-border",
        "hover:bg-secondary-hover",
        "focus-visible:ring-ring",
        "disabled:opacity-50",
    ].join(" "),
    danger: [
        "bg-destructive text-destructive-foreground",
        "hover:opacity-90",
        "focus-visible:ring-destructive",
        "disabled:opacity-50",
    ].join(" "),
    ghost: [
        "bg-transparent text-foreground-muted",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-ring",
        "disabled:opacity-50",
    ].join(" "),
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9 px-4 text-sm gap-2",
    lg: "h-11 px-6 text-base gap-2",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium",
                "transition-all duration-(--motion-base)",
                "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                "disabled:cursor-not-allowed",
                variantClasses[variant],
                sizeClasses[size],
                className,
            )}
            {...props}
        >
            {loading && (
                <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
}
