import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        css: false,
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        coverage: {
            reporter: ["text", "html"],
            exclude: ["node_modules/", "src/test/"],
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "remoteProducts/App": resolve(__dirname, "./src/test/__mocks__/remoteProducts.tsx"),
            "remoteAccount/App": resolve(__dirname, "./src/test/__mocks__/remoteAccount.tsx"),
        },
    },
});
