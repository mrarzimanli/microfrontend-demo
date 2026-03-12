import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { RemoteAppProps } from "@micro/shared-types";
import { Spinner } from "@micro/shared-ui";
import { PRODUCT_ROUTES } from "@/constants/routes";
import "./styles/remote.css";

const ProductListPage = lazy(() => import("@/pages/ProductListPage").then((m) => ({ default: m.ProductListPage })));
const ProductDetailPage = lazy(() =>
    import("@/pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })),
);

function PageFallback() {
    return (
        <div className="flex min-h-96 items-center justify-center">
            <Spinner size="md" />
        </div>
    );
}

export default function App({ basePath }: RemoteAppProps) {
    return (
        <Routes>
            <Route
                index
                element={
                    <Navigate
                        to={`${basePath}${PRODUCT_ROUTES.LIST}`}
                        replace
                    />
                }
            />
            <Route
                path="list"
                element={
                    <Suspense fallback={<PageFallback />}>
                        <ProductListPage basePath={basePath} />
                    </Suspense>
                }
            />
            <Route
                path="detail/:id"
                element={
                    <Suspense fallback={<PageFallback />}>
                        <ProductDetailPage basePath={basePath} />
                    </Suspense>
                }
            />
            <Route
                path="*"
                element={
                    <Navigate
                        to={`${basePath}${PRODUCT_ROUTES.LIST}`}
                        replace
                    />
                }
            />
        </Routes>
    );
}
