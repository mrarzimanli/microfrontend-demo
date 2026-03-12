import React from "react";
import { cn } from "@micro/shared-utils";

export type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    badge?: string;
    className?: string;
};

export function PageHeader({ title, description, actions, badge, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                    {badge && (
                        <span className="bg-accent text-accent-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                            {badge}
                        </span>
                    )}
                </div>
                {description && <p className="text-foreground-muted mt-1 text-sm">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}
