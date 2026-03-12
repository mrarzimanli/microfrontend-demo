import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test/test-utils";
import { ProductListPage } from "@/pages/ProductListPage";
import { getProducts } from "@/services/products.api";
import { MOCK_PRODUCTS } from "@/data/products";
import { ALL_CATEGORY } from "@/constants/categories";

vi.mock("@/services/products.api");

const mockGetProducts = vi.mocked(getProducts);

const ELECTRONICS_COUNT = MOCK_PRODUCTS.filter((p) => p.category === "Electronics").length;
const ELECTRONICS_NAME = "Wireless Headphones Pro";
const FURNITURE_NAME = "Ergonomic Office Chair";

describe("ProductListPage", () => {
    beforeEach(() => {
        mockGetProducts.mockResolvedValue([...MOCK_PRODUCTS]);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("loading state", () => {
        it("renders the page header while products are loading", () => {
            mockGetProducts.mockImplementation(() => new Promise(() => {}));

            renderWithProviders(<ProductListPage basePath="/products" />);

            expect(screen.getByText("Products")).toBeInTheDocument();
        });
    });

    describe("success state", () => {
        it("renders all products once the query resolves", async () => {
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => expect(screen.getByText(ELECTRONICS_NAME)).toBeInTheDocument());

            expect(screen.getByText(FURNITURE_NAME)).toBeInTheDocument();
        });

        it("shows the total product count in the page header badge", async () => {
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => {
                expect(screen.getByText(`${MOCK_PRODUCTS.length} items`)).toBeInTheDocument();
            });
        });

        it("renders stat cards for total, in-stock, average rating, and categories", async () => {
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => expect(screen.getByText("Total Products")).toBeInTheDocument());

            expect(screen.getByText("In Stock")).toBeInTheDocument();
            expect(screen.getByText("Average rating")).toBeInTheDocument();
            expect(screen.getByText("Categories")).toBeInTheDocument();
        });

        it("shows a result count summary below the filters", async () => {
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => {
                expect(
                    screen.getByText(new RegExp(`Showing ${MOCK_PRODUCTS.length} of ${MOCK_PRODUCTS.length}`)),
                ).toBeInTheDocument();
            });
        });
    });

    describe("error state", () => {
        it("shows an error state when the product fetch fails", async () => {
            mockGetProducts.mockRejectedValue(new Error("Network error"));

            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => {
                expect(screen.getByText("Failed to load products")).toBeInTheDocument();
            });
        });
    });

    describe("category filter", () => {
        it("shows only Electronics products after clicking the Electronics button", async () => {
            const user = userEvent.setup();
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => screen.getByText(ELECTRONICS_NAME));

            await user.click(screen.getByRole("button", { name: "Electronics" }));

            await waitFor(() => {
                expect(screen.getByText(new RegExp(`Showing ${ELECTRONICS_COUNT} of`))).toBeInTheDocument();
            });

            expect(screen.queryByText(FURNITURE_NAME)).not.toBeInTheDocument();
        });

        it("marks the active category button as pressed", async () => {
            const user = userEvent.setup();
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => screen.getByText(ELECTRONICS_NAME));

            const allButton = screen.getByRole("button", { name: ALL_CATEGORY });
            expect(allButton).toHaveAttribute("aria-pressed", "true");

            await user.click(screen.getByRole("button", { name: "Electronics" }));

            await waitFor(() => {
                expect(screen.getByRole("button", { name: "Electronics" })).toHaveAttribute("aria-pressed", "true");
            });
            expect(allButton).toHaveAttribute("aria-pressed", "false");
        });
    });

    describe("search filter", () => {
        it("filters by product name when a search term is typed", async () => {
            const user = userEvent.setup();
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => screen.getByText(ELECTRONICS_NAME));

            await user.type(screen.getByRole("searchbox", { name: /search products/i }), "keyboard");

            await waitFor(() => {
                expect(screen.getByText("Mechanical Keyboard")).toBeInTheDocument();
            });
            expect(screen.queryByText(ELECTRONICS_NAME)).not.toBeInTheDocument();
        });

        it("shows the empty state with the search term when no results match", async () => {
            const user = userEvent.setup();
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => screen.getByText(ELECTRONICS_NAME));

            await user.type(screen.getByRole("searchbox", { name: /search products/i }), "nonexistentproductxyz");

            await waitFor(() => {
                expect(screen.getByText("No products match your search")).toBeInTheDocument();
            });
        });
    });

    describe("clear filters", () => {
        it("restores the full product list when Clear filters is clicked", async () => {
            const user = userEvent.setup();
            renderWithProviders(<ProductListPage basePath="/products" />);

            await waitFor(() => screen.getByText(ELECTRONICS_NAME));

            await user.type(screen.getByRole("searchbox", { name: /search products/i }), "nonexistentproductxyz");
            await waitFor(() => screen.getByText("No products match your search"));

            await user.click(screen.getByRole("button", { name: /clear filters/i }));

            await waitFor(() => {
                expect(screen.getByText(ELECTRONICS_NAME)).toBeInTheDocument();
            });
        });
    });
});
