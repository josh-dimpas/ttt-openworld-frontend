import { createRouter as createTanStackRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

// Factory function for SSR - called per request on server
export function getRouter() {
    return createTanStackRouter({
        routeTree,
        defaultPreload: "intent",
        scrollRestoration: true,
    });
}

// Export default router instance for client-side
export const router = getRouter();

// Register things for typesafety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
