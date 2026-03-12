import React from "react";
import { cn } from "@micro/shared-utils";

export type BadgeProps = {
    variant?: "success" | "warning" | "error" | "info" | "neutral" | "accent";
    children: React.ReactNode;
    className?: string;
};

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-800",
    neutral: "bg-muted text-muted-foreground",
    accent: "bg-accent text-accent-foreground",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                variantClasses[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}
