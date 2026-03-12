import { render, screen } from "@testing-library/react";
import type { FieldError } from "react-hook-form";
import { FormField } from "@/components/form/FormField";

const makeError = (message: string): FieldError => ({ type: "required", message });

describe("FormField", () => {
    describe("label", () => {
        it("renders a label associated with the input via htmlFor", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                >
                    <input id="email" />
                </FormField>,
            );

            expect(screen.getByLabelText("Email")).toBeInTheDocument();
        });

        it("renders a required asterisk when required is true", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                    required
                >
                    <input id="email" />
                </FormField>,
            );

            expect(screen.getByText("*")).toBeInTheDocument();
        });

        it("does not render an asterisk when required is not set", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                >
                    <input id="email" />
                </FormField>,
            );

            expect(screen.queryByText("*")).not.toBeInTheDocument();
        });
    });

    describe("hint text", () => {
        it("renders hint text when the hint prop is provided", () => {
            render(
                <FormField
                    label="Bio"
                    htmlFor="bio"
                    hint="Max 300 characters"
                >
                    <textarea id="bio" />
                </FormField>,
            );

            expect(screen.getByText("Max 300 characters")).toBeInTheDocument();
        });

        it("passes aria-describedby pointing to the hint element", () => {
            render(
                <FormField
                    label="Bio"
                    htmlFor="bio"
                    hint="Max 300 characters"
                >
                    <textarea id="bio" />
                </FormField>,
            );

            expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "bio-hint");
        });

        it("does not render a hint element when hint is not provided", () => {
            render(
                <FormField
                    label="Name"
                    htmlFor="name"
                >
                    <input id="name" />
                </FormField>,
            );

            // No aria-describedby on the input when there is no hint or error
            expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-describedby");
        });
    });

    describe("error state", () => {
        it("renders an error message with role=alert when error is present", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                    error={makeError("This field is required")}
                >
                    <input id="email" />
                </FormField>,
            );

            const alert = screen.getByRole("alert");
            expect(alert).toHaveTextContent("This field is required");
        });

        it("sets aria-invalid on the child input when there is an error", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                    error={makeError("Required")}
                >
                    <input id="email" />
                </FormField>,
            );

            expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
        });

        it("sets aria-describedby pointing to the error element", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                    error={makeError("Required")}
                >
                    <input id="email" />
                </FormField>,
            );

            expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "email-error");
        });

        it("does not render an alert when no error is provided", () => {
            render(
                <FormField
                    label="Name"
                    htmlFor="name"
                >
                    <input id="name" />
                </FormField>,
            );

            expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        });
    });

    describe("hint and error together", () => {
        it("includes both hint and error ids in aria-describedby", () => {
            render(
                <FormField
                    label="Email"
                    htmlFor="email"
                    hint="Use your work email"
                    error={makeError("Invalid email")}
                >
                    <input id="email" />
                </FormField>,
            );

            const describedBy = screen.getByRole("textbox").getAttribute("aria-describedby");
            expect(describedBy).toContain("email-hint");
            expect(describedBy).toContain("email-error");
        });
    });
});
