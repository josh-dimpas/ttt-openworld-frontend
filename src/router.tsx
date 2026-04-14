import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Setup router instance
export const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
});

//  Register things for typesafety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
