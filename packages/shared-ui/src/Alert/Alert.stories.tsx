import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
    title: "Composite/Alert",
    component: Alert,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["success", "error", "warning", "info"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    args: {
        variant: "info",
        children: "Your session will expire in 10 minutes.",
    },
};

export const WithTitle: Story = {
    args: {
        variant: "success",
        title: "Changes saved",
        children: "Your profile has been updated successfully.",
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            <Alert
                variant="success"
                title="Success"
            >
                Operation completed successfully.
            </Alert>
            <Alert
                variant="error"
                title="Error"
            >
                Failed to save changes. Please try again.
            </Alert>
            <Alert
                variant="warning"
                title="Warning"
            >
                You are approaching your storage limit.
            </Alert>
            <Alert
                variant="info"
                title="Info"
            >
                A new version is available. Refresh to update.
            </Alert>
        </div>
    ),
};
