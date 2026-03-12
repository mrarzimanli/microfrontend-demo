import React from "react";
import { cn } from "@micro/shared-utils";

export type StatCardProps = {
    label: string;
    value: string | number;
    delta?: string;
    deltaType?: "positive" | "negative" | "neutral";
    icon?: React.ReactNode;
    className?: string;
};

export function StatCard({ label, value, delta, deltaType = "neutral", icon, className }: StatCardProps) {
    const deltaColor = {
        positive: "text-emerald-600",
        negative: "text-red-600",
        neutral: "text-foreground-muted",
    }[deltaType];

    return (
        <div
            className={cn(
                "border-border bg-surface shadow-card rounded-xl border p-5",
                "hover:shadow-card-hover transition-shadow duration-(--motion-base)",
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-foreground-muted text-xs font-medium tracking-wide uppercase">{label}</p>
                    <p className="text-foreground mt-1.5 text-3xl font-bold tracking-tight">{value}</p>
                    {delta && <p className={cn("mt-1 text-xs font-medium", deltaColor)}>{delta}</p>}
                </div>
                {icon && (
                    <div className="bg-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <span className="text-accent-foreground">{icon}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
