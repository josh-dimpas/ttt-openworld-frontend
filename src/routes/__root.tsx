import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TooltipProvider } from "@/components/ui/tooltip";

const RootLayout = () => (
    <div className="h-screen min-h-0 w-screen">
        <TooltipProvider>
            <Outlet />
        </TooltipProvider>
    </div>
);

export const Route = createRootRoute({ component: RootLayout });
