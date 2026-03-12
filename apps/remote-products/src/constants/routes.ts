export const PRODUCT_ROUTES = {
    LIST: "/list",
    DETAIL: "/detail/:id",
    detailPath: (id: string) => `/detail/${id}`,
} as const;
