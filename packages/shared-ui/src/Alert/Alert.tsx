import React from "react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@micro/shared-utils";

export type AlertProps = {
    variant?: "success" | "error" | "warning" | "info";
    title?: string;
    children: React.ReactNode;
    className?: string;
};

const variantStyles: Record<NonNullable<AlertProps["variant"]>, { wrapper: string; icon: React.ReactNode }> = {
    success: {
        wrapper: "bg-green-50 border-green-200 text-green-800",
        icon: (
            <CheckCircle
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
            />
        ),
    },
    error: {
        wrapper: "bg-red-50 border-red-200 text-red-800",
        icon: (
            <XCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
            />
        ),
    },
    warning: {
        wrapper: "bg-yellow-50 border-yellow-200 text-yellow-800",
        icon: (
            <AlertTriangle
                className="h-5 w-5 text-yellow-500"
                aria-hidden="true"
            />
        ),
    },
    info: {
        wrapper: "bg-blue-50 border-blue-200 text-blue-800",
        icon: (
            <Info
                className="h-5 w-5 text-blue-500"
                aria-hidden="true"
            />
        ),
    },
};

export function Alert({ variant = "info", title, children, className = "" }: AlertProps) {
    const { wrapper, icon } = variantStyles[variant];
    return (
        <div
            role="alert"
            className={cn("flex gap-3 rounded-md border p-4", wrapper, className)}
        >
            <div className="shrink-0 pt-0.5">{icon}</div>
            <div>
                {title && <p className="mb-1 font-semibold">{title}</p>}
                <div className="text-sm">{children}</div>
            </div>
        </div>
    );
}
