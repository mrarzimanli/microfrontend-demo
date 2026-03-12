import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { ROUTES } from "@/constants/routes";

const MODULE_BADGE_CLASSES = {
    host: "bg-accent text-accent-foreground",
    products: "bg-emerald-100 text-emerald-800",
    account: "bg-brand-100 text-brand-700",
} as const;

const ARCHITECTURE_CARDS = [
    {
        title: "Host Shell",
        port: ":3000",
        badgeClass: MODULE_BADGE_CLASSES.host,
        description: "Handles app layout, shared navigation, and top-level routing for the remotes.",
        items: ["App layout", "Top-level routing", "Session context", "Error boundary"],
    },
    {
        title: "Remote: Products",
        port: ":3001",
        badgeClass: MODULE_BADGE_CLASSES.products,
        description: "Products module with its own routes, data layer, and UI.",
        items: ["Product list", "Product details", "Local routing", "Mock API"],
    },
    {
        title: "Remote: Account",
        port: ":3002",
        badgeClass: MODULE_BADGE_CLASSES.account,
        description: "Account module with profile and settings screens.",
        items: ["Profile page", "Settings form", "Form validation", "Mock server errors"],
    },
] as const;

export function HomePage() {
    const { user, isAuthenticated } = useSession();

    return (
        <div className="space-y-12">
            <section className="from-primary to-brand-500 rounded-2xl bg-linear-to-br px-8 py-16 text-white shadow-lg">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Microfrontend</h1>
                    <p className="mt-4 text-lg text-white/80">
                        A simple microfrontend setup built with React, Vite, and Module Federation.
                    </p>
                    {isAuthenticated && user && (
                        <p className="mt-3 text-sm text-white/70">
                            Signed in as <strong>{user.fullName}</strong>!
                        </p>
                    )}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to={ROUTES.PRODUCTS}
                            className="text-primary hover:bg-secondary-hover rounded-lg bg-white px-6 py-3 font-semibold shadow transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            to={ROUTES.ACCOUNT}
                            className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            Account
                        </Link>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-foreground mb-6 text-2xl font-bold">Architecture</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                    {ARCHITECTURE_CARDS.map((app) => (
                        <div
                            key={app.title}
                            className="border-border bg-surface shadow-card rounded-xl border p-6"
                        >
                            <div className="mb-3 flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${app.badgeClass}`}
                                >
                                    {app.port}
                                </span>
                                <h3 className="text-foreground font-semibold">{app.title}</h3>
                            </div>
                            <p className="text-foreground-muted mb-4 text-sm">{app.description}</p>
                            <ul className="space-y-1">
                                {app.items.map((item) => (
                                    <li
                                        key={item}
                                        className="text-foreground-muted flex items-center gap-2 text-sm"
                                    >
                                        <Check
                                            className="text-success h-4 w-4 shrink-0"
                                            aria-hidden="true"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
