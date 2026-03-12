import { MOCK_PRODUCTS } from "@/data/products";

export const ALL_CATEGORY = "All" as const;

export const CATEGORIES = [...new Set(MOCK_PRODUCTS.map((p) => p.category))];
