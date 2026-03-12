import { Link } from "react-router-dom";
import { Badge, Skeleton } from "@micro/shared-ui";
import { cn } from "@micro/shared-utils";
import type { Product } from "@micro/shared-types";
import { StarRating } from "./StarRating";

type ProductCardProps = {
    product: Product;
    basePath: string;
};

export function ProductCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("border-border bg-surface shadow-card overflow-hidden rounded-xl border", className)}>
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="space-y-2.5 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}

export function ProductCard({ product, basePath }: ProductCardProps) {
    return (
        <Link
            to={`${basePath}/detail/${product.id}`}
            className="group border-border bg-surface shadow-card hover:shadow-card-hover flex flex-col overflow-hidden rounded-xl border transition-shadow duration-(--motion-base)"
        >
            <div className="bg-muted relative aspect-4/3 overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-(--motion-slow) group-hover:scale-105"
                    loading="lazy"
                />
                {!product.inStock && (
                    <div className="bg-foreground/40 absolute inset-0 flex items-center justify-center">
                        <span className="bg-surface/90 text-foreground rounded-full px-3 py-1 text-xs font-semibold">
                            Out of Stock
                        </span>
                    </div>
                )}
                <div className="absolute top-3 left-3">
                    <Badge variant="neutral">{product.category}</Badge>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="text-foreground group-hover:text-primary font-semibold transition-colors">
                    {product.name}
                </h3>
                <p className="text-foreground-muted mt-1 line-clamp-2 text-sm">{product.description}</p>
                <div className="mt-3 flex items-center justify-between">
                    <StarRating rating={product.rating} />
                    <span className="text-foreground text-base font-bold">${product.price.toFixed(2)}</span>
                </div>
            </div>
        </Link>
    );
}
