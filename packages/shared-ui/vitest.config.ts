import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        // CSS is irrelevant for behaviour tests — skip parsing it.
        css: false,
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
    },
});
