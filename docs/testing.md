# Testing

## Stack

| Tool                            | Role                                               |
| ------------------------------- | -------------------------------------------------- |
| **Vitest 4**                    | Test runner, assertion library                     |
| **React Testing Library**       | Component rendering, DOM queries                   |
| **@testing-library/user-event** | Realistic user interaction                         |
| **@testing-library/jest-dom**   | DOM matchers (`toBeInTheDocument`, `toBeDisabled`) |
| **jsdom**                       | Browser environment for component tests            |

All five packages run Vitest independently. `pnpm test` runs them in parallel:

```bash
pnpm run --parallel --filter './apps/*' --filter '@micro/shared-utils' --filter '@micro/shared-ui' test
```

---

## Test placement

```
apps/
  host/src/
    context/__tests__/SessionContext.test.tsx
    components/layout/__tests__/Header.test.tsx
    components/remote/__tests__/RemoteErrorBoundary.test.tsx
    pages/__tests__/HomePage.test.tsx
    test/
      setup.ts                        import "@testing-library/jest-dom"
      test-utils.tsx                  renderWithProviders (QueryClient, MemoryRouter, SessionProvider)
      __mocks__/
        remoteProducts.tsx            module federation stub
        remoteAccount.tsx             module federation stub

  remote-products/src/
    hooks/__tests__/useProductFilters.test.ts
    components/cards/__tests__/StarRating.test.tsx
    components/cards/__tests__/ProductCard.test.tsx
    pages/__tests__/ProductListPage.test.tsx
    test/
      setup.ts
      test-utils.tsx                  renderWithProviders (QueryClient, MemoryRouter)

  remote-account/src/
    schemas/__tests__/settings.schema.test.ts
    components/form/__tests__/FormField.test.tsx
    pages/__tests__/SettingsPage.test.tsx
    test/
      setup.ts
      test-utils.tsx                  renderWithProviders (QueryClient, MemoryRouter)

packages/
  shared-ui/src/
    Button/Button.test.tsx            co-located with component
    Alert/Alert.test.tsx
    Badge/Badge.test.tsx
    EmptyState/EmptyState.test.tsx
    ErrorState/ErrorState.test.tsx
    StatCard/StatCard.test.tsx
    test/setup.ts

  shared-utils/src/
    __tests__/string.test.ts
```

Tests in `apps/` live in `__tests__` subdirectories adjacent to their module. Tests in `packages/shared-ui` are co-located inside each component's own folder (`ComponentName/ComponentName.test.tsx`). The convention makes it immediately visible when a component has no test.

---

## Test utilities

Each app exports `renderWithProviders()` from `src/test/test-utils.tsx`. It wraps RTL's `render` with the minimum provider stack needed for that app:

```tsx
// Host: includes SessionProvider
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
```

`createWrapper()` creates a fresh `QueryClient` on every call not at module scope. This guarantees cache isolation between tests.

The file re-exports everything from `@testing-library/react`, so tests only need one import:

```ts
import { renderWithProviders, screen, fireEvent } from "@/test/test-utils";
```

---

## Module federation in tests

Vitest resolves modules statically. It cannot reach a live remote server. The host's `vitest.config.ts` maps the federation imports to local stubs:

```ts
resolve: {
    alias: {
        "remoteProducts/App": "./src/test/__mocks__/remoteProducts.tsx",
        "remoteAccount/App":  "./src/test/__mocks__/remoteAccount.tsx",
    },
}
```

Stubs render a single `data-testid` element. Host tests verify routing and shell composition without any dependency on remote behaviour.

---

## What is tested and where

### host

| File                  | Tests                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| `SessionContext`      | Initial state, login, logout, login-after-logout, stable callback refs, throws outside provider   |
| `Header`              | Nav links, logo link, user name, sign-out button, unauthenticated state                           |
| `HomePage`            | Heading, signed-in greeting, links to `/products` and `/account`, architecture cards, port badges |
| `RemoteErrorBoundary` | Healthy render, error UI, remote name in heading, error message, retry resets boundary            |

### remote-products

| File                | Tests                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `useProductFilters` | Search, category filter, clear, combined filters, stats computation, edge cases                                   |
| `StarRating`        | `aria-label`, numeric display, whole-number formatting, star count, size variant                                  |
| `ProductCard`       | Name, price, category, description, image, rating, link href, in/out-of-stock overlay                             |
| `ProductListPage`   | Loading skeleton, success state, error state, category filter, `aria-pressed`, search, empty state, clear filters |

Service layer is mocked via `vi.mock("@/services/products.api")`. React Query hooks run for real against a test `QueryClient`.

### remote-account

| File             | Tests                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `settingsSchema` | Valid payload, fullName (length, regex), email, password (length, uppercase, digit, mismatch), role enum, bio length                                                                 |
| `FormField`      | Label association, required asterisk, hint text, `aria-describedby`, error with `role=alert`, `aria-invalid`, hint, error combined                                                   |
| `SettingsPage`   | Loading state, form hydration, dirty state (enabled/disabled), client validation (`onTouched` mode), server error field mapping, success alert, mutation called with correct payload |

Service layer mocked via `vi.mock("@/services/profile.api")`. `updateProfile` mock is configured per-test to return success or `{ success: false, serverError: ... }`.

### shared-ui

| Component    | Tests                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `Button`     | All 4 variants, 3 sizes, disabled, loading (spinner + `aria-disabled`), click handler, full-width |
| `Alert`      | All 4 variants, title, body content, `role="alert"` tests                                         |
| `Badge`      | All 6 semantic variants, className passthrough tests                                              |
| `EmptyState` | Title, description, icon slot, action button tests                                                |
| `ErrorState` | Title, message, `role="alert"`, retry button presence and callback                                |
| `StatCard`   | Label, value, delta text and sign, icon slot, `deltaType` color classes                           |

### shared-utils

`getInitials` covering single name, two names, extra whitespace, empty input, single character.

---

## Mocking strategy

| Concern                   | Approach                                         | Reason                                             |
| ------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| Module federation remotes | Path alias stubs in `vitest.config.ts`           | Not loadable in static module resolution           |
| API / service layer       | `vi.mock(path)` per test file                    | Remove latency, control success / failure per test |
| React Query               | Real hooks and fresh test `QueryClient`          | Exercises `isLoading`, `isSuccess` lifecycle       |
| Router                    | `MemoryRouter` in wrapper                        | No browser needed `useNavigate` works              |
| Session context           | Real `SessionProvider` (starts with `MOCK_USER`) | Tests real context interactions                    |

**Mock the service, not the hook.** Mocking at the hook level would bypass the React Query loading lifecycle and hide integration bugs between `isLoading` state and the skeleton UI.

---

## QueryClient config for tests

```ts
new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // fail immediately - no retries masking bugs
            gcTime: 0, // dispose cache after unmount - no cross test leakage
        },
        mutations: {
            retry: false,
        },
    },
});
```

A new instance is created inside `createWrapper()`, which is called inside each `renderWithProviders()` call. The same `QueryClient` instance is never shared across tests.

---

## What is not tested

| Area                                                 | Reason                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `ProductDetailPage`                                  | Requires route params; lower marginal value once list page is tested      |
| `ProfilePage`                                        | Read-only query display; straightforward `waitFor` test if added          |
| `AppShell` / `Footer`                                | Layout components with no logic                                           |
| `Avatar`, `ToggleSwitch`, `SelectInput`, `TextInput` | Covered implicitly through `SettingsPage` integration tests               |
| Skeleton composites                                  | Decorative, no logic, covered implicitly via loading states in page tests |
| End-to-end                                           | Cross-remote flows require all three servers running (Playwright scope)   |

---

## Recommended next steps

1. **E2E with Playwright** - navigate to products, filter, navigate to account, update settings, verify profile reflects change. This is the level at which module federation actually matters.

2. **`ProductDetailPage`** - render with `createMemoryRouter` and a route param, mock `getProductById`.

3. **CI** - `pnpm test` in a GitHub Actions matrix, one job per app / package, runs on every PR.

4. **Coverage thresholds** - add `coverage.thresholds` to each `vitest.config.ts` once baseline is stable.

5. **MSW** - replace per-test `vi.mock` service stubs with MSW handlers. Handlers become reusable across tests, Storybook, and local dev without touching service code.
