import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
    title: "Primitives/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "danger", "ghost"],
            description: "Visual style of the button",
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg"],
            description: "Size of the button",
        },
        loading: {
            control: "boolean",
            description: "Shows a spinner and disables the button",
        },
        disabled: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: "primary",
        size: "md",
        children: "Save Changes",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        size: "md",
        children: "Cancel",
    },
};

export const Danger: Story = {
    args: {
        variant: "danger",
        size: "md",
        children: "Delete Account",
    },
};

export const Ghost: Story = {
    args: {
        variant: "ghost",
        size: "md",
        children: "Learn more",
    },
};

export const Loading: Story = {
    args: {
        variant: "primary",
        size: "md",
        loading: true,
        children: "Saving...",
    },
};

export const Disabled: Story = {
    args: {
        variant: "primary",
        size: "md",
        disabled: true,
        children: "Not available",
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
        </div>
    ),
};
