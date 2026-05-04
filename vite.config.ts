import path from "path";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        tanstackStart({
            router: {
                entry: "./router.tsx",
            },
        }),
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        nitro(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    ssr: {
        noExternal: ["@tanstack/react-start"],
        external: ["js-cookie"],
    },
});
