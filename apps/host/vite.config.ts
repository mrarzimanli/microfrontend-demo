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
            name: "host",
            remotes: {
                remoteProducts: "http://localhost:3001/assets/remoteEntry.js",
                remoteAccount: "http://localhost:3002/assets/remoteEntry.js",
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
        port: 3000,
        cors: true,
    },
    preview: {
        port: 3000,
        cors: true,
    },
});
