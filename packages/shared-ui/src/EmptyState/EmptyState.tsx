import React from "react";
import { cn } from "@micro/shared-utils";

export type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
};

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-xl",
                "border-border border border-dashed py-16 text-center",
                className,
            )}
        >
            {icon && (
                <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full text-2xl">{icon}</div>
            )}
            <div className="max-w-xs space-y-1">
                <p className="text-foreground font-semibold">{title}</p>
                {description && <p className="text-foreground-muted text-sm">{description}</p>}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
