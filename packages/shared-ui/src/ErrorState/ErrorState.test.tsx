import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
    describe("role and accessibility", () => {
        it("has role=alert so assistive technology announces the error", () => {
            render(<ErrorState />);
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });
    });

    describe("default content", () => {
        it("renders the default title when no title prop is supplied", () => {
            render(<ErrorState />);
            expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        });

        it("renders the default message when no message prop is supplied", () => {
            render(<ErrorState />);
            expect(screen.getByText(/please try again/i)).toBeInTheDocument();
        });
    });

    describe("custom content", () => {
        it("renders the custom title", () => {
            render(<ErrorState title="Failed to load products" />);
            expect(screen.getByText("Failed to load products")).toBeInTheDocument();
        });

        it("renders the custom message", () => {
            render(<ErrorState message="Check your connection and retry." />);
            expect(screen.getByText("Check your connection and retry.")).toBeInTheDocument();
        });
    });

    describe("retry action", () => {
        it("renders a Try again button when onRetry is provided", () => {
            render(<ErrorState onRetry={() => {}} />);
            expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
        });

        it("does not render a Try again button when onRetry is omitted", () => {
            render(<ErrorState />);
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });

        it("calls onRetry when Try again is clicked", async () => {
            const user = userEvent.setup();
            const handleRetry = vi.fn();

            render(<ErrorState onRetry={handleRetry} />);
            await user.click(screen.getByRole("button", { name: /try again/i }));

            expect(handleRetry).toHaveBeenCalledTimes(1);
        });
    });
});
