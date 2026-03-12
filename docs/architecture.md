# Architecture

## Monorepo structure

```
micro/
├── apps/
│   ├── host             (port 3000)
│   ├── remote-products  (port 3001)
│   └── remote-account   (port 3002)
└── packages/
    ├── shared-ui        - Component library
    ├── shared-types     - TypeScript contracts
    ├── shared-config     - Design token CSS and Tailwind theme
    └── shared-utils     - cn(), delay(), getInitials()
```

pnpm workspace with `workspace:*` references. No npm publishing, packages are resolved locally at build time.

---

## Module federation

```
Host (3000)
  ├── remoteProducts - http://localhost:3001/assets/remoteEntry.js
  └── remoteAccount  - http://localhost:3002/assets/remoteEntry.js
```

Each remote exposes exactly one entry (`./App`). The host lazy-loads both inside a `RemoteErrorBoundary` and `Suspense` wrapper.

**Shared dependencies**: `react`, `react-dom`, `react-router-dom`, and `@tanstack/react-query` are listed in the `shared` block of every app's federation config with `requiredVersion` semver constraints. At runtime the share scope checks whether the already-loaded version satisfies the constraint. If yes, it reuses it. This prevents two React instances from loading simultaneously.

`singleton: true` is not used, because it's not a supported option in `@originjs/vite-plugin-federation@1.4.1`. `requiredVersion` is the correct mechanism in this plugin version.

**Remote contract**: the only prop the host passes to a remote:

```typescript
// packages/shared-types/src/remote.types.ts
export type RemoteAppProps = { basePath: string };
```

Remotes use `basePath` to build absolute paths like `${basePath}/detail/${id}`. They don't hardcode their mount point.

---

## Routing

### Host routes (`apps/host/src/routes/index.tsx`)

```
/           - HomePage
/products/* - RemoteProductsApp  (lazy, Suspense, ErrorBoundary)
/account/*  - RemoteAccountApp   (lazy, Suspense, ErrorBoundary)
/404        - NotFoundPage
*           - redirect to /404
```

Route paths are typed constants without inline strings:

```typescript
// apps/host/src/constants/routes.ts
export const ROUTES = { HOME: "/", PRODUCTS: "/products", ACCOUNT: "/account" } as const;
```

### Remote routes

Remotes render `<Routes>` directly (no `BrowserRouter`). They inherit the host's router context.

```typescript
// apps/remote-products/src/constants/routes.ts
export const PRODUCT_ROUTES = {
    LIST: "/list",
    DETAIL: "/detail/:id",
    detailPath: (id: string) => `/detail/${id}`,
} as const;

// apps/remote-account/src/constants/routes.ts
export const ACCOUNT_ROUTES = { PROFILE: "/profile", SETTINGS: "/settings" } as const;
```

`detailPath(id)` encapsulates the template literal so nothing outside this file does string interpolation on a route.

---

## Provider hierarchy

```
<QueryClientProvider>    host/src/App.tsx - staleTime: 60s, gcTime: 5min, retry: 1
  <SessionProvider>      host/src/context/SessionContext.tsx
    <RouterProvider>     host/src/routes/index.tsx
      <AppShell>         Header, Footer
        <Outlet />       remote App mounted here
```

The `QueryClient` is instantiated once in the host. Remotes never create their own. This means a mutation in `remote-account` can call `invalidateQueries` and invalidate a key that `remote-products` reads.

`SessionProvider` memoizes its context value and stabilizes callbacks with `useCallback`. `useSession()` throws if called outside the provider rather than returning `undefined`.

---

## Data layer

Every remote follows the same three layer structure:

```
Component
  - useProductsQuery()          queries/products.queries.ts
    - getProducts()             services/products.api.ts
      - delay(API_DELAY.LIST)   data/products.ts
```

**Service layer** (`services/*.api.ts`): pure async functions. No React, no hooks. The only mock artifact is `delay()`. Replacing it with a real `fetch` call is a single-file change with no impact on the component layer.

**Query layer** (`queries/*.queries.ts`): TanStack Query hooks. Query keys, staleTime overrides, and mutation side-effects (cache invalidation) live here. Components never import from `@tanstack/react-query` directly.

**Component layer**: calls hooks, renders data. No fetching, no cache management.

### Mutation pattern

Service functions return a discriminated union:

```typescript
// packages/shared-types/src/api.types.ts
export type MutationOutcome<TData = void> =
    | { success: true; data?: TData }
    | { success: false; serverError: ServerFieldError };
```

TypeScript narrows `serverError` as unconditionally present in the `success: false` branch. No optional chaining, no `catch (e: unknown)` handling.

```typescript
const result = await updateProfile(data);

if (!result.success) {
    setError(result.serverError.field as keyof SettingsFormData, {
        message: result.serverError.message,
    });
    return;
}

reset(data);
await queryClient.invalidateQueries({ queryKey: ["profile"] });
```

---

## Form architecture

Settings form pattern (`apps/remote-account`):

```
settingsSchema (Zod)
  - SettingsFormData = z.infer<typeof settingsSchema>
  - useForm<SettingsFormData>({ resolver: zodResolver(settingsSchema) })
  - onSubmit -> updateProfile() -> MutationOutcome
```

Zod schema and TypeScript type are the same definition. `superRefine` handles the cross-field password confirmation check without a second schema. `ROLES` is passed directly to `z.enum(ROLES)`. The validator and the dropdown options reference the same constant.

---

## Type conventions

**`type` for component props, `interface` for domain models:**

```typescript
// Component props: type and intersection for HTML attributes
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    loading?: boolean;
};

// Domain model: interface
export interface UserProfile extends Omit<User, "bio"> {
    bio: string;
    marketingEmails: boolean;
    stats: { orders: number; reviews: number; wishlist: number };
    recentActivity: ActivityItem[];
}
```

`interface` supports declaration merging. Component props should not be mergeable. `Omit<User, 'bio'>` ensures `UserProfile` inherits all `User` fields; adding a field to `User` propagates automatically.

**`satisfies` for const safety:**

```typescript
// apps/remote-account/src/constants/roles.ts
export const ROLES = ["admin", "editor", "viewer"] as const satisfies readonly UserRole[];
```

Adding a value to the `UserRole` union but forgetting to add it to `ROLES` is a compile error. The schema, dropdown options, and type stay in sync.

---

## Error handling

`RemoteErrorBoundary` wraps each remote's lazy import. If a remote fails to load (network error, build error, version mismatch), the user sees a named error state with a retry button.

`RemoteSuspenseFallback` renders while the remote entry file is being fetched.

---

## Tooling

- **ESLint 9** flat config: TypeScript, React Hooks, React Refresh plugins
- **Prettier** with `prettier-plugin-tailwindcss`: class ordering enforced
- **Husky + lint-staged**: ESLint fix and Prettier format on every commit
- **TypeScript strict**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` via `tsconfig.base.json`
- **`tailwindcss` direct devDep per app**: pnpm strict isolation prevents hoisting; each app must declare it

---

## Limitations

| Area            | Current state                      | What production requires                                       |
| --------------- | ---------------------------------- | -------------------------------------------------------------- |
| Remote URLs     | Hardcoded `localhost:3001/3002`    | Versioned entry URLs and manifest service                      |
| Mocking         | `delay()`                          | MSW handlers (reusable in tests and Storybook)                 |
| Session state   | React context                      | Zustand or server session at scale                             |
| Error reporting | Static UI in `RemoteErrorBoundary` | Sentry integration with remote name/version                    |
| E2E coverage    | None                               | Playwright to start all three servers, test cross-remote flows |
| Dark mode       | Token system ready                 | Add `[data-theme="dark"]` CSS overrides without rebuild needed |
