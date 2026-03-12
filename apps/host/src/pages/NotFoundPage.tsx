import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function NotFoundPage() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <p className="text-muted text-8xl font-bold">404</p>
            <h1 className="text-foreground text-2xl font-semibold">Page not found</h1>
            <p className="text-foreground-muted">The page you are looking for does not exist.</p>
            <Link
                to={ROUTES.HOME}
                className="bg-primary text-primary-foreground hover:bg-primary-hover mt-2 rounded-lg px-5 py-2.5 font-medium transition-colors"
            >
                Back to Home
            </Link>
        </div>
    );
}
