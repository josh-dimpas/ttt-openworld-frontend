import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
        ],
        links: [
            { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        ],
    }),
    shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>
            <body>
                <div className="h-screen min-h-0 w-screen">
                    <QueryClientProvider client={queryClient}>
                        <TooltipProvider>{children}</TooltipProvider>
                    </QueryClientProvider>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
