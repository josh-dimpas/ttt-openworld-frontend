import { Outlet, createRootRoute } from "@tanstack/react-router";

const RootLayout = () => (
    <div className="w-screen h-screen min-h-0">
        <Outlet />
    </div>
);

export const Route = createRootRoute({ component: RootLayout });
