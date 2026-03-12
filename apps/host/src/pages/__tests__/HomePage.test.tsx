import { renderWithProviders, screen } from "@/test/test-utils";
import { HomePage } from "@/pages/HomePage";

describe("HomePage", () => {
    describe("hero section", () => {
        it("renders the main heading", () => {
            renderWithProviders(<HomePage />);
            expect(screen.getByRole("heading", { name: /microfrontend/i, level: 1 })).toBeInTheDocument();
        });

        it("shows a signed-in greeting with the user's name when the session is active", () => {
            renderWithProviders(<HomePage />);
            // MOCK_USER.fullName = "Fada Arzimanli"
            expect(screen.getByText(/signed in as/i)).toBeInTheDocument();
            expect(screen.getByText(/fada arzimanli/i)).toBeInTheDocument();
        });

        it("renders navigation links to Products and Account sections", () => {
            renderWithProviders(<HomePage />);

            const productsLink = screen.getByRole("link", { name: /products/i });
            const accountLink = screen.getByRole("link", { name: /account/i });

            expect(productsLink).toHaveAttribute("href", "/products");
            expect(accountLink).toHaveAttribute("href", "/account");
        });
    });

    describe("architecture cards", () => {
        it("renders architecture section heading", () => {
            renderWithProviders(<HomePage />);
            expect(screen.getByRole("heading", { name: /architecture/i })).toBeInTheDocument();
        });

        it("renders a card for each microfrontend module", () => {
            renderWithProviders(<HomePage />);

            expect(screen.getByText("Host Shell")).toBeInTheDocument();
            expect(screen.getByText("Remote: Products")).toBeInTheDocument();
            expect(screen.getByText("Remote: Account")).toBeInTheDocument();
        });

        it("renders the port badge for each module", () => {
            renderWithProviders(<HomePage />);

            expect(screen.getByText(":3000")).toBeInTheDocument();
            expect(screen.getByText(":3001")).toBeInTheDocument();
            expect(screen.getByText(":3002")).toBeInTheDocument();
        });

        it("lists feature items inside each architecture card", () => {
            renderWithProviders(<HomePage />);

            // Spot-check items from different cards
            expect(screen.getByText("Session context")).toBeInTheDocument();
            expect(screen.getByText("Product list")).toBeInTheDocument();
            expect(screen.getByText("Form validation")).toBeInTheDocument();
        });
    });
});
