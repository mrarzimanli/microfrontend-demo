import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";
import { Button } from "../Button/Button";

const meta: Meta<typeof PageHeader> = {
    title: "Components/PageHeader",
    component: PageHeader,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
    args: {
        title: "Products",
        description: "Browse the full catalog. Filter by category or search by name.",
    },
};

export const WithBadge: Story = {
    args: {
        title: "Products",
        description: "Browse the full catalog.",
        badge: "128 items",
    },
};

export const WithAction: Story = {
    args: {
        title: "Account Settings",
        description: "Manage your profile and preferences.",
        actions: (
            <Button
                variant="primary"
                size="sm"
            >
                Save Changes
            </Button>
        ),
    },
};

export const FullyLoaded: Story = {
    args: {
        title: "Products",
        description: "Browse the full catalog. Filter by category or search by name.",
        badge: "128 items",
        actions: (
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                >
                    Export
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                >
                    Add Product
                </Button>
            </div>
        ),
    },
};
