import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        federation({
            name: "remoteAccount",
            filename: "remoteEntry.js",
            exposes: {
                "./App": "./src/App.tsx",
            },
            shared: {
                react: { requiredVersion: "^19.0.0" },
                "react-dom": { requiredVersion: "^19.0.0" },
                "react-router-dom": { requiredVersion: "^7.0.0" },
                "@tanstack/react-query": { requiredVersion: "^5.0.0" },
            },
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        modulePreload: false,
        target: "esnext",
        cssCodeSplit: false,
    },
    server: {
        port: 3002,
        cors: true,
    },
    preview: {
        port: 3002,
        cors: true,
    },
});
