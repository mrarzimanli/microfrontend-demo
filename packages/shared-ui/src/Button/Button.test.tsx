import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
    describe("content", () => {
        it("renders its children", () => {
            render(<Button>Save changes</Button>);
            expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls the onClick handler when clicked", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);
            await user.click(screen.getByRole("button"));

            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it("does not call onClick when the button is disabled", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button
                    disabled
                    onClick={handleClick}
                >
                    Click me
                </Button>,
            );
            await user.click(screen.getByRole("button"));

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe("disabled state", () => {
        it("is disabled when the disabled prop is set", () => {
            render(<Button disabled>Submit</Button>);
            expect(screen.getByRole("button")).toBeDisabled();
        });

        it("is disabled while loading", () => {
            render(<Button loading>Submit</Button>);
            expect(screen.getByRole("button")).toBeDisabled();
        });

        it("does not call onClick while loading", async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(
                <Button
                    loading
                    onClick={handleClick}
                >
                    Submit
                </Button>,
            );
            await user.click(screen.getByRole("button"));

            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe("loading state", () => {
        it("renders the loading spinner when loading is true", () => {
            const { container } = render(<Button loading>Save</Button>);
            // The Loader2 icon is an SVG with aria-hidden
            const spinner = container.querySelector("svg[aria-hidden='true']");
            expect(spinner).toBeInTheDocument();
        });

        it("still renders children text alongside the spinner", () => {
            render(<Button loading>Saving...</Button>);
            expect(screen.getByText("Saving...")).toBeInTheDocument();
        });

        it("does not render a spinner when not loading", () => {
            const { container } = render(<Button>Save</Button>);
            const spinner = container.querySelector("svg");
            expect(spinner).not.toBeInTheDocument();
        });
    });

    describe("variants", () => {
        it.each(["primary", "secondary", "danger", "ghost"] as const)(
            "renders the %s variant without crashing",
            (variant) => {
                render(<Button variant={variant}>Label</Button>);
                expect(screen.getByRole("button")).toBeInTheDocument();
            },
        );
    });

    describe("sizes", () => {
        it.each(["sm", "md", "lg"] as const)("renders the %s size without crashing", (size) => {
            render(<Button size={size}>Label</Button>);
            expect(screen.getByRole("button")).toBeInTheDocument();
        });
    });
});
