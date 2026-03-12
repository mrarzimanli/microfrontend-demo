import React from "react";
import { cn } from "@micro/shared-utils";

export type CardProps = {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    hoverable?: boolean;
};

const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
};

export function Card({ children, className, padding = "md", hoverable = false }: CardProps) {
    return (
        <div
            className={cn(
                "border-border bg-surface shadow-card rounded-xl border",
                hoverable && "hover:shadow-card-hover transition-shadow duration-(--motion-base)",
                paddingClasses[padding],
                className,
            )}
        >
            {children}
        </div>
    );
}
