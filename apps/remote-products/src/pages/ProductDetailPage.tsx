import { useParams, Link } from "react-router-dom";
import { Package, ArrowLeft } from "lucide-react";
import { Badge, Button, EmptyState, Skeleton, ErrorState } from "@micro/shared-ui";
import { useProductQuery } from "@/queries/products.queries";
import { PRODUCT_ROUTES } from "@/constants/routes";
import { StarRating } from "@/components/cards";

type ProductDetailPageProps = {
    basePath: string;
};

function ProductDetailSkeleton() {
    return (
        <div className="grid gap-10 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex flex-col gap-5">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-9 w-3/4" />
                </div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-11 w-full rounded-xl" />
            </div>
        </div>
    );
}

export function ProductDetailPage({ basePath }: ProductDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const listPath = `${basePath}${PRODUCT_ROUTES.LIST}`;

    const { data: product, isLoading, isError, error, refetch } = useProductQuery(id ?? "");

    return (
        <div className="space-y-6">
            <nav
                className="text-foreground-muted flex items-center gap-2 text-sm"
                aria-label="Breadcrumb"
            >
                <Link
                    to={listPath}
                    className="hover:text-primary transition-colors"
                >
                    Products
                </Link>
                <span aria-hidden="true">/</span>
                {isLoading ? (
                    <Skeleton className="h-4 w-32" />
                ) : (
                    <span className="text-foreground">{product?.name ?? "Not found"}</span>
                )}
            </nav>

            {isLoading && <ProductDetailSkeleton />}

            {isError && (
                <ErrorState
                    title="Failed to load product"
                    message={error instanceof Error ? error.message : "Could not load this product."}
                    onRetry={() => refetch()}
                />
            )}

            {!isLoading && !isError && !product && (
                <EmptyState
                    icon={
                        <Package
                            className="text-foreground-muted h-8 w-8"
                            aria-hidden="true"
                        />
                    }
                    title="Product not found"
                    description="This product may have been removed or the URL is incorrect."
                    action={
                        <Link
                            to={listPath}
                            className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
                        >
                            <ArrowLeft
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Back to Products
                        </Link>
                    }
                />
            )}

            {!isLoading && !isError && product && (
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="bg-muted overflow-hidden rounded-2xl">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <Badge variant="accent">{product.category}</Badge>
                            <h1 className="text-foreground mt-2 text-3xl font-bold tracking-tight">{product.name}</h1>
                        </div>
                        <StarRating
                            rating={product.rating}
                            size="md"
                        />
                        <p className="text-foreground text-3xl font-bold">${product.price.toFixed(2)}</p>
                        <p className="text-foreground-muted leading-relaxed">{product.description}</p>
                        <div className="flex items-center gap-2">
                            {product.inStock ? (
                                <span className="text-success flex items-center gap-1.5 text-sm font-medium">
                                    <span className="bg-success h-2 w-2 rounded-full" />
                                    In Stock
                                </span>
                            ) : (
                                <span className="text-destructive flex items-center gap-1.5 text-sm font-medium">
                                    <span className="bg-destructive h-2 w-2 rounded-full" />
                                    Out of Stock
                                </span>
                            )}
                        </div>
                        <Button
                            disabled={!product.inStock}
                            size="lg"
                            className="mt-2 w-full rounded-xl"
                        >
                            {product.inStock ? "Add to Cart" : "Notify When Available"}
                        </Button>
                        <Link
                            to={listPath}
                            className="text-primary hover:text-primary-hover flex items-center justify-center gap-1.5 text-center text-sm transition-colors hover:underline"
                        >
                            <ArrowLeft
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Back to all products
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
