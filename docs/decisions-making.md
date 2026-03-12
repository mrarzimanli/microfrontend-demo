# Decision making

Engineering decisions and their reasoning. For each choice there's a real alternative that was rejected and a concrete reason why.

---

## Why micro-frontend architecture?

**The honest answer first:** micro-frontend is an organizational solution, not a technical one. A single team building a single product doesn't benefit from it.

The value is independent deployment cadence, isolated failure domains, and the ability for different teams to own different domains fully: data, routing, validation and UI without coordinating releases.

**In this project:**

- `remote-products` can be deployed independently of `remote-account`
- A bug fix in the account settings form doesn't require a rebuild of the product catalog
- Each remote owns its complete vertical: service layer, query hooks, form schemas, UI components

**Tradeoffs acknowledged:**

- Module Federation configuration must be actively maintained. Shared dependency version skew is a real failure mode
- Build complexity is higher: three build pipelines, three preview servers
- Network overhead: the host fetches remote entry manifests at runtime
- Cross-remote integration testing is harder than testing within a monolith

**When NOT to use it:** when domain boundaries aren't clear yet, when team size doesn't justify the overhead, or when deployment independence isn't a real requirement.

---

## Why is the QueryClient in the host, not in each remote?

If each remote instantiated its own `QueryClient`, they'd have isolated caches with no way to share or invalidate across MF boundaries.

With the `QueryClient` in the host:

- A profile mutation in `remote-account` can invalidate a cache key that `remote-products` or any future remote also reads
- There is exactly one query cache. No duplication, no coherence problems
- Cache configuration (staleTime, gcTime, retry) is set in one place

Named constants prevent magic numbers:

```typescript
const QUERY_STALE_TIME_MS = 60_000; // 1 minute
const QUERY_GC_TIME_MS = 5 * 60_000; // 5 minutes
```

---

## Why the three-layer (service, query, component) separation?

**Service layer** (`services/*.api.ts`) is pure async functions. They have no React dependency. The only thing connecting them to the mock layer is a `delay()` call. To connect to a real API:

```typescript
// Before
export async function getProducts(): Promise<Product[]> {
    await delay(API_DELAY.LIST);
    return MOCK_PRODUCTS;
}

// After: zero component changes required
export async function getProducts(): Promise<Product[]> {
    const res = await fetch("/api/products");
    return res.json();
}
```

**Query layer** (`queries/*.queries.ts`) is TanStack Query hooks. Query keys, staleTime overrides, mutation side-effects all live here. Components don't import from TanStack Query directly.

**Component layer** is calls hooks, renders data. No fetching, no cache management.

This makes the service layer independently unit-testable, the query layer mockable in component tests, and the component layer purely presentational.

---

## Why `MutationOutcome` instead of throwing?

Mutations return a discriminated union:

```typescript
export type MutationOutcome<TData = void> =
    | { success: true; data?: TData }
    | { success: false; serverError: ServerFieldError };
```

**The alternative** is throwing on server errors and catching in the component. The problem: TypeScript doesn't type thrown values, so `catch (e)` gives you `unknown`. You either cast it unsafely or add runtime checks.

**With the discriminated union:**

```typescript
const result = await updateProfile(data);

if (!result.success) {
    // TypeScript narrows here and serverError is unconditionally present
    setError(result.serverError.field as keyof SettingsFormData, {
        message: result.serverError.message,
    });
    return;
}
// TypeScript narrows here and success is true, data is available
reset(data);
```

No optional chaining, no `e instanceof Error` guards, no `as SomeError` casts. The type system enforces correct handling.

---

## Why `type` instead of `interface` for component props?

All component props use `type`:

```typescript
// Correct
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    loading?: boolean;
};

// Not this
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    loading?: boolean;
}
```

**Reasons:**

1. `interface` supports declaration merging. Component props should not be mergeable that would allow external code to add fields to a component's props, undermining the component's contract.
2. `export type` has zero runtime footprint and clearly signals intent. This is a type contract, not a runtime value.
3. Intersection (`&`) for HTML attribute extension is equivalent to `extends` at runtime and consistent with the type-first convention.

`interface` is reserved for domain models (`User`, `Product`, `UserProfile`) where structural extension is semantically meaningful.

---

## Why `satisfies` for the ROLES constant?

```typescript
export const ROLES = ["admin", "editor", "viewer"] as const satisfies readonly UserRole[];
```

`as const` gives the literal tuple type. `satisfies readonly UserRole[]` adds compile-time validation that every element is a valid `UserRole`.

**Without `satisfies`:** Adding a new value to the `UserRole` union doesn't cause an error in `ROLES`. The array silently becomes incomplete. The role selector dropdown misses an option. There's no compile-time signal.

**With `satisfies`:** Adding `"superadmin"` to `UserRole` but not to `ROLES` is immediately a compile error. The schema, the dropdown options, and the type stay in sync.

`ROLES` is also passed directly to `z.enum(ROLES, ...)` in the settings schema. The Zod validator and the UI options reference the same constant.

---

## Why typed route constants instead of inline strings?

```typescript
export const ROUTES = { HOME: "/", PRODUCTS: "/products", ACCOUNT: "/account" } as const;
export const PRODUCT_ROUTES = {
    LIST: "/list",
    DETAIL: "/detail/:id",
    detailPath: (id: string) => `/detail/${id}`,
} as const;
export const ACCOUNT_ROUTES = { PROFILE: "/profile", SETTINGS: "/settings" } as const;
```

**The alternative** is string literals scattered through components and hooks. Renaming a route requires a grep across the codebase with no TypeScript assistance.

With constants:

- `ROUTES.PRODUCTS` is the single source of truth for `/products`
- TypeScript catches typos at compile time
- Refactoring a route path is a one-line change in the constant file
- `detailPath(id)` encapsulates the interpolation — no template literal duplication

---

## Why Tailwind CSS v4 with `@theme inline` instead of a config file?

**Tailwind v4 removes the JavaScript config entirely.** There is no `tailwind.config.js`, no `tailwind-preset.js`. The theme is defined in CSS.

The token pipeline:

```
tokens.css  - :root { --color-primary: var(--color-brand-600); }
theme.css   - @theme inline { --color-primary: var(--color-primary); }
Component   - className="bg-primary"
```

`@theme inline` tells Tailwind to generate utilities that reference the CSS variable at runtime rather than inlining the resolved value at build time. This is what enables runtime theming: overriding `--color-primary` at a lower scope changes the button color without rebuilding anything.

**Cross-app consistency in MF:** The host loads its stylesheet first. Remotes inherit the `:root` CSS variables. All three apps share the same token values at runtime, even though they're built separately.

---

## Why is `UserProfile` defined as `extends Omit<User, 'bio'>`?

```typescript
export interface UserProfile extends Omit<User, "bio"> {
    bio: string; // required in profile, optional in User
    marketingEmails: boolean;
    stats: { orders: number; reviews: number; wishlist: number };
    recentActivity: ActivityItem[];
}
```

The alternative is copying all `User` fields into `UserProfile`. That creates a maintenance hazard: adding a field to `User` must be manually mirrored in `UserProfile`.

`Omit<User, 'bio'>` inherits all `User` fields except `bio`, then redefines `bio` as `string` (required, not optional). Domain-specific additions follow. One type change in `User` propagates to `UserProfile` automatically.

---

## Why are all skeleton composites in one file?

`StatCardSkeleton`, `FormSkeleton` all live in `packages/shared-ui/src/Skeleton/Skeleton.tsx`.

**The alternative** is colocating each skeleton with its companion component (e.g., `StatCardSkeleton` in `StatCard.tsx`). That creates split imports when a page needs multiple skeleton types.

The consolidated approach:

- One import covers all skeleton variants: `import { StatCardSkeleton, FormSkeleton } from "@micro/shared-ui"`
- Skeleton animation behavior is guaranteed to be identical across all composites (same base `Skeleton` primitive)
- Adding a new skeleton composite is a change to one file

---

## Why RHF + Zod instead of a simpler validation approach?

**React Hook Form** is uncontrolled inputs register via refs. The form tree does not re-render on every keystroke. A settings form with 7 fields would trigger 7 × keystrokes re-renders per second with a controlled approach. With RHF, re-renders happen only on submit and on explicit `trigger()` calls.

**Zod** generates both runtime validation and TypeScript types from a single definition:

```typescript
export type SettingsFormData = z.infer<typeof settingsSchema>;
```

There is no separate type to maintain. The Zod schema is the type. Cross-field validation (password confirmation) is handled in `superRefine` rather than requiring a second schema or manual comparison.

**The `@hookform/resolvers` bridge** connects the two: `zodResolver(settingsSchema)` passes Zod errors to RHF's field-level error state, which `FormField` renders via `aria-describedby`.

---

## What would scale well in a real product?

**Works at scale as-is:**

- Service layer purity - swapping mock for real API is a single-file change
- Token system - runtime CSS variables support theming without rebuilds
- Discriminated union mutations - pattern extends to any server operation
- Route constants - refactoring a URL is one line
- `satisfies` on enums - prevents silent drift between types and runtime values

**Would need investment:**

- **MSW** - replacing `delay() + fixture` with MSW handlers makes mocks reusable in Storybook and CI without touching service code
- **Remote versioning** - production MF requires versioned entry URLs and a manifest service for controlled rollouts
- **Token pipeline** - Figma to Style Dictionary to `tokens.css` for designer-developer sync
- **Cross-remote E2E** - Playwright tests that start all three servers and verify user flows that span MF boundaries
- **Error monitoring** - `RemoteErrorBoundary` currently shows a static UI; in production it would report to Sentry with the remote name and version

---

## How is testing structured, and why?

Three test layers correspond to three levels of confidence:

**Unit tests**: `useProductFilters`, `settingsSchema`, `FormField`, shared-ui components. No network, no routing, no providers beyond the minimum. Fast, deterministic, focused.

**Integration tests**: `ProductListPage`, `SettingsPage`, `SessionContext`. Real React Query lifecycle, real form submission, real TanStack Query hooks. The service layer is mocked (`vi.mock`) to remove network delay and make responses deterministic. This is the key distinction: mock the service, not the hook. Mocking at the hook level would hide bugs in the `isLoading - isSuccess` lifecycle.

**No E2E in this repo**: cross-remote journeys (navigate to products, update account, see profile reflect the change) require all three servers running. That's a Playwright job, not Vitest.

**Why co-locate shared-ui tests?**

Shared components are high-impact: a regression in `Button` affects all three apps simultaneously. Tests live in `Button/Button.test.tsx`, directly beside `Button.tsx` and `Button.stories.tsx`. This makes the component folder self-contained and makes it impossible to have a component without discovering immediately that its test is missing.

**Why a fresh `QueryClient` per render call?**

TanStack Query caches aggressively. If the same `QueryClient` instance were shared across tests, a resolved query in test A would be served from cache in test B. Making test B appear to pass even if the mock wasn't called. Creating a new client inside `createWrapper()` (called inside each `renderWithProviders()`) guarantees cache isolation.

**What to mock, what not to mock:**

| Layer             | Decision                                | Reason                                                          |
| ----------------- | --------------------------------------- | --------------------------------------------------------------- |
| Service functions | Mock with `vi.mock`                     | Remove delay, control success / failure responses per test      |
| React Query hooks | Do NOT mock                             | Exercise real `isLoading` / `isError` / `isSuccess` transitions |
| React Router      | `MemoryRouter`                          | No browser needed, `useNavigate` and links work correctly       |
| Module federation | Path alias stubs                        | Remotes are not loadable in Vitest's static module graph        |
| Session context   | Real `SessionProvider` with `MOCK_USER` | Test real context interactions                                  |

---

## What trade-offs were made intentionally?

| Decision                                             | Trade-off                                                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Session state in React context (not a state manager) | Simpler for demo scope. Zustand would be better at scale                                           |
| In-memory mock state (module-level variable)         | Persists across route changes, resets on page refresh                                              |
| `delay()` for simulated latency                      | Realistic loading states without a backend; replaced by MSW in production                          |
| No optimistic updates                                | Keeps the mutation pattern readable; `useMutation`'s `onMutate`/`onError` callbacks would add this |
| No dark mode implementation                          | Token system supports it by adding `[data-theme="dark"]`                                           |
