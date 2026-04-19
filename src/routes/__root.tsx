import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet, createRootRoute } from "@tanstack/react-router";

const RootLayout = () => (
    <div className="w-screen h-screen min-h-0">
        <TooltipProvider>
            <Outlet />
        </TooltipProvider>
    </div>
);

export const Route = createRootRoute({ component: RootLayout });
