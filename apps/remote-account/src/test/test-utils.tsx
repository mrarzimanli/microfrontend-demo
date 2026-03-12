import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export function createTestQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0 },
            mutations: { retry: false },
        },
    });
}

interface WrapperOptions {
    initialPath?: string;
}

function createWrapper({ initialPath = "/" }: WrapperOptions = {}) {
    const queryClient = createTestQueryClient();

    return function TestWrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
            </QueryClientProvider>
        );
    };
}

function renderWithProviders(
    ui: React.ReactElement,
    options?: WrapperOptions & Omit<RenderOptions, "wrapper">,
): RenderResult {
    const { initialPath, ...renderOptions } = options ?? {};
    return render(ui, {
        wrapper: createWrapper({ initialPath }),
        ...renderOptions,
    });
}

export * from "@testing-library/react";
export { renderWithProviders };
