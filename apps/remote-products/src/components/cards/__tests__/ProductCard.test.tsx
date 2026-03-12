import { renderWithProviders, screen } from "@/test/test-utils";
import { ProductCard } from "@/components/cards/ProductCard";
import { MOCK_PRODUCTS } from "@/data/products";

const IN_STOCK = MOCK_PRODUCTS.find((p) => p.inStock)!; // p-1: Wireless Headphones Pro
const OUT_OF_STOCK = MOCK_PRODUCTS.find((p) => !p.inStock)!; // p-3: Ergonomic Office Chair
const BASE_PATH = "/products";

describe("ProductCard", () => {
    describe("content rendering", () => {
        it("renders the product name", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByText(IN_STOCK.name)).toBeInTheDocument();
        });

        it("renders the price formatted to two decimal places", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByText(`$${IN_STOCK.price.toFixed(2)}`)).toBeInTheDocument();
        });

        it("renders the product category badge", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByText(IN_STOCK.category)).toBeInTheDocument();
        });

        it("renders the product description", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByText(IN_STOCK.description)).toBeInTheDocument();
        });

        it("renders an image with the product name as alt text", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByRole("img", { name: IN_STOCK.name })).toBeInTheDocument();
        });

        it("renders a star rating for the product", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByLabelText(`${IN_STOCK.rating.toFixed(1)} out of 5 stars`)).toBeInTheDocument();
        });
    });

    describe("navigation", () => {
        it("links to the product detail page using basePath and product id", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("href", `${BASE_PATH}/detail/${IN_STOCK.id}`);
        });
    });

    describe("stock status", () => {
        it("does not show an Out of Stock overlay for in-stock products", () => {
            renderWithProviders(
                <ProductCard
                    product={IN_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.queryByText("Out of Stock")).not.toBeInTheDocument();
        });

        it("shows an Out of Stock overlay when the product is unavailable", () => {
            renderWithProviders(
                <ProductCard
                    product={OUT_OF_STOCK}
                    basePath={BASE_PATH}
                />,
            );

            expect(screen.getByText("Out of Stock")).toBeInTheDocument();
        });
    });
});
