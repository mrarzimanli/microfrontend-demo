import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { RemoteAppProps } from "@micro/shared-types";
import { Spinner } from "@micro/shared-ui";
import { ACCOUNT_ROUTES } from "@/constants/routes";

const ProfilePage = lazy(() => import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));

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
                        to={`${basePath}${ACCOUNT_ROUTES.PROFILE}`}
                        replace
                    />
                }
            />
            <Route
                path="profile"
                element={
                    <Suspense fallback={<PageFallback />}>
                        <ProfilePage basePath={basePath} />
                    </Suspense>
                }
            />
            <Route
                path="settings"
                element={
                    <Suspense fallback={<PageFallback />}>
                        <SettingsPage basePath={basePath} />
                    </Suspense>
                }
            />
            <Route
                path="*"
                element={
                    <Navigate
                        to={`${basePath}${ACCOUNT_ROUTES.PROFILE}`}
                        replace
                    />
                }
            />
        </Routes>
    );
}
