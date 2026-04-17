import { Outlet, createRootRoute } from "@tanstack/react-router";

const RootLayout = () => (
    <div className="h-screen min-h-0 w-screen">
        <Outlet />
    </div>
);

export const Route = createRootRoute({ component: RootLayout });
