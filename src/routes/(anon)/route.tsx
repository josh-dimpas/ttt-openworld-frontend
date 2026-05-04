import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Header } from "@/components/Header";

export const Route = createFileRoute("/(anon)")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="mx-auto flex h-full flex-col items-center">
            <Header />
            <Outlet />
        </div>
    );
}
