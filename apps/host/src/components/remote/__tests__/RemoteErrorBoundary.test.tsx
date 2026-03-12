import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RemoteErrorBoundary } from "@/components/remote/RemoteErrorBoundary";

// A minimal component that either throws or renders normally based on a prop.
function ThrowingChild({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) throw new Error("Module load failed");
    return <div>Module content</div>;
}

describe("RemoteErrorBoundary", () => {
    beforeEach(() => {
        // React logs caught errors to console.error even when they are handled
        // by an error boundary. Suppress that output so tests stay readable.
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders children normally when no error occurs", () => {
        render(
            <RemoteErrorBoundary remoteName="Products">
                <ThrowingChild shouldThrow={false} />
            </RemoteErrorBoundary>,
        );

        expect(screen.getByText("Module content")).toBeInTheDocument();
    });

    it("shows an error UI when a child component throws", () => {
        render(
            <RemoteErrorBoundary remoteName="Products">
                <ThrowingChild shouldThrow={true} />
            </RemoteErrorBoundary>,
        );

        expect(screen.queryByText("Module content")).not.toBeInTheDocument();
        expect(screen.getByText("Products is unavailable")).toBeInTheDocument();
    });

    it("includes the remote name in the error heading", () => {
        render(
            <RemoteErrorBoundary remoteName="Account">
                <ThrowingChild shouldThrow={true} />
            </RemoteErrorBoundary>,
        );

        expect(screen.getByText("Account is unavailable")).toBeInTheDocument();
    });

    it("displays the thrown error message to help with debugging", () => {
        render(
            <RemoteErrorBoundary remoteName="Products">
                <ThrowingChild shouldThrow={true} />
            </RemoteErrorBoundary>,
        );

        expect(screen.getByText("Module load failed")).toBeInTheDocument();
    });

    it("resets the error state and re-renders children when Retry is clicked", async () => {
        const user = userEvent.setup();

        // Wrapping the child in a state-controlled container ensures that when
        // the boundary resets, the recovered child is already in place and does
        // not throw again (which would immediately re-trigger the boundary).
        function RecoverableWrapper() {
            const [shouldThrow, setShouldThrow] = React.useState(true);
            return (
                <>
                    <button
                        data-testid="recover"
                        onClick={() => setShouldThrow(false)}
                    />
                    <RemoteErrorBoundary remoteName="Products">
                        <ThrowingChild shouldThrow={shouldThrow} />
                    </RemoteErrorBoundary>
                </>
            );
        }

        render(<RecoverableWrapper />);

        expect(screen.getByText("Products is unavailable")).toBeInTheDocument();

        // Flip the child to a non-throwing state before resetting the boundary.
        await user.click(screen.getByTestId("recover"));
        await user.click(screen.getByRole("button", { name: /retry/i }));

        expect(screen.getByText("Module content")).toBeInTheDocument();
        expect(screen.queryByText("Products is unavailable")).not.toBeInTheDocument();
    });
});
