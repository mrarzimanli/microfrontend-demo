# React Microfrontend Platform

A production-structured microfrontend demo: three independently built Vite apps connected at runtime via Module Federation, with a shared design system, typed data contracts, and a test suite covering each domain.

---

## Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Runtime        | React 19, React Router 7                           |
| Language       | TypeScript 5.9 (strict)                            |
| Build          | Vite 7, `@originjs/vite-plugin-federation`         |
| Monorepo       | pnpm workspace                                     |
| Styling        | Tailwind CSS v4 (`@tailwindcss/vite` plugin)       |
| Data fetching  | TanStack Query v5                                  |
| Forms          | React Hook Form 7 + Zod v4 + `@hookform/resolvers` |
| Testing        | Vitest 4 + React Testing Library + jest-dom        |
| Component docs | Storybook                                          |
| Tooling        | ESLint 9, Prettier, Husky + lint-staged            |

---

## Structure

```
micro/
├── apps/
│   ├── host             (port 3000) - Shell, routing, session, remote mounting
│   ├── remote-products  (port 3001) - Product catalog domain
│   └── remote-account   (port 3002) - Account management domain
│
├── packages/
│   ├── shared-ui      - Component library (Button, Card, StatCard, Skeleton, …)
│   ├── shared-types   - TypeScript contracts shared across all apps
│   ├── shared-config  - Design token CSS + Tailwind v4 theme
│   └── shared-utils   - cn(), delay(), getInitials()
│
└── docs/
    ├── architecture.md
    ├── design-system.md
    ├── testing.md
    └── interview-defense.md
```

---

## Dev setup

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

`pnpm dev` builds both remotes first (`vite build`), starts them via `vite preview`, then starts the host in dev mode with HMR. The two remote build watchers also run in the background so source changes trigger a rebuild.

> **Important:** Module Federation requires the remotes to be built before the host can load them. Running the host alone (without built remotes) will show loading errors at `/products` and `/account`.

To rebuild a single remote after a change that the watcher misses:

```bash
pnpm --filter @micro/remote-products build
pnpm --filter @micro/remote-account build
```

---

## Scripts

| Script              | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `pnpm dev`          | Build remotes, preview remotes + watch, host in dev mode |
| `pnpm build`        | Build all apps in parallel                               |
| `pnpm test`         | Vitest across all apps + shared-ui + shared-utils        |
| `pnpm storybook`    | Storybook for shared-ui at port 6006                     |
| `pnpm lint`         | ESLint across all packages                               |
| `pnpm type-check`   | `tsc --noEmit` across all packages                       |
| `pnpm format`       | Prettier write                                           |
| `pnpm format:check` | Prettier check (for CI)                                  |

---

## Architecture

### Module Federation

```
Host (3000)
  ├── /products/* - lazy loads RemoteProductsApp from :3001/assets/remoteEntry.js
  └── /account/*  - lazy loads RemoteAccountApp  from :3002/assets/remoteEntry.js
```

Each remote exposes a single `./App` entry. `react`, `react-dom`, `react-router-dom`, and `@tanstack/react-query` are declared in the `shared` block with `requiredVersion` semver ranges. The share scope mechanism reuses the already-loaded version rather than loading a second copy. `singleton: true` is not used; it is not a supported option in `@originjs/vite-plugin-federation@1.4.1`.

The only prop the host passes to each remote is `basePath`:

```typescript
// packages/shared-types/src/remote.types.ts
export type RemoteAppProps = { basePath: string };
```

Remotes construct all absolute paths (`${basePath}/detail/${id}`) from this value. It's the only coupling at the component boundary.

### Provider hierarchy

```
<QueryClientProvider>   staleTime: 60s, gcTime: 5min, retry: 1
  <SessionProvider>     auth state: login, logout, memoized context value
    <RouterProvider>    createBrowserRouter, React Router v7
      <AppShell>        Header, Footer
        <RemoteApp />   wrapped in RemoteErrorBoundary + Suspense
```

`QueryClient` lives in the host so mutations in `remote-account` can invalidate queries that `remote-products` owns. Each remote has no `QueryClient` of its own.

### Data layer

```
Component
  - useProductsQuery()      queries/products.queries.ts
    - getProducts()         services/products.api.ts
      - delay() + fixture   data/products.ts
```

Service functions are pure async, no React imports, no hooks. The `delay()` call is the only mock artifact; swapping in a real `fetch` is a one-line change per service file with zero changes required in the component layer.

### Mutations

```typescript
// packages/shared-types/src/api.types.ts
export type MutationOutcome<TData = void> =
    | { success: true; data?: TData }
    | { success: false; serverError: ServerFieldError };
```

Mutations return a discriminated union instead of throwing. TypeScript narrows `serverError` as unconditionally present in the `success: false` branch, no optional chaining, no `catch (e: unknown)` gymnastics.

---

## Remotes

### remote-products (port 3001)

- Product list with search and category filter (`useProductFilters` hook)
- Product detail page
- KPI stat cards (total, in-stock, avg rating, category count)
- Loading skeletons + `EmptyState` / `ErrorState` fallbacks via TanStack Query

### remote-account (port 3002)

- Profile page: query-driven, skeleton loading, no non-null assertions
- Settings page: 7-field RHF + Zod form, cross-field password validation, role selector
- Server error mapping: `MutationOutcome` failures set field-level errors via `setError`
- `taken@example.com` triggers a simulated conflict response in the service layer
- Cache invalidation on success: Profile page reflects updates immediately

---

## Design system

Tokens live in `packages/shared-config/src/styles/tokens.css` as `:root` CSS custom properties. Tailwind v4's `@theme inline` block maps those variables to utilities without `tailwind.config.js`.

```css
/* tokens.css */
--color-primary: var(--color-brand-600);

/* theme.css */
@theme inline {
    --color-primary: var(--color-primary);
}

/* component */
className="bg-primary text-primary-foreground"
```

Because remotes inherit the host's `:root` variables at runtime, all three apps share the same token values even though they're built separately.

```bash
pnpm storybook  # http://localhost:6006
```

---

## Testing

```bash
pnpm test
```

| Package / App           | Tests                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| `host`                  | `SessionContext`, `Header`, `HomePage`, `RemoteErrorBoundary`            |
| `remote-products`       | `useProductFilters` hook, `StarRating`, `ProductCard`, `ProductListPage` |
| `remote-account`        | `settingsSchema` (Zod), `FormField`, `SettingsPage`                      |
| `packages/shared-ui`    | `Button`, `Alert`, `Badge`, `EmptyState`, `ErrorState`, `StatCard`       |
| `packages/shared-utils` | `getInitials`                                                            |

Each app has `src/test/test-utils.tsx` exporting `renderWithProviders()`. It is a wrapper around RTL's `render` that provides `QueryClientProvider`, `MemoryRouter`, and (in the host) `SessionProvider`. A fresh `QueryClient` is created per render call to prevent cache bleed across tests.

See [docs/testing.md](docs/testing.md) for the full strategy, mock boundaries, and what is intentionally not tested.
