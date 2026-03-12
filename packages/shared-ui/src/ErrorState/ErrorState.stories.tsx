import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
    title: "Composite/ErrorState",
    component: ErrorState,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

export const WithRetry: Story = {
    args: {
        onRetry: () => alert("Retrying..."),
    },
};

export const CustomMessage: Story = {
    args: {
        title: "Failed to load products",
        message: "We could not reach the server. Check your connection and try again.",
        onRetry: () => alert("Retrying..."),
    },
};
