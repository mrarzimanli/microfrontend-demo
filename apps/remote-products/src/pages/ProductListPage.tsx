import { Package, CheckCircle, Star, Tag, Search } from "lucide-react";
import { PageHeader, StatCard, StatCardSkeleton, EmptyState, ErrorState, Button, cn } from "@micro/shared-ui";
import { ProductCard, ProductCardSkeleton } from "@/components/cards";
import { useProductsQuery } from "@/queries/products.queries";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ALL_CATEGORY, CATEGORIES } from "@/constants/categories";

type ProductListPageProps = {
    basePath: string;
};

const SKELETON_COUNT = 6;
const STAT_SKELETON_COUNT = 4;

export function ProductListPage({ basePath }: ProductListPageProps) {
    const { data: products, isLoading, isError, error, refetch } = useProductsQuery();
    const { filtered, stats, search, setSearch, selectedCategory, setSelectedCategory, clearFilters } =
        useProductFilters(products);

    return (
        <div className="space-y-8">
            <PageHeader
                title="Products"
                description="Browse products by category or search by name."
                badge={products ? `${products.length} items` : undefined}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {isLoading || !stats ? (
                    <>
                        {Array.from({ length: STAT_SKELETON_COUNT }).map((_, i) => (
                            <StatCardSkeleton key={i} />
                        ))}
                    </>
                ) : (
                    <>
                        <StatCard
                            label="Total Products"
                            value={stats.total}
                            delta="Full catalog"
                            deltaType="neutral"
                            icon={
                                <Package
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            }
                        />
                        <StatCard
                            label="In Stock"
                            value={stats.inStock}
                            delta={`${stats.total - stats.inStock} out of stock`}
                            deltaType="positive"
                            icon={
                                <CheckCircle
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            }
                        />
                        <StatCard
                            label="Average rating"
                            value={stats.avgRating.toFixed(1)}
                            delta="Out of 5.0"
                            deltaType="positive"
                            icon={
                                <Star
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            }
                        />
                        <StatCard
                            label="Categories"
                            value={stats.categories}
                            delta="Distinct categories"
                            deltaType="neutral"
                            icon={
                                <Tag
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            }
                        />
                    </>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                    <Search
                        className="text-foreground-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                        aria-hidden="true"
                    />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products"
                        aria-label="Search products"
                        className="focus:ring-ring/20 border-border bg-surface placeholder:text-foreground-muted focus:border-ring rounded-lg border py-2 pr-4 pl-9 text-sm shadow-sm focus:ring-2 focus:outline-none"
                    />
                </div>
                <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter by category"
                >
                    {[ALL_CATEGORY, ...CATEGORIES].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            aria-pressed={selectedCategory === cat}
                            className={cn(
                                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-(--motion-base)",
                                selectedCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "border-border bg-surface text-foreground-muted hover:bg-muted border",
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {isError && (
                <ErrorState
                    title="Failed to load products"
                    message={error instanceof Error ? error.message : "An unexpected error occurred."}
                    onRetry={() => refetch()}
                />
            )}

            {isLoading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    {filtered.length > 0 ? (
                        <>
                            <p className="text-foreground-muted text-sm">
                                Showing {filtered.length} of {products?.length ?? 0} products
                                {selectedCategory !== ALL_CATEGORY && ` in ${selectedCategory}`}
                                {search && ` matching "${search}"`}
                            </p>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        basePath={basePath}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            icon={
                                <Search
                                    className="text-foreground-muted h-6 w-6"
                                    aria-hidden="true"
                                />
                            }
                            title="No products match your search"
                            description={
                                search
                                    ? `No results for "${search}" in ${selectedCategory === ALL_CATEGORY ? "any category" : selectedCategory}.`
                                    : `No products in ${selectedCategory}.`
                            }
                            action={
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    Clear filters
                                </Button>
                            }
                        />
                    )}
                </>
            )}
        </div>
    );
}
