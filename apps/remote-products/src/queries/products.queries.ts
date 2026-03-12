import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "@/services/products.api";

export const productKeys = {
    all: ["products"] as const,
    detail: (id: string) => ["products", id] as const,
};

export function useProductsQuery() {
    return useQuery({
        queryKey: productKeys.all,
        queryFn: getProducts,
    });
}

export function useProductQuery(id: string) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
}
