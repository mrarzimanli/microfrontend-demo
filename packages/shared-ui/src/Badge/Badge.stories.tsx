import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
    title: "Primitives/Badge",
    component: Badge,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["success", "warning", "error", "info", "neutral", "accent"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: { variant: "neutral", children: "Category" },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
            <Badge variant="error">Out of Stock</Badge>
            <Badge variant="info">New</Badge>
            <Badge variant="neutral">Electronics</Badge>
            <Badge variant="accent">Admin</Badge>
        </div>
    ),
};
