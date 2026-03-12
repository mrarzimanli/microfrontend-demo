import { AlertTriangle } from "lucide-react";
import { cn } from "@micro/shared-utils";

export type ErrorStateProps = {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
};

export function ErrorState({
    title = "Something went wrong",
    message = "An unexpected error occurred. Please try again.",
    onRetry,
    className,
}: ErrorStateProps) {
    return (
        <div
            role="alert"
            className={cn(
                "flex flex-col items-center justify-center gap-4 rounded-xl",
                "border border-red-200 bg-red-50 py-16 text-center",
                className,
            )}
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle
                    className="h-7 w-7 text-red-500"
                    aria-hidden="true"
                />
            </div>
            <div className="max-w-xs space-y-1">
                <p className="font-semibold text-red-900">{title}</p>
                <p className="text-sm text-red-700">{message}</p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className={cn(
                        "rounded-md px-4 py-2 text-sm font-medium",
                        "bg-red-600 text-white hover:bg-red-700",
                        "transition-colors duration-(--motion-base)",
                        "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none",
                    )}
                >
                    Try again
                </button>
            )}
        </div>
    );
}
