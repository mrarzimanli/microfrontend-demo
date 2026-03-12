import type { Preview } from "@storybook/react";
import "./preview.css";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            toc: true,
        },
        backgrounds: {
            default: "light",
            values: [
                { name: "light", value: "#f9fafb" },
                { name: "white", value: "#ffffff" },
                { name: "dark", value: "#111827" },
            ],
        },
    },
};

export default preview;
