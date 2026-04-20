import { defineConfig } from "vitest/config";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [tailwindcss()],
    test: {
        globals: true,
        environment: "jsdom",
        include: ["test.*.ts", "test.*.tsx"],
        exclude: ["**/node_modules/**", "**/dist/**"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});