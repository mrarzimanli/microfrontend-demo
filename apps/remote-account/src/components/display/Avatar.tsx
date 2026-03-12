import { getInitials, cn } from "@micro/shared-utils";

type AvatarProps = {
    name: string;
    size?: "sm" | "md" | "lg";
    className?: string;
};

const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-20 w-20 text-xl",
};

export function Avatar({ name, size = "lg", className = "" }: AvatarProps) {
    return (
        <div
            className={cn(
                "bg-primary text-primary-foreground flex shrink-0 items-center justify-center rounded-full font-bold",
                sizeClasses[size],
                className,
            )}
        >
            {getInitials(name)}
        </div>
    );
}
