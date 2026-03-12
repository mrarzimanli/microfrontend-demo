import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, within } from "@/test/test-utils";
import { Header } from "@/components/layout/Header";

describe("Header", () => {
    describe("navigation", () => {
        it("renders links for Home, Products, and Account", () => {
            renderWithProviders(<Header />);

            // Use within() so we scope the query to the nav element and avoid
            // the logo link whose aria-label "MicroShop home" also contains "home".
            const nav = screen.getByRole("navigation", { name: /main navigation/i });
            expect(within(nav).getByRole("link", { name: "Home" })).toBeInTheDocument();
            expect(within(nav).getByRole("link", { name: "Products" })).toBeInTheDocument();
            expect(within(nav).getByRole("link", { name: "Account" })).toBeInTheDocument();
        });

        it("renders the MicroShop home logo link", () => {
            renderWithProviders(<Header />);
            expect(screen.getByRole("link", { name: /microshop home/i })).toBeInTheDocument();
        });
    });

    describe("authenticated state", () => {
        it("shows the authenticated user's full name", () => {
            renderWithProviders(<Header />);
            // MOCK_USER defaults to "Fada Arzimanli"
            expect(screen.getByText("Fada Arzimanli")).toBeInTheDocument();
        });

        it("renders a Sign out button when a user is logged in", () => {
            renderWithProviders(<Header />);
            expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
        });

        it("does not show the Sign in link when the session is active", () => {
            renderWithProviders(<Header />);
            expect(screen.queryByRole("link", { name: /sign in/i })).not.toBeInTheDocument();
        });
    });

    describe("sign out flow", () => {
        it("clears the session and shows Sign in after clicking Sign out", async () => {
            const user = userEvent.setup();
            renderWithProviders(<Header />);

            await user.click(screen.getByRole("button", { name: /sign out/i }));

            expect(screen.queryByText("Fada Arzimanli")).not.toBeInTheDocument();
            expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
            expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
        });
    });
});
