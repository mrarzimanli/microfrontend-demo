import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { cn } from "@micro/shared-ui";
import { useSession } from "@/context/SessionContext";
import { ROUTES } from "@/constants/routes";

const NAV_ITEMS = [
    { to: ROUTES.HOME, label: "Home", end: true },
    { to: ROUTES.PRODUCTS, label: "Products", end: false },
    { to: ROUTES.ACCOUNT, label: "Account", end: false },
] as const;

export function Header() {
    const { user, isAuthenticated, logout } = useSession();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate(ROUTES.HOME);
    }

    return (
        <header className="bg-surface border-border sticky top-0 z-(--z-sticky) border-b shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to={ROUTES.HOME}
                    className="text-primary flex items-center gap-2 font-bold"
                    aria-label="MicroShop home"
                >
                    <ShoppingCart
                        className="h-7 w-7"
                        aria-hidden="true"
                    />
                </Link>

                <nav
                    className="hidden gap-1 sm:flex"
                    aria-label="Main navigation"
                >
                    {NAV_ITEMS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                cn(
                                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-foreground-muted hover:bg-muted hover:text-foreground",
                                )
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {isAuthenticated && user ? (
                        <>
                            <div className="hidden items-center gap-2 sm:flex">
                                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                                    {user.fullName.charAt(0)}
                                </div>
                                <span className="text-foreground text-sm font-medium">{user.fullName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="border-border text-foreground-muted hover:bg-muted rounded-md border px-3 py-1.5 text-sm transition-colors"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <Link
                            to={ROUTES.ACCOUNT}
                            className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
