import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders its text content", () => {
        render(<Badge>Electronics</Badge>);
        expect(screen.getByText("Electronics")).toBeInTheDocument();
    });

    it("renders as an inline element (span)", () => {
        const { container } = render(<Badge>Label</Badge>);
        expect(container.firstChild?.nodeName).toBe("SPAN");
    });

    it("accepts and renders arbitrary children", () => {
        render(
            <Badge>
                <span data-testid="icon" /> Active
            </Badge>,
        );
        expect(screen.getByTestId("icon")).toBeInTheDocument();
        expect(screen.getByText("Active")).toBeInTheDocument();
    });

    describe("variants", () => {
        it.each(["success", "warning", "error", "info", "neutral", "accent"] as const)(
            "renders the %s variant without crashing",
            (variant) => {
                render(<Badge variant={variant}>Label</Badge>);
                expect(screen.getByText("Label")).toBeInTheDocument();
            },
        );

        it("defaults to the neutral variant when no variant is specified", () => {
            render(<Badge>Default</Badge>);
            expect(screen.getByText("Default")).toBeInTheDocument();
        });
    });
});
