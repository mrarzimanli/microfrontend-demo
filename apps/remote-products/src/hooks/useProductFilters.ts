import { useCallback, useMemo, useState } from "react";
import type { Product } from "@micro/shared-types";
import { ALL_CATEGORY } from "@/constants/categories";

interface ProductStats {
    total: number;
    inStock: number;
    avgRating: number;
    categories: number;
}

interface ProductFilters {
    filtered: Product[];
    stats: ProductStats | null;
    search: string;
    setSearch: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    clearFilters: () => void;
}

export function useProductFilters(products: Product[] | undefined): ProductFilters {
    const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!products) return [];
        return products.filter((p) => {
            const matchesCategory = selectedCategory === ALL_CATEGORY || p.category === selectedCategory;
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, search]);

    const stats = useMemo<ProductStats | null>(() => {
        if (!products) return null;
        const inStock = products.filter((p) => p.inStock).length;
        const avgRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
        const categories = new Set(products.map((p) => p.category)).size;
        return { total: products.length, inStock, avgRating, categories };
    }, [products]);

    const clearFilters = useCallback(() => {
        setSearch("");
        setSelectedCategory(ALL_CATEGORY);
    }, []);

    return { filtered, stats, search, setSearch, selectedCategory, setSelectedCategory, clearFilters };
}
