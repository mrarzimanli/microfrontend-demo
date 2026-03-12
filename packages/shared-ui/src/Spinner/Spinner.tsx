import { Loader2 } from "lucide-react";
import { cn } from "@micro/shared-utils";

export type SpinnerProps = {
    size?: "sm" | "md" | "lg";
    className?: string;
    label?: string;
};

const sizeClasses = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export function Spinner({ size = "md", className = "", label = "Loading..." }: SpinnerProps) {
    return (
        <div
            role="status"
            className={cn("flex items-center justify-center", className)}
        >
            <Loader2
                className={cn("animate-spin text-indigo-600", sizeClasses[size])}
                aria-hidden="true"
            />
            <span className="sr-only">{label}</span>
        </div>
    );
}
