import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
    title: "Primitives/Card",
    component: Card,
    tags: ["autodocs"],
    argTypes: {
        padding: {
            control: "select",
            options: ["none", "sm", "md", "lg"],
        },
        hoverable: {
            control: "boolean",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        padding: "md",
        children: "Card content goes here.",
    },
};

export const Hoverable: Story = {
    args: {
        padding: "md",
        hoverable: true,
        children: "Hover over this card to see the shadow effect.",
    },
};

export const AllPaddings: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <Card padding="none">
                <div className="bg-muted rounded-xl p-4 text-sm">padding: none</div>
            </Card>
            <Card padding="sm">Small padding</Card>
            <Card padding="md">Medium padding (default)</Card>
            <Card padding="lg">Large padding</Card>
        </div>
    ),
};
