import { cn } from "@micro/shared-utils";

export type SkeletonProps = {
    className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            aria-hidden="true"
            className={cn("bg-muted animate-pulse rounded-md", className)}
        />
    );
}

export function StatCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("border-border bg-surface shadow-card rounded-xl border p-5", className)}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
        </div>
    );
}

export function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
    return (
        <div className={cn("space-y-6", className)}>
            {Array.from({ length: fields }).map((_, i) => (
                <div
                    key={i}
                    className="space-y-1.5"
                >
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-9 w-full" />
                </div>
            ))}
        </div>
    );
}
