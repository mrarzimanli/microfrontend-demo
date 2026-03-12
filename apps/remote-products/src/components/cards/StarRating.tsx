import { Star } from "lucide-react";

type StarRatingProps = {
    rating: number;
    size?: "sm" | "md";
};

const sizeClasses = {
    sm: { star: "h-3.5 w-3.5", text: "text-xs", gap: "gap-0.5" },
    md: { star: "h-5 w-5", text: "text-sm", gap: "gap-1" },
};

export function StarRating({ rating, size = "sm" }: StarRatingProps) {
    const { star, text, gap } = sizeClasses[size];
    return (
        <div
            className={`flex items-center ${gap}`}
            aria-label={`${rating.toFixed(1)} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={`${star} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-border"}`}
                    aria-hidden="true"
                />
            ))}
            <span className={`text-foreground-muted ml-1 ${text}`}>{rating.toFixed(1)}</span>
        </div>
    );
}
