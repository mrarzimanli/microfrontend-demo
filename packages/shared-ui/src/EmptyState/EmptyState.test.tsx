import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
    describe("required content", () => {
        it("renders the title", () => {
            render(<EmptyState title="No results found" />);
            expect(screen.getByText("No results found")).toBeInTheDocument();
        });
    });

    describe("optional content", () => {
        it("renders the description when provided", () => {
            render(
                <EmptyState
                    title="No results"
                    description="Try adjusting your search."
                />,
            );
            expect(screen.getByText("Try adjusting your search.")).toBeInTheDocument();
        });

        it("does not render a description element when the prop is omitted", () => {
            render(<EmptyState title="No results" />);
            expect(screen.queryByText(/try adjusting/i)).not.toBeInTheDocument();
        });

        it("renders the icon when provided", () => {
            render(
                <EmptyState
                    title="No results"
                    icon={<span data-testid="empty-icon" />}
                />,
            );
            expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
        });

        it("does not render an icon container when the icon prop is omitted", () => {
            render(<EmptyState title="No results" />);
            expect(screen.queryByTestId("empty-icon")).not.toBeInTheDocument();
        });

        it("renders the action element when provided", () => {
            render(
                <EmptyState
                    title="No results"
                    action={<button>Clear filters</button>}
                />,
            );
            expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
        });

        it("calls the action's handler when clicked", async () => {
            const user = userEvent.setup();
            const handleClear = vi.fn();

            render(
                <EmptyState
                    title="No results"
                    action={<button onClick={handleClear}>Clear filters</button>}
                />,
            );

            await user.click(screen.getByRole("button", { name: "Clear filters" }));
            expect(handleClear).toHaveBeenCalledTimes(1);
        });
    });
});
