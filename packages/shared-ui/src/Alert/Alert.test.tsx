import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
    describe("role and accessibility", () => {
        it("has role=alert so screen readers announce it immediately", () => {
            render(<Alert>Something happened.</Alert>);
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });
    });

    describe("content", () => {
        it("renders the message body", () => {
            render(<Alert>Your changes have been saved.</Alert>);
            expect(screen.getByText("Your changes have been saved.")).toBeInTheDocument();
        });

        it("renders the title when provided", () => {
            render(<Alert title="Success!">All done.</Alert>);
            expect(screen.getByText("Success!")).toBeInTheDocument();
        });

        it("renders both title and message together", () => {
            render(<Alert title="Error">Something went wrong.</Alert>);
            expect(screen.getByText("Error")).toBeInTheDocument();
            expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
        });

        it("renders without a title when the title prop is omitted", () => {
            render(<Alert>Just a message.</Alert>);
            expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        });
    });

    describe("variants", () => {
        it.each(["success", "error", "warning", "info"] as const)(
            "renders the %s variant without crashing",
            (variant) => {
                render(<Alert variant={variant}>Message</Alert>);
                expect(screen.getByRole("alert")).toBeInTheDocument();
            },
        );

        it("defaults to the info variant when no variant is specified", () => {
            render(<Alert>Message</Alert>);
            expect(screen.getByRole("alert")).toBeInTheDocument();
        });
    });
});
