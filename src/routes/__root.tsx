import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const RootLayout = () => (
    <div className="h-screen min-h-0 w-screen">
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Outlet />
            </TooltipProvider>
        </QueryClientProvider>
    </div>
);

export const Route = createRootRoute({ component: RootLayout });
