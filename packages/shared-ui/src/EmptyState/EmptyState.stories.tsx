import type { Meta, StoryObj } from "@storybook/react";
import { Search, Package } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button/Button";

const meta: Meta<typeof EmptyState> = {
    title: "Components/EmptyState",
    component: EmptyState,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    args: {
        icon: (
            <Search
                className="h-6 w-6"
                aria-hidden="true"
            />
        ),
        title: "No products found",
        description: 'No results for "mechanical keyboard" in Electronics.',
        action: (
            <Button
                variant="secondary"
                size="sm"
            >
                Clear filters
            </Button>
        ),
    },
};

export const NoIcon: Story = {
    args: {
        title: "No items yet",
        description: "Your wishlist is empty. Browse products to add items.",
    },
};

export const WithAction: Story = {
    args: {
        icon: (
            <Package
                className="h-6 w-6"
                aria-hidden="true"
            />
        ),
        title: "No orders yet",
        description: "You haven't placed any orders. Start browsing our catalog.",
        action: (
            <Button
                variant="primary"
                size="sm"
            >
                Browse Products
            </Button>
        ),
    },
};
