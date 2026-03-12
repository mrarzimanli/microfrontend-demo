import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@/context/SessionContext";
import { router } from "@/routes";
import "@/styles/global.css";

const QUERY_STALE_TIME_MS = 60_000; // 1 minute
const QUERY_GC_TIME_MS = 5 * 60_000; // 5 minutes

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: QUERY_STALE_TIME_MS,
            gcTime: QUERY_GC_TIME_MS,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <RouterProvider router={router} />
            </SessionProvider>
        </QueryClientProvider>
    );
}
