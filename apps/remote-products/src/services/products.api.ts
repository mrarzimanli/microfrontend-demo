import { delay } from "@micro/shared-utils";
import { MOCK_PRODUCTS } from "@/data/products";
import type { Product } from "@micro/shared-types";

// Simulated network latency
const API_DELAY = {
    LIST: 900,
    DETAIL: 600,
} as const;

export async function getProducts(): Promise<Product[]> {
    await delay(API_DELAY.LIST);
    return MOCK_PRODUCTS;
}

export async function getProductById(id: string): Promise<Product | null> {
    await delay(API_DELAY.DETAIL);
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
}
