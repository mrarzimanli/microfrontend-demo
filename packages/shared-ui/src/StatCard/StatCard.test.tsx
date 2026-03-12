import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
    describe("required content", () => {
        it("renders the label", () => {
            render(
                <StatCard
                    label="Total Products"
                    value={42}
                />,
            );
            expect(screen.getByText("Total Products")).toBeInTheDocument();
        });

        it("renders a numeric value", () => {
            render(
                <StatCard
                    label="Orders"
                    value={128}
                />,
            );
            expect(screen.getByText("128")).toBeInTheDocument();
        });

        it("renders a string value", () => {
            render(
                <StatCard
                    label="Rating"
                    value="4.8"
                />,
            );
            expect(screen.getByText("4.8")).toBeInTheDocument();
        });
    });

    describe("optional content", () => {
        it("renders the delta text when provided", () => {
            render(
                <StatCard
                    label="In Stock"
                    value={10}
                    delta="2 out of stock"
                />,
            );
            expect(screen.getByText("2 out of stock")).toBeInTheDocument();
        });

        it("does not render a delta element when the prop is omitted", () => {
            render(
                <StatCard
                    label="Total"
                    value={5}
                />,
            );
            expect(screen.queryByText(/out of stock/i)).not.toBeInTheDocument();
        });

        it("renders the icon when provided", () => {
            render(
                <StatCard
                    label="Orders"
                    value={10}
                    icon={<span data-testid="stat-icon" />}
                />,
            );
            expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
        });

        it("does not render an icon container when the icon prop is omitted", () => {
            render(
                <StatCard
                    label="Orders"
                    value={10}
                />,
            );
            expect(screen.queryByTestId("stat-icon")).not.toBeInTheDocument();
        });
    });

    describe("deltaType variants", () => {
        it.each(["positive", "negative", "neutral"] as const)(
            "renders the %s deltaType without crashing",
            (deltaType) => {
                render(
                    <StatCard
                        label="Metric"
                        value={1}
                        delta="+5%"
                        deltaType={deltaType}
                    />,
                );
                expect(screen.getByText("+5%")).toBeInTheDocument();
            },
        );
    });
});
