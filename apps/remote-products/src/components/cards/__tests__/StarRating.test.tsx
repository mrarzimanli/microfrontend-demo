import { render, screen } from "@testing-library/react";
import { StarRating } from "@/components/cards/StarRating";

describe("StarRating", () => {
    it("renders an accessible label with the rating value to one decimal place", () => {
        render(<StarRating rating={4.2} />);

        expect(screen.getByLabelText("4.2 out of 5 stars")).toBeInTheDocument();
    });

    it("displays the numeric rating text", () => {
        render(<StarRating rating={3.7} />);

        expect(screen.getByText("3.7")).toBeInTheDocument();
    });

    it("formats a whole-number rating with one decimal place", () => {
        render(<StarRating rating={5} />);

        expect(screen.getByText("5.0")).toBeInTheDocument();
        expect(screen.getByLabelText("5.0 out of 5 stars")).toBeInTheDocument();
    });

    it("renders exactly five star icons", () => {
        const { container } = render(<StarRating rating={3} />);

        // Stars are SVG elements (lucide icons) with aria-hidden
        const stars = container.querySelectorAll("svg[aria-hidden='true']");
        expect(stars).toHaveLength(5);
    });

    it("accepts the md size variant without crashing", () => {
        render(
            <StarRating
                rating={4}
                size="md"
            />,
        );

        expect(screen.getByLabelText("4.0 out of 5 stars")).toBeInTheDocument();
    });
});
