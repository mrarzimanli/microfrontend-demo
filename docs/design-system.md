# Design system

## Token architecture

Design tokens are CSS custom properties defined in `packages/shared-config/src/styles/tokens.css`. Every app imports this file and uses the variables via Tailwind utilities. There is no `tailwind.config.js` and no `tailwind-preset.js`. The project uses **Tailwind CSS v4**, which is configured entirely through CSS.

### How the pipeline works

```
tokens.css         - :root { --color-primary: var(--color-brand-600); }
                                         |
theme.css          - @theme inline { --color-primary: var(--color-primary); }
                                         |
Component          - className="bg-primary text-primary-foreground"
```

1. **`tokens.css`** defines all values as `:root` CSS custom properties: primitives and semantics.
2. **`theme.css`** uses Tailwind v4's `@theme inline` block to expose those CSS variables as Tailwind utilities. `@theme inline` tells Tailwind to generate utility classes that reference the variable at runtime rather than inlining the value at build time.
3. Each app's CSS entry file imports `tailwindcss`, then `tokens.css`, then `theme.css` in that order.

This approach means `tailwindcss` must be a direct `devDependency` in each app (pnpm's strict isolation prevents hoisting). There is no shared config file that needs to be kept in sync.

CSS variables allow tokens to be overridden at any scope at runtime (e.g. `[data-theme="dark"]`) without rebuilding. The host stylesheet loads first; remotes inherit the same `:root` values. Consistent tokens across three separately-built apps without a shared config file.

---

## Token peference

### Color - Primitives

Primitives are raw palette values. Components never reference them directly.

| Token                                                   | Value         | Note                    |
| ------------------------------------------------------- | ------------- | ----------------------- |
| `--color-brand-50` … `--color-brand-900`                | Indigo scale  | Brand palette           |
| `--color-neutral-50` … `--color-neutral-900`            | Gray scale    | Text and surfaces       |
| `--color-emerald-*`, `--color-amber-*`, `--color-red-*` | Status scales | Used by semantic tokens |

### Color - Semantics

Semantic tokens carry intent. These are what components reference.

| Token                                                                            | Purpose                     |
| -------------------------------------------------------------------------------- | --------------------------- |
| `--color-primary` / `--color-primary-hover` / `--color-primary-foreground`       | Brand action color          |
| `--color-secondary` / `--color-secondary-hover` / `--color-secondary-foreground` | Neutral action              |
| `--color-destructive` / `--color-destructive-foreground`                         | Error, danger               |
| `--color-success` / `--color-success-foreground`                                 | Positive confirmation       |
| `--color-warning` / `--color-warning-foreground`                                 | Caution                     |
| `--color-muted` / `--color-muted-foreground`                                     | Disabled, secondary content |
| `--color-accent` / `--color-accent-foreground`                                   | Brand highlight             |
| `--color-background`                                                             | Page background             |
| `--color-surface`                                                                | Card, panel background      |
| `--color-border`                                                                 | Default border              |
| `--color-input`                                                                  | Input border                |
| `--color-ring`                                                                   | Focus ring                  |
| `--color-foreground` / `--color-foreground-muted`                                | Primary and secondary text  |

### Typography

| Token                                   | Value                 |
| --------------------------------------- | --------------------- |
| `--font-sans`                           | `"Inter", sans-serif` |
| `--text-2xs` … `--text-4xl`             | 0.625rem to 2.25rem   |
| `--font-normal` … `--font-bold`         | 400, 500, 600, 700    |
| `--leading-tight` … `--leading-relaxed` | 1.25 to 1.625         |

### Spacing

8-point scale: `--space-1` (0.25rem) through `--space-16` (4rem).

### Border radius

`--radius-xs` (0.25rem) through `--radius-full` (9999px).

### Elevation (shadows)

| Token                                       | Use case           |
| ------------------------------------------- | ------------------ |
| `--shadow-sm`, `--shadow-md`, `--shadow-lg` | General elevation  |
| `--shadow-card`                             | Resting card       |
| `--shadow-card-hover`                       | Card on hover      |
| `--shadow-input`                            | Input inset shadow |
| `--shadow-input-focus`                      | Focus ring glow    |

### Motion

| Token                 | Value                             | Use                     |
| --------------------- | --------------------------------- | ----------------------- |
| `--motion-fast`       | 100ms                             | Micro-interactions      |
| `--motion-base`       | 200ms                             | Standard transitions    |
| `--motion-slow`       | 300ms                             | Panel/image transitions |
| `--motion-deliberate` | 500ms                             | Page-level animations   |
| `--ease-default`      | cubic-bezier(0.4, 0, 0.2, 1)      | General                 |
| `--ease-out`          | cubic-bezier(0, 0, 0.2, 1)        | Entrances               |
| `--ease-bounce`       | cubic-bezier(0.34, 1.56, 0.64, 1) | Playful                 |

---

## Component library (`packages/shared-ui`)

All components are owned source code, not a third-party library dependency. Each component lives in its own directory with an implementation file, an index re-export, and a Storybook story.

### Primitives

| Component | Props                                                               | Notes                                                                |
| --------- | ------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Button`  | `variant`, `size`, `loading`, `disabled`, `...HTMLButtonAttributes` | 4 variants × 3 sizes; shows spinner when `loading`                   |
| `Badge`   | `variant`, `children`, `className`                                  | 6 semantic variants (success, warning, error, info, neutral, accent) |
| `Spinner` | `size`, `label`, `className`                                        | Screen-reader `label` via `sr-only`; 3 sizes                         |

### Composites

| Component    | Props                                                       | Notes                                                 |
| ------------ | ----------------------------------------------------------- | ----------------------------------------------------- |
| `Card`       | `padding`, `hoverable`, `children`, `className`             | Surface container; `hoverable` adds shadow transition |
| `Alert`      | `variant`, `title`, `children`, `className`                 | 4 variants with icons; uses `role="alert"`            |
| `PageHeader` | `title`, `description`, `badge`, `actions`, `className`     | Consistent page headings; `actions` slot for buttons  |
| `StatCard`   | `label`, `value`, `delta`, `deltaType`, `icon`, `className` | KPI card; `deltaType` colors the delta value          |
| `EmptyState` | `title`, `description`, `icon`, `action`, `className`       | Zero-state; `action` slot for CTA                     |
| `ErrorState` | `title`, `message`, `onRetry`, `className`                  | Error state; `onRetry` shows a retry button           |

### Skeleton system

All skeleton composites live in `packages/shared-ui/src/Skeleton/Skeleton.tsx` and are exported from the package root.

| Export                | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| `Skeleton`            | Raw animated shimmer block — base primitive                     |
| `StatCardSkeleton`    | Matches `StatCard` layout during loading                        |
| `ProductCardSkeleton` | Matches `ProductCard` layout during loading                     |
| `FormSkeleton`        | Stacked label + input shimmer rows; configurable `fields` count |

Keeping all skeleton composites in one file means importing any skeleton variant is a single import from `@micro/shared-ui`.

---

## Component Prop Conventions

### `type` not `interface`

All component props use `type` declarations. `interface` is reserved for domain models.

```typescript
// Correct: simple props
export type CardProps = {
    children: React.ReactNode;
    padding?: "none" | "sm" | "md" | "lg";
};

// Correct: HTML attribute extension
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    loading?: boolean;
};
```

Intersection (`&`) replaces `extends` for HTML attribute types. This is equivalent for runtime behavior and consistent with the broader `type`-first convention.

Exported prop types use `export type`, not `export`. Type-only exports have zero runtime footprint and signal clearly that the export is a type contract, not a value.

### Semantic props over boolean flags

```typescript
// Preferred: intent is clear from the value
deltaType?: "positive" | "negative" | "neutral"
padding?: "none" | "sm" | "md" | "lg"
variant?: "primary" | "secondary" | "danger" | "ghost"

// Avoided: ambiguous at the call site
isPositive?: boolean
smallPadding?: boolean
```

### Composing classes

All components use `cn()` from `@micro/shared-utils` (re-exported from `@micro/shared-ui`) for class composition:

```typescript
import { cn } from "@micro/shared-utils";

cn(
    "base-class another-base",
    condition && "conditional-class",
    className, // always last
);
```

`cn()` is `clsx` + `tailwind-merge`. It deduplicates conflicting Tailwind classes correctly (e.g. `px-3` wins over `px-4` based on order of intent, not string position).

---

## Accessibility Baseline

Every interactive component includes the minimum required accessibility attributes:

- `Button` - inherits all `HTMLButtonAttributes`, `disabled` prop propagates correctly
- `ToggleSwitch` - `role="switch"`, `aria-checked`, `disabled`
- `FormField` - `aria-describedby` links hint and error messages to the input. `aria-invalid` set on error
- `Alert`, `ErrorState` - `role="alert"` for screen-reader announcement
- `Skeleton` composites - `aria-hidden="true"` is decorative, no content value
- `StarRating` - `aria-label` with numeric value (`4.2 out of 5 stars`)

---

## Storybook

The component library is documented in Storybook at `packages/shared-ui/.storybook/`.

```bash
pnpm storybook
# Opens http://localhost:6006
```

Tailwind v4 works in Storybook via a `viteFinal` hook in `.storybook/main.ts` that injects the `@tailwindcss/vite` plugin without separate PostCSS configuration.

Stories use `autodocs` for automatic prop table generation. Every component has a story file covering all variants and edge cases.

---

## Component testing

`packages/shared-ui` has its own Vitest setup (`vitest.config.ts`, jsdom environment) independent of any app. Tests are co-located inside each component's directory:

```
packages/shared-ui/src/
  Button/
    Button.tsx
    Button.stories.tsx
    Button.test.tsx       // co-located test
  Alert/
    Alert.tsx
    Alert.stories.tsx
    Alert.test.tsx
  ...
```

```bash
pnpm --filter @micro/shared-ui test
```

The test file convention is `ComponentName/ComponentName.test.tsx`. This keeps the component folder self-contained: implementation, stories, and tests in one place. There is no flat `__tests__` directory.

Each component test covers:

- All named variants render without errors
- Key prop behaviours (e.g. `loading` state on `Button`, `role="alert"` on `Alert` and `ErrorState`)
- Callback props fire correctly (e.g. `onRetry` on `ErrorState`)
- Accessibility attributes are present (`aria-disabled`, `aria-label`, `role`)
