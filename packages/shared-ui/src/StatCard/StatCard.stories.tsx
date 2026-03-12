import type { Meta, StoryObj } from "@storybook/react";
import { Package } from "lucide-react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
    title: "Components/StatCard",
    component: StatCard,
    tags: ["autodocs"],
    argTypes: {
        deltaType: {
            control: "select",
            options: ["positive", "negative", "neutral"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
    args: {
        label: "Total Products",
        value: 128,
        delta: "+12 this month",
        deltaType: "positive",
        icon: (
            <Package
                className="h-5 w-5"
                aria-hidden="true"
            />
        ),
    },
};

export const Negative: Story = {
    args: {
        label: "Out of Stock",
        value: 14,
        delta: "+3 since last week",
        deltaType: "negative",
        icon: (
            <Package
                className="h-5 w-5"
                aria-hidden="true"
            />
        ),
    },
};

export const NoIcon: Story = {
    args: {
        label: "Avg. Rating",
        value: "4.7",
        delta: "Out of 5.0",
        deltaType: "neutral",
    },
};

export const Grid: Story = {
    render: () => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Total Products"
                value={128}
                delta="+12 this month"
                deltaType="positive"
                icon={
                    <Package
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                }
            />
            <StatCard
                label="In Stock"
                value={114}
                delta="14 out of stock"
                deltaType="positive"
                icon={
                    <Package
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                }
            />
            <StatCard
                label="Avg. Rating"
                value="4.7"
                delta="Out of 5.0"
                deltaType="neutral"
                icon={
                    <Package
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                }
            />
            <StatCard
                label="Categories"
                value={5}
                delta="Distinct categories"
                deltaType="neutral"
                icon={
                    <Package
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                }
            />
        </div>
    ),
};
