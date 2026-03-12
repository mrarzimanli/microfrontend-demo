import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout";
import { RemoteErrorBoundary, RemoteSuspenseFallback } from "@/components/remote";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const RemoteProductsApp = lazy(() => import("remoteProducts/App"));
const RemoteAccountApp = lazy(() => import("remoteAccount/App"));

function RemoteWrapper({
    children,
    name,
    fallbackLabel,
}: {
    children: React.ReactNode;
    name: string;
    fallbackLabel: string;
}) {
    return (
        <RemoteErrorBoundary remoteName={name}>
            <Suspense fallback={<RemoteSuspenseFallback label={fallbackLabel} />}>{children}</Suspense>
        </RemoteErrorBoundary>
    );
}

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
    {
        path: "/",
        element: <AppShell />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "products/*",
                element: (
                    <RemoteWrapper
                        name="Products"
                        fallbackLabel="Loading Products module..."
                    >
                        <RemoteProductsApp basePath="/products" />
                    </RemoteWrapper>
                ),
            },
            {
                path: "account/*",
                element: (
                    <RemoteWrapper
                        name="Account"
                        fallbackLabel="Loading Account module..."
                    >
                        <RemoteAccountApp basePath="/account" />
                    </RemoteWrapper>
                ),
            },
            {
                path: "404",
                element: <NotFoundPage />,
            },
            {
                path: "*",
                element: (
                    <Navigate
                        to="/404"
                        replace
                    />
                ),
            },
        ],
    },
]);
