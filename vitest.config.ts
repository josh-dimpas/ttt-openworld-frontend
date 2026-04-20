import path from "path";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [tailwindcss()],
    test: {
        globals: true,
        environment: "jsdom",
        include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
        exclude: ["**/node_modules/**", "**/dist/**"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
