import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ALL_CATEGORY } from "@/constants/categories";
import { MOCK_PRODUCTS } from "@/data/products";

// Pre-computed expectations derived from the fixture data.
const ELECTRONICS = MOCK_PRODUCTS.filter((p) => p.category === "Electronics");
const FURNITURE = MOCK_PRODUCTS.filter((p) => p.category === "Furniture");
const IN_STOCK_COUNT = MOCK_PRODUCTS.filter((p) => p.inStock).length;
const DISTINCT_CATEGORIES = new Set(MOCK_PRODUCTS.map((p) => p.category)).size;
const AVG_RATING = MOCK_PRODUCTS.reduce((sum, p) => sum + p.rating, 0) / MOCK_PRODUCTS.length;

describe("useProductFilters", () => {
    describe("initial state", () => {
        it("returns all products when no filters are applied", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            expect(result.current.filtered).toHaveLength(MOCK_PRODUCTS.length);
        });

        it("defaults to the 'All' category", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            expect(result.current.selectedCategory).toBe(ALL_CATEGORY);
        });

        it("defaults to an empty search string", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            expect(result.current.search).toBe("");
        });

        it("returns an empty array and null stats when products are undefined", () => {
            const { result } = renderHook(() => useProductFilters(undefined));

            expect(result.current.filtered).toEqual([]);
            expect(result.current.stats).toBeNull();
        });
    });

    describe("category filter", () => {
        it("shows only products matching the selected category", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => result.current.setSelectedCategory("Electronics"));

            expect(result.current.filtered).toHaveLength(ELECTRONICS.length);
            result.current.filtered.forEach((p) => expect(p.category).toBe("Electronics"));
        });

        it("returns all products again when 'All' is selected", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => result.current.setSelectedCategory("Electronics"));
            act(() => result.current.setSelectedCategory(ALL_CATEGORY));

            expect(result.current.filtered).toHaveLength(MOCK_PRODUCTS.length);
        });
    });

    describe("search filter", () => {
        it("filters products by name substring (case-insensitive)", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => result.current.setSearch("headphones"));

            expect(result.current.filtered).toHaveLength(1);
            expect(result.current.filtered[0].name).toBe("Wireless Headphones Pro");
        });

        it("is case-insensitive", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => result.current.setSearch("KEYBOARD"));

            expect(result.current.filtered).toHaveLength(1);
            expect(result.current.filtered[0].name).toBe("Mechanical Keyboard");
        });
    });

    describe("combined filters", () => {
        it("applies category and search together", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => {
                result.current.setSelectedCategory("Electronics");
                result.current.setSearch("keyboard");
            });

            expect(result.current.filtered).toHaveLength(1);
            expect(result.current.filtered[0].name).toBe("Mechanical Keyboard");
        });

        it("returns an empty array when no products match the combined filters", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => {
                result.current.setSelectedCategory("Furniture");
                result.current.setSearch("keyboard");
            });

            expect(result.current.filtered).toEqual([]);
        });
    });

    describe("clearFilters", () => {
        it("resets both search and category to their defaults", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => {
                result.current.setSelectedCategory("Electronics");
                result.current.setSearch("keyboard");
            });

            act(() => result.current.clearFilters());

            expect(result.current.selectedCategory).toBe(ALL_CATEGORY);
            expect(result.current.search).toBe("");
            expect(result.current.filtered).toHaveLength(MOCK_PRODUCTS.length);
        });
    });

    describe("stats", () => {
        it("calculates stats from the full product list, not the filtered subset", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            // Apply a narrow filter
            act(() => result.current.setSelectedCategory("Furniture"));

            // Stats should reflect the complete catalog, not just Furniture
            expect(result.current.stats?.total).toBe(MOCK_PRODUCTS.length);
            expect(result.current.stats?.inStock).toBe(IN_STOCK_COUNT);
        });

        it("counts distinct product categories correctly", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            expect(result.current.stats?.categories).toBe(DISTINCT_CATEGORIES);
        });

        it("calculates average rating across all products", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            expect(result.current.stats?.avgRating).toBeCloseTo(AVG_RATING, 5);
        });

        it("counts in-stock products correctly", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            expect(result.current.stats?.inStock).toBe(IN_STOCK_COUNT);
            // Sanity check: at least one product is out of stock in the fixture
            expect(IN_STOCK_COUNT).toBeLessThan(MOCK_PRODUCTS.length);
        });

        it("reflects zero Furniture results in filtered list while stats stay full", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => {
                result.current.setSelectedCategory("Furniture");
                result.current.setSearch("nonexistent");
            });

            expect(result.current.filtered).toEqual([]);
            expect(result.current.stats?.total).toBe(MOCK_PRODUCTS.length);
        });
    });

    describe("exposing setters", () => {
        it("updates the filtered list when setSearch is called", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => result.current.setSearch("laptop"));

            expect(result.current.search).toBe("laptop");
            expect(result.current.filtered.length).toBeLessThan(MOCK_PRODUCTS.length);
        });

        it("exposes the Furniture products when that category is selected", () => {
            const { result } = renderHook(() => useProductFilters(MOCK_PRODUCTS));

            act(() => result.current.setSelectedCategory("Furniture"));

            expect(result.current.filtered).toHaveLength(FURNITURE.length);
        });
    });
});
